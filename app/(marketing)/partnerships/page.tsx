import type { Metadata } from "next";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { ApplicationForm, ApplicationPageHeader } from "@/components/sections/ApplicationForm";

export const metadata: Metadata = {
  title: "Partner With Us — Open Bible School",
  description:
    "Support OBS financially or partner with your church or organization to put our resources to work.",
};

const PARTNERSHIP_TYPES = [
  "Financial Partnership / Donation",
  "Resource & Ministry Partnership",
  "Other",
];

export default function PartnershipsPage() {
  return (
    <>
      <main className="flex-1 py-20">
        <div className="wrap max-w-[560px]">
          <ApplicationPageHeader
            eyebrow="Partner With OBS"
            title="Help us reach more people with the Word"
            description="Whether it's a financial gift or partnering your church or organization with our resources, we'd love to talk with you about how we can work together."
          />
          <ApplicationForm
            area="partnership"
            detailField={{
              kind: "select",
              label: "How would you like to partner with us?",
              options: PARTNERSHIP_TYPES,
            }}
            messageLabel="Tell us more about what you have in mind"
            messagePlaceholder="e.g. We'd like to sponsor a reading plan, or use OBS materials in our church"
            submitLabel="Get in Touch"
          />
        </div>
      </main>
      <MinimalFooter />
    </>
  );
}
