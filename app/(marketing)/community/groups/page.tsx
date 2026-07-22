import type { Metadata } from "next";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { ApplicationForm, ApplicationPageHeader } from "@/components/sections/ApplicationForm";

export const metadata: Metadata = {
  title: "Community Groups — Open Bible School",
  description: "Local, in-person groups that meet weekly to study Scripture together.",
};

export default function CommunityGroupsPage() {
  return (
    <>
      <main className="flex-1 py-20">
        <div className="wrap max-w-[560px]">
          <ApplicationPageHeader
            eyebrow="Community Groups"
            title="Find people near you"
            description="Local, in-person groups that meet weekly to study Scripture and walk through OBS course material together."
          />
          <ApplicationForm
            area="community_group"
            detailField={{ kind: "text", label: "City / region", placeholder: "e.g. Ibadan" }}
            messageLabel="Availability or anything else we should know? (optional)"
            messagePlaceholder="e.g. Weekday evenings work best for me"
            submitLabel="Find a Group"
          />
        </div>
      </main>
      <MinimalFooter />
    </>
  );
}
