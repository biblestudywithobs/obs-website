import type { Metadata } from "next";
import { ReadingPlanLibrary } from "@/components/sections/ReadingPlanLibrary";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import {
  getFeaturedReadingPlan,
  listPublishedReadingPlans,
} from "@/lib/queries/public-reading-plans";

// Statically rendered/ISR'd — see app/(marketing)/page.tsx for why.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Reading Plans — Open Bible School",
  description:
    "Structured, day-by-day Bible reading plans built from OBS teaching — read on your own or alongside a class.",
};

export default async function ReadingPlansPage() {
  const featured = await getFeaturedReadingPlan();
  const { plans, categories } = await listPublishedReadingPlans(featured?.slug);

  return (
    <>
      <main className="flex-1">
        <ReadingPlanLibrary plans={plans} categories={categories} featured={featured} />
      </main>
      <MinimalFooter />
    </>
  );
}
