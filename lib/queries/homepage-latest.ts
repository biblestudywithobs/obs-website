import { createClient } from "@/lib/supabase/server";
import { listMediaItems } from "@/lib/queries/public-media";
import type { LatestItem } from "@/types/content";

export const LATEST_TABS = ["Articles", "Podcasts", "Reading Plans", "Events"] as const;
export type LatestTab = (typeof LATEST_TABS)[number];

// Real "latest 3" per tab for the homepage's "Latest from OBS" section —
// replaces the old hardcoded lib/data/latest.ts, where every tab showed the
// same 3 fake articles regardless of which was selected.
export async function getLatestByTab(): Promise<Record<LatestTab, LatestItem[]>> {
  const supabase = await createClient();

  const [{ data: articleRows }, { data: planRows }, { data: eventRows }, mediaItems] =
    await Promise.all([
      supabase
        .from("resources")
        .select("slug, title, tag")
        .eq("status", "published")
        // Only "Articles" are guaranteed to have body content and route to
        // /articles/[slug] (see the same category check in public-resources.ts)
        // — other categories are downloadable/reference material, not reading.
        .eq("category", "Articles")
        .order("published_at", { ascending: false })
        .limit(3),
      supabase
        .from("reading_plans")
        .select("title, category, duration_days")
        .eq("status", "published")
        .order("updated_at", { ascending: false })
        .limit(3),
      supabase
        .from("events")
        .select("title, starts_at, location")
        .eq("status", "published")
        .order("starts_at", { ascending: false })
        .limit(3),
      listMediaItems(),
    ]);

  return {
    Articles: (articleRows ?? []).map((r) => ({
      title: r.title,
      meta: r.tag,
      href: `/articles/${r.slug}`,
    })),
    Podcasts: mediaItems.slice(0, 3).map((m) => ({
      title: m.title,
      meta:
        m.source === "both"
          ? "Spotify & Substack"
          : m.source === "spotify"
            ? "Spotify"
            : "Substack",
      href: "/media",
      imageUrl: m.imageUrl,
    })),
    "Reading Plans": (planRows ?? []).map((p) => ({
      title: p.title,
      meta: `${p.category} · ${p.duration_days} days`,
      href: "/reading-plans",
    })),
    Events: (eventRows ?? []).map((e) => ({
      title: e.title,
      meta: new Date(e.starts_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      href: "/events",
    })),
  };
}
