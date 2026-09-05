import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { ReadingPlanDetailView } from "@/components/sections/ReadingPlanDetailView";
import { getReadingPlanByPreviewToken } from "@/lib/queries/public-reading-plans";

// Deliberately NOT cached (unlike the rest of the public site) — this is a
// capability URL, and "Regenerate" on the editor relies on an old token
// 404ing immediately, not serving a stale cached render.
export const dynamic = "force-dynamic";

// Never indexed — this is a capability URL for reviewing unpublished drafts,
// not a real page. Still carries the plan's own title/excerpt (and, via the
// colocated opengraph-image.tsx, its cover image + a Preview/Published
// badge) so sharing the link for review shows more than a generic card.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const plan = await getReadingPlanByPreviewToken(token);
  const robots = { index: false, follow: false };
  if (!plan) return { title: "Draft preview — Open Bible School", robots };

  const label = plan.status === "published" ? "Preview" : "Draft preview";
  const title = `${label}: ${plan.title} — Open Bible School`;

  return {
    title,
    description: plan.excerpt || undefined,
    robots,
    openGraph: { title, description: plan.excerpt || undefined, type: "article" },
    twitter: { title, description: plan.excerpt || undefined },
  };
}

export default async function ReadingPlanPreviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const plan = await getReadingPlanByPreviewToken(token);
  if (!plan) notFound();

  return (
    <>
      <main className="flex-1">
        <div className="bg-ink text-cream sticky top-0 z-50 py-2.5 text-center text-[12.5px] font-semibold">
          {plan.status === "published"
            ? "Preview link — this plan is already live at /reading-plans/" + plan.slug
            : "Draft preview — this plan isn't published yet"}
        </div>
        <ReadingPlanDetailView plan={plan} />
      </main>
      <MinimalFooter />
    </>
  );
}
