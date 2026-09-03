import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeArticleHtml } from "@/lib/sanitize-html";
import type { ReadingPlan, ReadingPlanDay } from "@/types/content";

export type FeaturedPlan = {
  slug: string;
  title: string;
  excerpt: string;
  durationDays: number;
  imageUrl: string | null;
};

// The featured teaser block at the top of /reading-plans — the most
// recently updated published plan marked `featured` in the CMS, or null if
// none is marked (the block just doesn't render, rather than showing
// invented copy).
export async function getFeaturedReadingPlan(): Promise<FeaturedPlan | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("reading_plans")
    .select("slug, title, excerpt, duration_days, image_url")
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
    imageUrl: data.image_url,
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
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("reading_plans")
    .select("slug, category, duration_days, title, excerpt, image_url, plan_type")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  const rows = (data ?? []).filter((p) => p.slug !== excludeSlug);
  const categories = Array.from(new Set(rows.map((p) => p.category))).sort();

  return {
    plans: rows.map((p) => ({
      slug: p.slug,
      category: p.category,
      duration: `${p.duration_days} day${p.duration_days === 1 ? "" : "s"}`,
      title: p.title,
      excerpt: p.excerpt,
      imageUrl: p.image_url,
      planType: p.plan_type,
    })),
    categories,
  };
}

// Slugs for every published plan — feeds generateStaticParams() on
// /reading-plans/[slug] so each one is prerendered at build time instead of
// on each visitor's first cold hit.
export async function listPublishedReadingPlanSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("reading_plans").select("slug").eq("status", "published");
  return (data ?? []).map((p) => p.slug);
}

export type ReadingPlanArticle = {
  slug: string;
  title: string;
  category: string;
  duration: string;
  excerpt: string;
  bodyHtml: string;
  imageUrl: string | null;
  updated: string;
  planType: "reading_plan" | "commentary";
  status: "draft" | "in_review" | "published";
  days: ReadingPlanDay[];
};

async function fetchDays(
  supabase: ReturnType<typeof createPublicClient> | ReturnType<typeof createAdminClient>,
  planId: string,
): Promise<ReadingPlanDay[]> {
  const { data } = await supabase
    .from("reading_plan_days")
    .select("day_number, title, passage_ref, content")
    .eq("plan_id", planId)
    .order("day_number", { ascending: true });

  return (data ?? []).map((d) => ({
    dayNumber: d.day_number,
    title: d.title,
    passageRef: d.passage_ref ?? "",
    contentHtml: d.content ? sanitizeArticleHtml(d.content) : "",
  }));
}

export async function getPublishedReadingPlanBySlug(
  slug: string,
): Promise<ReadingPlanArticle | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("reading_plans")
    .select(
      "id, slug, title, category, duration_days, excerpt, body_html, image_url, updated_at, plan_type, status",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return null;

  const days = data.plan_type === "commentary" ? await fetchDays(supabase, data.id) : [];

  return {
    slug: data.slug,
    title: data.title,
    category: data.category,
    duration: `${data.duration_days} day${data.duration_days === 1 ? "" : "s"}`,
    excerpt: data.excerpt,
    bodyHtml: data.body_html ? sanitizeArticleHtml(data.body_html) : "",
    imageUrl: data.image_url,
    updated: `Updated ${new Date(data.updated_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`,
    planType: data.plan_type,
    status: data.status,
    days,
  };
}

// Draft-preview lookup by capability token — bypasses RLS via the
// service-role client since a draft/in-review plan is invisible to anon
// under the normal `status = 'published'` policy. Security relies entirely
// on the token being unguessable and this being an exact single-row match,
// never a listing — guard every call site accordingly.
export async function getReadingPlanByPreviewToken(
  token: string,
): Promise<ReadingPlanArticle | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("reading_plans")
    .select(
      "id, slug, title, category, duration_days, excerpt, body_html, image_url, updated_at, plan_type, status",
    )
    .eq("preview_token", token)
    .single();

  if (!data) return null;

  const days = data.plan_type === "commentary" ? await fetchDays(supabase, data.id) : [];

  return {
    slug: data.slug,
    title: data.title,
    category: data.category,
    duration: `${data.duration_days} day${data.duration_days === 1 ? "" : "s"}`,
    excerpt: data.excerpt,
    bodyHtml: data.body_html ? sanitizeArticleHtml(data.body_html) : "",
    imageUrl: data.image_url,
    updated: `Updated ${new Date(data.updated_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`,
    planType: data.plan_type,
    status: data.status,
    days,
  };
}
