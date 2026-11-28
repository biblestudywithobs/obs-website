/* eslint-disable @typescript-eslint/no-unused-vars --
   The role data below is kept for when applications reopen in 2027. */
import type { Metadata } from "next";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { ApplicationPageHeader } from "@/components/sections/ApplicationForm";

export const metadata: Metadata = {
  title: "Internships — Open Bible School",
  description:
    "Work alongside OBS faculty on teaching content, digital presence, or ministry operations for a season.",
};

const INTERNSHIP_ROLES = [
  "Bible Study Intern",
  "Technical Staff Intern",
  "Content & Editorial Intern",
  "Media & Podcast Intern",
  "Ministry Operations Intern",
  "Scholar Team Intern",
];

const HOURS_PER_WEEK = ["2 hours/week", "4 hours/week", "6 hours/week"];

export default function InternshipsPage() {
  return (
    <>
      <main className="flex-1 py-20">
        <div className="wrap max-w-[560px]">
          <ApplicationPageHeader
            eyebrow="Internships"
            title="Serve for a season"
            description="Work alongside OBS faculty on teaching content, digital presence, or ministry operations."
          />
          <div
            role="status"
            className="border-gold-deep bg-cream mb-8 rounded-[14px] border border-l-[4px] px-5 py-4 text-[15px] leading-[1.6]"
          >
            <p className="font-semibold">We&apos;re not accepting new applications this season.</p>
            <p className="text-ink-muted mt-1">
              Our new season starts in 2027. If you&apos;d like us to keep you in mind until then,{" "}
              <a
                href="mailto:hello@biblestudywithobs.com?subject=Keep%20me%20in%20mind%20for%20the%202027%20internship%20season"
                className="text-ink underline underline-offset-4"
              >
                send us an email
              </a>{" "}
              and we&apos;ll hold your details for when applications reopen.
            </p>
          </div>
        </div>
      </main>
      <MinimalFooter />
    </>
  );
}
