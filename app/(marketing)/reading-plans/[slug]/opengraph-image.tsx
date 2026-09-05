import { getPublishedReadingPlanBySlug } from "@/lib/queries/public-reading-plans";
import { renderReadingPlanOgImage, OG_IMAGE_SIZE } from "@/lib/og/reading-plan-og-image";

export const runtime = "nodejs";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";
export const alt = "Open Bible School";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = await getPublishedReadingPlanBySlug(slug);

  if (!plan) {
    return renderReadingPlanOgImage({
      title: "Open Bible School",
      excerpt: "",
      imageUrl: null,
      category: "",
      planType: "reading_plan",
      status: "published",
    });
  }

  return renderReadingPlanOgImage(plan);
}
