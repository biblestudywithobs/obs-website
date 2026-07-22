import type { Metadata } from "next";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { ApplicationForm, ApplicationPageHeader } from "@/components/sections/ApplicationForm";

export const metadata: Metadata = {
  title: "Join the OBS Team — Open Bible School",
  description: "For those drawn to teaching, writing, or ministry operations.",
};

export default function JoinTeamPage() {
  return (
    <>
      <main className="flex-1 py-20">
        <div className="wrap max-w-[560px]">
          <ApplicationPageHeader
            eyebrow="Called to teach?"
            title="Join the OBS Team"
            description="If you're drawn to teaching, writing, or ministry operations, we're always looking for people who love Scripture enough to make it clear for others."
          />
          <ApplicationForm
            area="team"
            messageLabel="Tell us what draws you to this and any relevant experience"
            messagePlaceholder="A little about yourself and what you'd love to contribute"
          />
        </div>
      </main>
      <MinimalFooter />
    </>
  );
}
