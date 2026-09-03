import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { ReadingPlanDetailView } from "@/components/sections/ReadingPlanDetailView";
import {
  getPublishedReadingPlanBySlug,
  listPublishedReadingPlanSlugs,
} from "@/lib/queries/public-reading-plans";

// Statically rendered/ISR'd — see app/(marketing)/page.tsx for why.
export const revalidate = 3600;

// Prerenders every published plan at build time, rather than leaving each
// one to be rendered (and cached) on its first visitor's cold hit.
export async function generateStaticParams() {
  const slugs = await listPublishedReadingPlanSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const plan = await getPublishedReadingPlanBySlug(slug);
  if (!plan) return { title: "Open Bible School" };

  const title = `${plan.title} — Open Bible School`;
  const description = plan.excerpt || undefined;

  return {
    title,
    description,
    openGraph: { title, description, url: `/reading-plans/${slug}`, type: "article" },
    twitter: { title, description },
  };
}

export default async function ReadingPlanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = await getPublishedReadingPlanBySlug(slug);
  if (!plan) notFound();

  return (
    <>
      <main className="flex-1">
        <div className="wrap">
          <div className="text-ink-muted flex items-center gap-2 py-[22px] text-[13px]">
            <Link href="/" className="text-ink hover:text-gold-deep font-semibold">
              Home
            </Link>
            /
            <Link href="/reading-plans" className="text-ink hover:text-gold-deep font-semibold">
              Reading Plans
            </Link>
            / {plan.title}
          </div>
        </div>

        <ReadingPlanDetailView plan={plan} />
      </main>
      <MinimalFooter />
    </>
  );
}
