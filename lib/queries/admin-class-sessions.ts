import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database";

export type ClassSessionListItem = {
  id: string;
  title: string;
  series: string;
  durationLabel: string;
  recordedAt: string;
  status: Enums<"content_status">;
};

export async function listClassSessions(): Promise<ClassSessionListItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("class_sessions")
    .select("id, title, series, duration_label, recorded_at, status")
    .order("recorded_at", { ascending: false });

  return (data ?? []).map((s) => ({
    id: s.id,
    title: s.title,
    series: s.series,
    durationLabel: s.duration_label,
    recordedAt: s.recorded_at,
    status: s.status,
  }));
}

export type ClassSessionDetail = {
  id: string;
  slug: string;
  title: string;
  series: string;
  teacher: string;
  durationLabel: string;
  recordedAt: string;
  videoUrl: string | null;
  status: Enums<"content_status">;
};

export async function getClassSessionById(id: string): Promise<ClassSessionDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("class_sessions")
    .select("id, slug, title, series, teacher, duration_label, recorded_at, video_url, status")
    .eq("id", id)
    .single();

  if (!data) return null;
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    series: data.series,
    teacher: data.teacher,
    durationLabel: data.duration_label,
    recordedAt: data.recorded_at,
    videoUrl: data.video_url,
    status: data.status,
  };
}
