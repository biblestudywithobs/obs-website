import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database";

export type ReadingPlanListItem = {
  id: string;
  title: string;
  category: string;
  durationDays: number;
  featured: boolean;
  status: Enums<"content_status">;
};

export async function listReadingPlans(): Promise<ReadingPlanListItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reading_plans")
    .select("id, title, category, duration_days, featured, status")
    .order("updated_at", { ascending: false });

  return (data ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    durationDays: p.duration_days,
    featured: p.featured,
    status: p.status,
  }));
}

export type ReadingPlanDetail = {
  id: string;
  slug: string;
  title: string;
  category: string;
  durationDays: number;
  excerpt: string;
  featured: boolean;
  status: Enums<"content_status">;
};

export async function getReadingPlanById(id: string): Promise<ReadingPlanDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reading_plans")
    .select("id, slug, title, category, duration_days, excerpt, featured, status")
    .eq("id", id)
    .single();

  if (!data) return null;
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    category: data.category,
    durationDays: data.duration_days,
    excerpt: data.excerpt,
    featured: data.featured,
    status: data.status,
  };
}
