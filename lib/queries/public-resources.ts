import DOMPurify from "isomorphic-dompurify";
import { createClient } from "@/lib/supabase/server";
import { staffRoleLabels } from "@/types/staff";
import { getSubstackArticles } from "@/lib/substack";
import type { Resource, LibraryResource } from "@/types/content";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Homepage "Featured resources" grid — up to 5 published pieces marked
// feature=true in the CMS, most recently published first. Only the first
// gets the large card treatment (ResourceCard sizes off `feature`), matching
// the original 3-column asymmetric layout regardless of how many pieces are
// marked featured.
export async function listFeaturedResources(): Promise<Resource[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("resources")
    .select("slug, title, excerpt, tag, meta_label")
    .eq("status", "published")
    .eq("feature", true)
    .order("published_at", { ascending: false })
    .limit(5);

  return (data ?? []).map((r, i) => ({
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    tag: r.tag,
    meta: r.meta_label,
    feature: i === 0,
  }));
}

// Full /resources library — every published CMS resource, plus the written
// articles from Substack under their own "Substack" category (external
// link, real cover art) — same live-feed approach as Media's Spotify/
// Substack merge.
export async function listLibraryResources(): Promise<LibraryResource[]> {
  const supabase = await createClient();
  const [{ data }, substackArticles] = await Promise.all([
    supabase
      .from("resources")
      .select("slug, category, tag, title, excerpt, meta_label, cta_label, href")
      .eq("status", "published")
      .order("updated_at", { ascending: false }),
    getSubstackArticles(),
  ]);

  const cmsResources: LibraryResource[] = (data ?? []).map((r) => ({
    category: r.category,
    tag: r.tag,
    title: r.title,
    excerpt: r.excerpt,
    meta: r.meta_label,
    cta: r.cta_label || "Read →",
    href: r.category === "Articles" ? `/articles/${r.slug}` : r.href || "#",
  }));

  const substackResources: LibraryResource[] = substackArticles.map((a) => ({
    category: "Substack",
    tag: "Substack",
    title: a.title,
    excerpt: stripHtml(a.description).slice(0, 140),
    meta: new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    cta: "Read on Substack →",
    href: a.url,
    imageUrl: a.imageUrl,
  }));

  return [...cmsResources, ...substackResources];
}

export type ArticleDetail = {
  slug: string;
  tag: string;
  title: string;
  author: string;
  authorInitials: string;
  authorRole: string;
  readTime: string;
  updated: string;
  bodyHtml: string;
  related: { tag: string; title: string; cta: string; href: string }[];
};

function initialsFrom(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export async function getPublishedResourceBySlug(slug: string): Promise<ArticleDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("resources")
    .select(
      "id, slug, tag, title, body_html, updated_at, author:profiles(full_name, avatar_initials, role)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return null;

  const bodyHtml = data.body_html ? DOMPurify.sanitize(data.body_html) : "";
  const wordCount = bodyHtml
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const readTime = `${Math.max(1, Math.round(wordCount / 200))} min read`;
  const updated = `Updated ${new Date(data.updated_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;

  const author = data.author;
  const authorName = author?.full_name ?? "OBS Faculty";
  const authorInitials = author?.avatar_initials || initialsFrom(authorName);
  const authorRole = author ? staffRoleLabels[author.role] : "Teaching Team, Open Bible School";

  const { data: relatedRows } = await supabase
    .from("resources")
    .select("slug, tag, title, cta_label")
    .eq("status", "published")
    .neq("id", data.id)
    .order("updated_at", { ascending: false })
    .limit(3);

  return {
    slug: data.slug,
    tag: data.tag,
    title: data.title,
    author: authorName,
    authorInitials,
    authorRole,
    readTime,
    updated,
    bodyHtml,
    related: (relatedRows ?? []).map((r) => ({
      tag: r.tag,
      title: r.title,
      cta: r.cta_label || "Read more →",
      href: `/articles/${r.slug}`,
    })),
  };
}
