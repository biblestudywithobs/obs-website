import type { Metadata } from "next";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { ApplicationForm, ApplicationPageHeader } from "@/components/sections/ApplicationForm";

export const metadata: Metadata = {
  title: "Find a Bible Study Partner — Open Bible School",
  description: "Get matched with someone working through the same reading plan.",
};

export default function BibleStudyPartnersPage() {
  return (
    <>
      <main className="flex-1 py-20">
        <div className="wrap max-w-[560px]">
          <ApplicationPageHeader
            eyebrow="Bible Study Partners"
            title="Study together, not alone"
            description="Tell us what you're reading and how you'd like to connect — we'll match you with someone on a similar journey."
          />
          <ApplicationForm
            area="bible_study_partner"
            messageLabel="What reading plan or study are you working through, and how would you like to connect?"
            messagePlaceholder="e.g. Currently on the Psalms of Ascent plan, would love a weekly video call"
            submitLabel="Find a Partner"
          />
        </div>
      </main>
      <MinimalFooter />
    </>
  );
}
