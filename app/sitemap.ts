import type { MetadataRoute } from "next";
import { listPublishedArticleSlugs } from "@/lib/queries/public-resources";
import { listPublishedReadingPlanSlugs } from "@/lib/queries/public-reading-plans";
import { SITE_URL } from "@/lib/site";

// Regenerated with the same ISR window as the homepage so newly published
// articles and reading plans are picked up by Google within the hour.
export const revalidate = 3600;

const STATIC_ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/reading-plans", priority: 0.9, changeFrequency: "weekly" },
  { path: "/resources", priority: 0.9, changeFrequency: "weekly" },
  { path: "/sessions", priority: 0.8, changeFrequency: "weekly" },
  { path: "/events", priority: 0.8, changeFrequency: "weekly" },
  { path: "/media", priority: 0.7, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/community", priority: 0.7, changeFrequency: "monthly" },
  { path: "/community/volunteer", priority: 0.7, changeFrequency: "monthly" },
  { path: "/community/internships", priority: 0.6, changeFrequency: "monthly" },
  { path: "/community/bible-study-partners", priority: 0.6, changeFrequency: "monthly" },
  { path: "/community/groups", priority: 0.6, changeFrequency: "monthly" },
  { path: "/community/team", priority: 0.5, changeFrequency: "monthly" },
  { path: "/partnerships", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [planSlugs, articleSlugs] = await Promise.all([
    listPublishedReadingPlanSlugs(),
    listPublishedArticleSlugs(),
  ]);

  return [
    ...STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency,
      priority,
    })),
    ...planSlugs.map((slug) => ({
      url: `${SITE_URL}/reading-plans/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...articleSlugs.map((slug) => ({
      url: `${SITE_URL}/articles/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
