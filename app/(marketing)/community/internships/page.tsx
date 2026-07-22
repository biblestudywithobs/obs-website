import type { Metadata } from "next";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { ApplicationForm, ApplicationPageHeader } from "@/components/sections/ApplicationForm";

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
          <ApplicationForm
            area="internship"
            detailField={{
              kind: "select",
              label: "Which role interests you?",
              options: INTERNSHIP_ROLES,
            }}
            askGender
            hoursOptions={HOURS_PER_WEEK}
          />
        </div>
      </main>
      <MinimalFooter />
    </>
  );
}
