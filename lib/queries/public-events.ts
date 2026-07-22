import { createClient } from "@/lib/supabase/server";

export type PublicEvent = {
  slug: string;
  title: string;
  month: string;
  day: string;
  time: string;
  location: string;
  registerUrl: string | null;
  startsAt: string;
};

function formatEvent(e: {
  slug: string;
  title: string;
  starts_at: string;
  location: string;
  register_url: string | null;
}): PublicEvent {
  const d = new Date(e.starts_at);
  return {
    slug: e.slug,
    title: e.title,
    month: d.toLocaleDateString("en-US", { month: "short" }),
    day: d.toLocaleDateString("en-US", { day: "2-digit" }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) + " WAT",
    location: e.location,
    registerUrl: e.register_url,
    startsAt: e.starts_at,
  };
}

// Splits published events into upcoming (ascending) and past (descending) —
// backs the real Upcoming/Past tab toggle on /events.
export async function listPublishedEvents(): Promise<{
  upcoming: PublicEvent[];
  past: PublicEvent[];
}> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const [{ data: upcomingRows }, { data: pastRows }] = await Promise.all([
    supabase
      .from("events")
      .select("slug, title, starts_at, location, register_url")
      .eq("status", "published")
      .gte("starts_at", nowIso)
      .order("starts_at", { ascending: true }),
    supabase
      .from("events")
      .select("slug, title, starts_at, location, register_url")
      .eq("status", "published")
      .lt("starts_at", nowIso)
      .order("starts_at", { ascending: false }),
  ]);

  return {
    upcoming: (upcomingRows ?? []).map(formatEvent),
    past: (pastRows ?? []).map(formatEvent),
  };
}

// Real calendar cells for the month of `reference` (defaults to today),
// with a dot on any day that has a published event.
export async function getEventCalendar(reference: Date = new Date()) {
  const supabase = await createClient();
  const year = reference.getFullYear();
  const month = reference.getMonth();
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 1);

  const { data } = await supabase
    .from("events")
    .select("title, starts_at")
    .eq("status", "published")
    .gte("starts_at", monthStart.toISOString())
    .lt("starts_at", monthEnd.toISOString());

  const eventDays: Record<number, string> = {};
  for (const e of data ?? []) {
    const day = new Date(e.starts_at).getDate();
    eventDays[day] = e.title.length > 14 ? `${e.title.slice(0, 12)}…` : e.title;
  }

  return {
    label: reference.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    leadingEmpty: monthStart.getDay(),
    daysInMonth: new Date(year, month + 1, 0).getDate(),
    eventDays,
  };
}
