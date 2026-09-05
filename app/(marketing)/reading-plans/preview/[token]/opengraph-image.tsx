import { getReadingPlanByPreviewToken } from "@/lib/queries/public-reading-plans";
import { renderReadingPlanOgImage, OG_IMAGE_SIZE } from "@/lib/og/reading-plan-og-image";

export const runtime = "nodejs";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";
export const alt = "Draft preview — Open Bible School";

export default async function Image({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const plan = await getReadingPlanByPreviewToken(token);

  if (!plan) {
    return renderReadingPlanOgImage({
      title: "Draft preview",
      excerpt: "",
      imageUrl: null,
      category: "",
      planType: "reading_plan",
      status: "draft",
    });
  }

  return renderReadingPlanOgImage(plan);
}
