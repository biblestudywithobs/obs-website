"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";
import type { Enums } from "@/types/database";

export type SaveReadingPlanState = { error: string | null };

export async function saveReadingPlan(
  _prevState: SaveReadingPlanState,
  formData: FormData,
): Promise<SaveReadingPlanState> {
  // Matches the reading_plans_write RLS policy scope (is_staff() — every role).
  await requireProfile();

  const id = String(formData.get("id") ?? "").trim() || null;
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const durationDays = Number(formData.get("durationDays") ?? 0);
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const status = String(formData.get("status") ?? "draft") as Enums<"content_status">;
  const featured = formData.get("featured") === "on";

  if (!title || !category || !excerpt || !durationDays) {
    return { error: "Title, category, duration, and excerpt are required." };
  }

  let slug = String(formData.get("slug") ?? "").trim();
  if (!slug) slug = slugify(title);

  const payload = {
    slug,
    title,
    category,
    duration_days: durationDays,
    excerpt,
    featured,
    status,
  };

  const supabase = await createClient();

  if (id) {
    const { error } = await supabase.from("reading_plans").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("reading_plans").insert(payload);
    if (error) return { error: error.message };
  }

  redirect("/admin/reading-plans");
}

export async function deleteReadingPlan(id: string) {
  await requireProfile();
  const supabase = await createClient();
  await supabase.from("reading_plans").delete().eq("id", id);
  redirect("/admin/reading-plans");
}

// Called directly from the list page's checkbox selection (not a form
// submission), so it revalidates in place rather than redirecting.
export async function bulkDeleteReadingPlans(ids: string[]) {
  await requireProfile();
  if (ids.length === 0) return;
  const supabase = await createClient();
  await supabase.from("reading_plans").delete().in("id", ids);
  revalidatePath("/admin/reading-plans");
}
