import { createClient } from "@/lib/supabase/server";
import type { Session } from "@/types/content";

type SessionRow = {
  slug: string;
  series: string;
  duration_label: string;
  title: string;
  teacher: string;
  recorded_at: string;
  waveform: number[];
  video_url: string | null;
};

function toSession(row: SessionRow): Session {
  return {
    slug: row.slug,
    series: row.series,
    duration: row.duration_label,
    title: row.title,
    teacher: row.teacher,
    recordedLabel: `Recorded ${new Date(row.recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    waveform: row.waveform,
    videoUrl: row.video_url,
  };
}

// Homepage "Missed a class?" carousel — most recently recorded published
// sessions.
export async function listRecentSessions(limit = 5): Promise<Session[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("class_sessions")
    .select("slug, series, duration_label, title, teacher, recorded_at, waveform, video_url")
    .eq("status", "published")
    .order("recorded_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map(toSession);
}

// Full /sessions library, plus the real set of series in use (free text, not
// an enum, so — same as reading plan categories — derived from what's
// actually published rather than a fixed list that could drift from it).
export async function listPublishedSessions(): Promise<{
  sessions: Session[];
  seriesList: string[];
}> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("class_sessions")
    .select("slug, series, duration_label, title, teacher, recorded_at, waveform, video_url")
    .eq("status", "published")
    .order("recorded_at", { ascending: false });

  const rows = data ?? [];
  const seriesList = Array.from(new Set(rows.map((r) => r.series))).sort();

  return {
    sessions: rows.map(toSession),
    seriesList,
  };
}
