"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { EDITOR_TIER_ROLES } from "@/types/staff";
import { createClient } from "@/lib/supabase/server";
import { uploadPublicFile } from "@/lib/storage";
import { slugify } from "@/lib/slugify";
import type { Enums } from "@/types/database";

export type SaveEventState = { error: string | null };

export async function saveEvent(
  _prevState: SaveEventState,
  formData: FormData,
): Promise<SaveEventState> {
  // Matches the events_write RLS policy scope.
  await requireRole(EDITOR_TIER_ROLES);

  const id = String(formData.get("id") ?? "").trim() || null;
  const title = String(formData.get("title") ?? "").trim();
  const startsAtLocal = String(formData.get("startsAt") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const status = String(formData.get("status") ?? "draft") as Enums<"content_status">;

  if (!title || !startsAtLocal || !location) {
    return { error: "Title, date/time, and location are required." };
  }

  let slug = String(formData.get("slug") ?? "").trim();
  if (!slug) slug = slugify(title);

  const supabase = await createClient();

  let flyerUrl = String(formData.get("existingFlyerUrl") ?? "").trim() || null;
  const flyer = formData.get("flyer");
  if (flyer instanceof File && flyer.size > 0) {
    const { url, error } = await uploadPublicFile(supabase, flyer, "events");
    if (error) return { error: `Flyer upload failed: ${error}` };
    flyerUrl = url;
  }

  const payload = {
    slug,
    title,
    starts_at: new Date(startsAtLocal).toISOString(),
    location,
    description: String(formData.get("description") ?? "").trim() || null,
    register_url: String(formData.get("registerUrl") ?? "").trim() || null,
    flyer_url: flyerUrl,
    status,
  };

  if (id) {
    const { error } = await supabase.from("events").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("events").insert(payload);
    if (error) return { error: error.message };
  }

  redirect("/admin/events");
}

export async function deleteEvent(id: string) {
  await requireRole(EDITOR_TIER_ROLES);
  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", id);
  redirect("/admin/events");
}

// Called directly from the list page's checkbox selection (not a form
// submission), so it revalidates in place rather than redirecting.
export async function bulkDeleteEvents(ids: string[]) {
  await requireRole(EDITOR_TIER_ROLES);
  if (ids.length === 0) return;
  const supabase = await createClient();
  await supabase.from("events").delete().in("id", ids);
  revalidatePath("/admin/events");
}
