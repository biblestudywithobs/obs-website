import { createClient } from "@/lib/supabase/server";

export type Metric = {
  label: string;
  value: string;
  trend: { direction: "up" | "down"; value: string } | null;
  icon: React.ReactNode;
};

const icons = {
  subscribers: (
    <>
      <path d="M3 16V8l7-5 7 5v8" stroke="#2B2420" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8 16v-5h4v5" stroke="#2B2420" strokeWidth="1.4" />
    </>
  ),
  resources: (
    <path
      d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      stroke="#2B2420"
      strokeWidth="1.4"
    />
  ),
  staff: (
    <>
      <circle cx="10" cy="7" r="3" stroke="#2B2420" strokeWidth="1.4" />
      <path
        d="M4 17c0-3 2.7-5 6-5s6 2 6 5"
        stroke="#2B2420"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </>
  ),
  applications: (
    <>
      <path
        d="M3 6a1 1 0 011-1h12a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1z"
        stroke="#2B2420"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M3 6l7 5 7-5" stroke="#2B2420" strokeWidth="1.4" strokeLinejoin="round" />
    </>
  ),
};

function trendFrom(thisWeek: number, lastWeek: number): Metric["trend"] {
  if (thisWeek === 0 && lastWeek === 0) return null;
  const direction = thisWeek >= lastWeek ? "up" : "down";
  if (lastWeek === 0) return { direction, value: "new" };
  const pct = Math.round((Math.abs(thisWeek - lastWeek) / lastWeek) * 100);
  return { direction, value: `${pct}%` };
}

export async function getOverviewMetrics(): Promise<Metric[]> {
  const supabase = await createClient();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
  const twoWeeksAgo = new Date(now.getTime() - 14 * 86400000).toISOString();

  const [
    { count: subscriberTotal },
    { count: subscribersThisWeek },
    { count: subscribersLastWeek },
    { count: resourcesPublished },
    { count: staffTotal },
    { count: applicationsThisWeek },
    { count: applicationsLastWeek },
  ] = await Promise.all([
    supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
    supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .gte("subscribed_at", weekAgo),
    supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .gte("subscribed_at", twoWeeksAgo)
      .lt("subscribed_at", weekAgo),
    supabase
      .from("resources")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("community_applications")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo),
    supabase
      .from("community_applications")
      .select("*", { count: "exact", head: true })
      .gte("created_at", twoWeeksAgo)
      .lt("created_at", weekAgo),
  ]);

  return [
    {
      label: "Newsletter subscribers",
      value: String(subscriberTotal ?? 0),
      trend: trendFrom(subscribersThisWeek ?? 0, subscribersLastWeek ?? 0),
      icon: icons.subscribers,
    },
    {
      label: "Published resources",
      value: String(resourcesPublished ?? 0),
      trend: null,
      icon: icons.resources,
    },
    {
      label: "Staff members",
      value: String(staffTotal ?? 0),
      trend: null,
      icon: icons.staff,
    },
    {
      label: "Applications this week",
      value: String(applicationsThisWeek ?? 0),
      trend: trendFrom(applicationsThisWeek ?? 0, applicationsLastWeek ?? 0),
      icon: icons.applications,
    },
  ];
}

export type ActivityItem = {
  html: React.ReactNode;
  meta: string;
  timestamp: string;
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

const areaLabels: Record<string, string> = {
  volunteer: "Volunteer Opportunities",
  bible_study_partner: "Bible Study Partners",
  internship: "Internships",
  community_group: "Community Groups",
  team: "Join the OBS Team",
};

export async function getRecentActivity(limit = 6): Promise<ActivityItem[]> {
  const supabase = await createClient();

  const [{ data: applications }, { data: messages }, { data: published }] = await Promise.all([
    supabase
      .from("community_applications")
      .select("name, area, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("contact_messages")
      .select("name, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("resources")
      .select("title, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit),
  ]);

  const items: ActivityItem[] = [
    ...(applications ?? []).map((a) => ({
      html: (
        <>
          <b>{a.name}</b> applied for <b>{areaLabels[a.area] ?? a.area}</b>
        </>
      ),
      meta: `Applications · ${timeAgo(a.created_at)}`,
      timestamp: a.created_at,
    })),
    ...(messages ?? []).map((m) => ({
      html: (
        <>
          <b>{m.name}</b> sent a contact message
        </>
      ),
      meta: `Contact · ${timeAgo(m.created_at)}`,
      timestamp: m.created_at,
    })),
    ...(published ?? [])
      .filter((r) => r.published_at)
      .map((r) => ({
        html: (
          <>
            <b>{r.title}</b> was published
          </>
        ),
        meta: `Resources · ${timeAgo(r.published_at!)}`,
        timestamp: r.published_at!,
      })),
  ];

  return items
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

export type StatusBreakdown = { label: string; percent: number; count: number };

export async function getContentStatusBreakdown(): Promise<StatusBreakdown[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("resources").select("status");
  const rows = data ?? [];
  const total = rows.length || 1;

  const counts = { published: 0, in_review: 0, draft: 0 };
  for (const r of rows) {
    if (r.status in counts) counts[r.status as keyof typeof counts]++;
  }

  return [
    {
      label: "Published",
      percent: Math.round((counts.published / total) * 100),
      count: counts.published,
    },
    {
      label: "In review",
      percent: Math.round((counts.in_review / total) * 100),
      count: counts.in_review,
    },
    { label: "Draft", percent: Math.round((counts.draft / total) * 100), count: counts.draft },
  ];
}

export type NeedsAttentionItem = {
  title: string;
  meta: string;
  tag: string;
};

// Replaces the old fake "Your tasks" panel — there's no real task-tracking
// concept in the data model, so this surfaces genuinely unreviewed
// applications instead of inventing one.
export async function getNeedsAttention(limit = 6): Promise<NeedsAttentionItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("community_applications")
    .select("name, area, created_at")
    .eq("status", "new")
    .order("created_at", { ascending: true })
    .limit(limit);

  return (data ?? []).map((a) => ({
    title: `Review ${a.name}'s application`,
    meta: timeAgo(a.created_at),
    tag: areaLabels[a.area] ?? a.area,
  }));
}
