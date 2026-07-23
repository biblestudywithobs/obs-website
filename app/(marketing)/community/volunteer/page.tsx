import type { Metadata } from "next";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { ApplicationForm, ApplicationPageHeader } from "@/components/sections/ApplicationForm";

export const metadata: Metadata = {
  title: "Volunteer With OBS — Open Bible School",
  description: "Help run events, edit teaching materials, or support the OBS Studio Podcast.",
};

const VOLUNTEER_TEAMS = [
  "Staff Writers",
  "Bible Study Interns",
  "Podcast Productions",
  "Voice Over Artists",
  "Social Media Managers",
  "Graphic Designers",
  "Technical Staff",
  "Admin Staff",
];

const HOURS_PER_WEEK = ["2 hours/week", "4 hours/week", "6 hours/week"];

export default function VolunteerPage() {
  return (
    <>
      <main className="flex-1 py-20">
        <div className="wrap max-w-[560px]">
          <ApplicationPageHeader
            eyebrow="Volunteer Opportunities"
            title="Help run what we do"
            description="No formal training required, just willingness — pick the team that fits your season."
          />
          <ApplicationForm
            area="volunteer"
            detailField={{
              kind: "select",
              label: "Which team interests you?",
              options: VOLUNTEER_TEAMS,
            }}
            askGender
            askLocation
            hoursOptions={HOURS_PER_WEEK}
          />
        </div>
      </main>
      <MinimalFooter />
    </>
  );
}
