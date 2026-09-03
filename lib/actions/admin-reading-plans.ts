"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";
import { sanitizeArticleHtml, isBlankHtml } from "@/lib/sanitize-html";
import { uploadPublicFile } from "@/lib/storage";
import type { Enums } from "@/types/database";

export type SaveReadingPlanState = { error: string | null };

// Days arrive as day_title_0, day_passageRef_0, day_content_0, ... plus a
// dayCount field — RichTextEditor already syncs each day's content into a
// hidden input the same way the single-body editor does, so this is just
// ordinary FormData, no client-side JSON serialization needed.
function parseDaysFromFormData(formData: FormData): {
  dayNumber: number;
  title: string;
  passageRef: string;
  content: string;
}[] {
  const dayCount = Number(formData.get("dayCount") ?? 0);
  const days = [];
  for (let i = 0; i < dayCount; i++) {
    const title = String(formData.get(`day_title_${i}`) ?? "").trim();
    const passageRef = String(formData.get(`day_passageRef_${i}`) ?? "").trim();
    const rawContent = String(formData.get(`day_content_${i}`) ?? "").trim();
    days.push({
      dayNumber: i + 1,
      title: title || `Day ${i + 1}`,
      passageRef,
      content: isBlankHtml(rawContent) ? "" : sanitizeArticleHtml(rawContent),
    });
  }
  return days;
}

async function saveReadingPlanDays(
  supabase: Awaited<ReturnType<typeof createClient>>,
  planId: string,
  days: { dayNumber: number; title: string; passageRef: string; content: string }[],
) {
  if (days.length > 0) {
    const { error } = await supabase.from("reading_plan_days").upsert(
      days.map((d) => ({
        plan_id: planId,
        day_number: d.dayNumber,
        title: d.title,
        passage_ref: d.passageRef || null,
        content: d.content || null,
      })),
      { onConflict: "plan_id,day_number" },
    );
    if (error) return error.message;
  }

  // Duration shrank — drop any day rows beyond the current count.
  const { error: deleteError } = await supabase
    .from("reading_plan_days")
    .delete()
    .eq("plan_id", planId)
    .gt("day_number", days.length);
  if (deleteError) return deleteError.message;

  return null;
}

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
  const planType = String(formData.get("planType") ?? "reading_plan") as Enums<"reading_plan_type">;
  const rawBodyHtml = String(formData.get("bodyHtml") ?? "").trim();
  const bodyHtml = isBlankHtml(rawBodyHtml) ? null : sanitizeArticleHtml(rawBodyHtml);

  if (!title || !category || !excerpt || !durationDays) {
    return { error: "Title, category, duration, and excerpt are required." };
  }

  let slug = String(formData.get("slug") ?? "").trim();
  if (!slug) slug = slugify(title);

  const supabase = await createClient();

  let imageUrl = String(formData.get("existingImageUrl") ?? "").trim() || null;
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    const { url, error } = await uploadPublicFile(supabase, image, "reading-plans");
    if (error) return { error: `Image upload failed: ${error}` };
    imageUrl = url;
  }

  const payload = {
    slug,
    title,
    category,
    duration_days: durationDays,
    excerpt,
    body_html: planType === "reading_plan" ? bodyHtml : null,
    image_url: imageUrl,
    featured,
    status,
    plan_type: planType,
  };

  let planId = id;
  if (id) {
    const { error } = await supabase.from("reading_plans").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase.from("reading_plans").insert(payload).select("id").single();
    if (error) return { error: error.message };
    planId = data.id;
  }

  if (planType === "commentary" && planId) {
    const days = parseDaysFromFormData(formData);
    const dayError = await saveReadingPlanDays(supabase, planId, days);
    if (dayError) return { error: dayError };
  }

  // Public pages are statically cached (see lib/supabase/public.ts) — a
  // plan that was published, then edited back to draft (or vice versa),
  // could otherwise keep serving its old cached response.
  revalidatePath("/reading-plans");
  revalidatePath(`/reading-plans/${slug}`);
  revalidatePath("/");

  redirect("/admin/reading-plans");
}

export async function deleteReadingPlan(id: string) {
  await requireProfile();
  const supabase = await createClient();
  const { data: existing } = await supabase.from("reading_plans").select("slug").eq("id", id).single();
  await supabase.from("reading_plans").delete().eq("id", id);
  revalidatePath("/reading-plans");
  revalidatePath("/");
  if (existing) revalidatePath(`/reading-plans/${existing.slug}`);
  redirect("/admin/reading-plans");
}

// Called directly from the list page's checkbox selection (not a form
// submission), so it revalidates in place rather than redirecting.
export async function bulkDeleteReadingPlans(ids: string[]) {
  await requireProfile();
  if (ids.length === 0) return;
  const supabase = await createClient();
  const { data: existing } = await supabase.from("reading_plans").select("slug").in("id", ids);
  await supabase.from("reading_plans").delete().in("id", ids);
  revalidatePath("/admin/reading-plans");
  revalidatePath("/reading-plans");
  revalidatePath("/");
  for (const p of existing ?? []) revalidatePath(`/reading-plans/${p.slug}`);
}

export async function regeneratePreviewToken(id: string): Promise<{ token: string } | { error: string }> {
  await requireProfile();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reading_plans")
    .update({ preview_token: crypto.randomUUID() })
    .eq("id", id)
    .select("preview_token")
    .single();
  if (error) return { error: error.message };
  revalidatePath(`/admin/reading-plans/${id}`);
  return { token: data.preview_token };
}
