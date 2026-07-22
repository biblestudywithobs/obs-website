import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database";

type ResourceCategory = Enums<"resource_category">;
type ContentStatus = Enums<"content_status">;

export type ResourceListItem = {
  id: string;
  slug: string;
  title: string;
  category: ResourceCategory;
  tag: string;
  status: ContentStatus;
  feature: boolean;
  updatedAt: string;
};

export async function listResources(category?: string): Promise<ResourceListItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("resources")
    .select("id, slug, title, category, tag, status, feature, updated_at")
    .order("updated_at", { ascending: false });
  if (category) query = query.eq("category", category as ResourceCategory);

  const { data } = await query;
  return (data ?? []).map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    tag: r.tag,
    status: r.status,
    feature: r.feature,
    updatedAt: r.updated_at,
  }));
}

export type ResourceDetail = {
  id: string;
  slug: string;
  title: string;
  category: ResourceCategory;
  tag: string;
  excerpt: string;
  metaLabel: string;
  ctaLabel: string;
  href: string | null;
  feature: boolean;
  status: ContentStatus;
  authorId: string | null;
  bodyHtml: string;
};

export async function getResourceById(id: string): Promise<ResourceDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("resources")
    .select(
      "id, slug, title, category, tag, excerpt, meta_label, cta_label, href, feature, status, author_id, body_html",
    )
    .eq("id", id)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    category: data.category,
    tag: data.tag,
    excerpt: data.excerpt,
    metaLabel: data.meta_label,
    ctaLabel: data.cta_label,
    href: data.href,
    feature: data.feature,
    status: data.status,
    authorId: data.author_id,
    bodyHtml: data.body_html ?? "",
  };
}

export type AuthorOption = { id: string; fullName: string };

export async function listAuthors(): Promise<AuthorOption[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("id, full_name").order("full_name");
  return (data ?? []).map((p) => ({ id: p.id, fullName: p.full_name }));
}
