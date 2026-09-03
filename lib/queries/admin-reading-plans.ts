import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database";

export type ReadingPlanListItem = {
  id: string;
  title: string;
  category: string;
  durationDays: number;
  featured: boolean;
  status: Enums<"content_status">;
  planType: Enums<"reading_plan_type">;
};

export async function listReadingPlans(): Promise<ReadingPlanListItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reading_plans")
    .select("id, title, category, duration_days, featured, status, plan_type")
    .order("updated_at", { ascending: false });

  return (data ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    durationDays: p.duration_days,
    featured: p.featured,
    status: p.status,
    planType: p.plan_type,
  }));
}

export type ReadingPlanDayDraft = {
  id: string | null;
  dayNumber: number;
  title: string;
  passageRef: string;
  content: string;
};

export type ReadingPlanDetail = {
  id: string;
  slug: string;
  title: string;
  category: string;
  durationDays: number;
  excerpt: string;
  bodyHtml: string;
  imageUrl: string | null;
  featured: boolean;
  status: Enums<"content_status">;
  planType: Enums<"reading_plan_type">;
  previewToken: string;
  days: ReadingPlanDayDraft[];
};

export async function getReadingPlanById(id: string): Promise<ReadingPlanDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reading_plans")
    .select(
      "id, slug, title, category, duration_days, excerpt, body_html, image_url, featured, status, plan_type, preview_token",
    )
    .eq("id", id)
    .single();

  if (!data) return null;

  const days: ReadingPlanDayDraft[] = [];
  if (data.plan_type === "commentary") {
    const { data: dayRows } = await supabase
      .from("reading_plan_days")
      .select("id, day_number, title, passage_ref, content")
      .eq("plan_id", id)
      .order("day_number", { ascending: true });

    for (const d of dayRows ?? []) {
      days.push({
        id: d.id,
        dayNumber: d.day_number,
        title: d.title,
        passageRef: d.passage_ref ?? "",
        content: d.content ?? "",
      });
    }
  }

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    category: data.category,
    durationDays: data.duration_days,
    excerpt: data.excerpt,
    bodyHtml: data.body_html ?? "",
    imageUrl: data.image_url,
    featured: data.featured,
    status: data.status,
    planType: data.plan_type,
    previewToken: data.preview_token,
    days,
  };
}
