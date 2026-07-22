import { createClient } from "@/lib/supabase/server";
import type { ReadingPlan } from "@/types/content";

export type FeaturedPlan = {
  slug: string;
  title: string;
  excerpt: string;
  durationDays: number;
};

// The featured teaser block at the top of /reading-plans — the most
// recently updated published plan marked `featured` in the CMS, or null if
// none is marked (the block just doesn't render, rather than showing
// invented copy).
export async function getFeaturedReadingPlan(): Promise<FeaturedPlan | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reading_plans")
    .select("slug, title, excerpt, duration_days")
    .eq("status", "published")
    .eq("featured", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  return {
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    durationDays: data.duration_days,
  };
}

// Every published plan except the one already shown in the featured teaser
// (so it isn't duplicated in the grid below it), plus the real set of
// categories actually in use (category is free text, not an enum, so the
// filter chips are derived from what's really published rather than a fixed
// list that could drift from it).
export async function listPublishedReadingPlans(
  excludeSlug?: string,
): Promise<{ plans: ReadingPlan[]; categories: string[] }> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reading_plans")
    .select("slug, category, duration_days, title, excerpt")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  const rows = (data ?? []).filter((p) => p.slug !== excludeSlug);
  const categories = Array.from(new Set(rows.map((p) => p.category))).sort();

  return {
    plans: rows.map((p) => ({
      category: p.category,
      duration: `${p.duration_days} day${p.duration_days === 1 ? "" : "s"}`,
      title: p.title,
      excerpt: p.excerpt,
    })),
    categories,
  };
}
