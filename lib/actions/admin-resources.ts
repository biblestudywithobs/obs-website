"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import DOMPurify from "isomorphic-dompurify";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";
import type { Enums } from "@/types/database";

export type SaveResourceState = { error: string | null };

export async function saveResource(
  _prevState: SaveResourceState,
  formData: FormData,
): Promise<SaveResourceState> {
  // Matches the resources_write RLS policy scope (is_staff() — every role).
  await requireProfile();

  const id = String(formData.get("id") ?? "").trim() || null;
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "") as Enums<"resource_category">;
  const status = String(formData.get("status") ?? "draft") as Enums<"content_status">;

  if (!title || !category) {
    return { error: "Title and category are required." };
  }

  let slug = String(formData.get("slug") ?? "").trim();
  if (!slug) slug = slugify(title);

  const authorId = String(formData.get("authorId") ?? "").trim() || null;
  const feature = formData.get("feature") === "on";

  // Sanitized server-side too, not just trusted from the editor client — the
  // public article page renders this with dangerouslySetInnerHTML.
  const rawBodyHtml = String(formData.get("bodyHtml") ?? "").trim();
  const bodyHtml = rawBodyHtml ? DOMPurify.sanitize(rawBodyHtml) : null;

  const supabase = await createClient();

  const payload = {
    slug,
    title,
    category,
    tag: String(formData.get("tag") ?? "").trim() || category,
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    meta_label: String(formData.get("metaLabel") ?? "").trim(),
    cta_label: String(formData.get("ctaLabel") ?? "").trim() || "Read →",
    href: String(formData.get("href") ?? "").trim() || null,
    feature,
    author_id: authorId,
    status,
    body_html: bodyHtml,
  };

  if (id) {
    // Only stamp published_at the first time a piece goes live.
    const { data: existing } = await supabase
      .from("resources")
      .select("published_at")
      .eq("id", id)
      .single();
    const publishedAt =
      status === "published"
        ? (existing?.published_at ?? new Date().toISOString())
        : (existing?.published_at ?? null);

    const { error } = await supabase
      .from("resources")
      .update({ ...payload, published_at: publishedAt })
      .eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("resources").insert({
      ...payload,
      published_at: status === "published" ? new Date().toISOString() : null,
    });
    if (error) return { error: error.message };
  }

  redirect("/cms");
}

export async function deleteResource(id: string) {
  await requireProfile();
  const supabase = await createClient();
  await supabase.from("resources").delete().eq("id", id);
  redirect("/cms");
}

// Called directly from the list page's checkbox selection (not a form
// submission), so it revalidates in place rather than redirecting.
export async function bulkDeleteResources(ids: string[]) {
  await requireProfile();
  if (ids.length === 0) return;
  const supabase = await createClient();
  await supabase.from("resources").delete().in("id", ids);
  revalidatePath("/cms");
}
