"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";
import type { Enums } from "@/types/database";

// Decorative bar heights only (see types/content.ts) — not derived from the
// real audio, so every session gets the same default pattern; not exposed
// as an editable field.
const DEFAULT_WAVEFORM = [
  40, 65, 50, 80, 45, 70, 55, 90, 60, 75, 50, 65, 40, 80, 55, 70, 45, 85, 60, 50,
];

export type SaveClassSessionState = { error: string | null };

export async function saveClassSession(
  _prevState: SaveClassSessionState,
  formData: FormData,
): Promise<SaveClassSessionState> {
  // Matches the class_sessions_write RLS scope (is_staff() — every role).
  await requireProfile();

  const id = String(formData.get("id") ?? "").trim() || null;
  const title = String(formData.get("title") ?? "").trim();
  const series = String(formData.get("series") ?? "").trim();
  const teacher = String(formData.get("teacher") ?? "").trim();
  const durationLabel = String(formData.get("durationLabel") ?? "").trim();
  const recordedAt = String(formData.get("recordedAt") ?? "").trim();
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();
  const status = String(formData.get("status") ?? "draft") as Enums<"content_status">;

  if (!title || !series || !teacher || !durationLabel || !recordedAt) {
    return { error: "Title, series, teacher, duration, and recorded date are required." };
  }

  let slug = String(formData.get("slug") ?? "").trim();
  if (!slug) slug = slugify(title);

  const supabase = await createClient();

  if (id) {
    const payload = {
      slug,
      title,
      series,
      teacher,
      duration_label: durationLabel,
      recorded_at: recordedAt,
      video_url: videoUrl || null,
      status,
    };
    const { error } = await supabase.from("class_sessions").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const payload = {
      slug,
      title,
      series,
      teacher,
      duration_label: durationLabel,
      recorded_at: recordedAt,
      video_url: videoUrl || null,
      status,
      waveform: DEFAULT_WAVEFORM,
    };
    const { error } = await supabase.from("class_sessions").insert(payload);
    if (error) return { error: error.message };
  }

  redirect("/admin/class-sessions");
}

export async function deleteClassSession(id: string) {
  await requireProfile();
  const supabase = await createClient();
  await supabase.from("class_sessions").delete().eq("id", id);
  redirect("/admin/class-sessions");
}

export async function bulkDeleteClassSessions(ids: string[]) {
  await requireProfile();
  if (ids.length === 0) return;
  const supabase = await createClient();
  await supabase.from("class_sessions").delete().in("id", ids);
  revalidatePath("/admin/class-sessions");
}
