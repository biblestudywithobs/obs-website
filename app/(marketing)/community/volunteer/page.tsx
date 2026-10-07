import type { Metadata } from "next";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { ApplicationForm, ApplicationPageHeader } from "@/components/sections/ApplicationForm";

export const metadata: Metadata = {
  title: "Volunteer With OBS — Open Bible School",
  description: "Help run events, edit teaching materials, or support the OBS Studio Podcast.",
};

const VOLUNTEER_TEAMS = [
  "Software Engineers",
  "Prayer and Support Team",
  "French Translation Team",
  "Staff Writers",
  "Bible Study Interns",
  "Voice Over Artists",
  "Social Media Managers",
  "Graphics Designers",
  "Illustrators",
  "Audio Editors",
  "Technical Staff",
  "Admin Staff",
];

// Listed so people know they exist, but not accepting applications yet.
const CLOSED_TEAMS = ["Staff Writers", "Bible Study Interns", "Voice Over Artists"];

const SOFTWARE_ENGINEER_ROLES = [
  {
    title: "Frontend Engineer",
    summary: "Build the pages and reading experiences people use every day on the OBS website.",
  },
  {
    title: "Backend Engineer",
    summary: "Own our data, auth, APIs and email flows, and keep them fast and reliable.",
  },
  {
    title: "Full-Stack Engineer",
    summary: "Ship features end to end, from the database to the admin dashboard.",
  },
  {
    title: "QA / Test Engineer",
    summary: "Help us catch bugs before our readers do, with automated and manual testing.",
  },
];

const OUR_STACK = [
  "Next.js (App Router)",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Supabase (Postgres, Auth, Storage)",
  "Zod",
  "Tiptap",
  "Resend + React Email",
  "PostHog",
  "Vitest",
  "Docker",
  "Netlify",
  "Git & GitHub",
];

function SoftwareEngineersDetails() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[14px] font-semibold">About the role</h3>
        <p className="text-ink-muted mt-1">
          Join the team that builds and maintains the OBS website, admin tools and the resources
          thousands of people use to study the Bible. You&apos;ll work remotely with a small,
          friendly team, pick up real tasks and see your work go live.
        </p>
      </div>

      <div>
        <h3 className="text-[14px] font-semibold">Open roles</h3>
        <ul className="mt-1 space-y-1.5">
          {SOFTWARE_ENGINEER_ROLES.map((role) => (
            <li key={role.title}>
              <span className="font-semibold">{role.title}</span>
              <span className="text-ink-muted"> — {role.summary}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-[14px] font-semibold">Our stack</h3>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {OUR_STACK.map((tech) => (
            <li
              key={tech}
              className="border-line bg-cream rounded-full border px-2.5 py-0.5 text-[12.5px]"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-[14px] font-semibold">What we&apos;re looking for</h3>
        <ul className="text-ink-muted mt-1 list-disc space-y-1 pl-5">
          <li>Some experience with any part of our stack, or a strong desire to learn it</li>
          <li>Comfort working with Git and reviewing each other&apos;s code</li>
          <li>Clear communication and reliability with the hours you commit</li>
          <li>A heart for the work OBS is doing</li>
        </ul>
      </div>

      <p className="border-gold-deep border-l-[3px] pl-3 font-semibold">
        We don&apos;t need perfect people, only willing people. If you&apos;re eager to learn and
        serve, we&apos;d love to hear from you.
      </p>
    </div>
  );
}

type RoleDescription = {
  about: string;
  responsibilities: string[];
  lookingFor: string[];
};

// Shown under the team select when that team is chosen. Software Engineers
// has its own richer layout (open roles + stack) above.
const ROLE_DESCRIPTIONS: Record<string, RoleDescription> = {
  "Prayer and Support Team": {
    about:
      "The Prayer and Support Team holds up the work of OBS and the people we serve in prayer, and makes sure no one who reaches out to us feels alone.",
    responsibilities: [
      "Pray regularly for OBS, our team, our events and our community",
      "Pray over prayer requests sent in by members and readers",
      "Follow up with and encourage people who reach out for prayer or support",
      "Join scheduled team prayer sessions, online or in person",
      "Welcome and check in on new members of our community",
    ],
    lookingFor: [
      "A consistent personal prayer life",
      "Compassion, patience and a listening ear",
      "Discretion: prayer requests are kept confidential",
    ],
  },
  "French Translation Team": {
    about:
      "OBS is translating our YouVersion reading plans, Bible commentaries and other teaching materials into French, so French-speaking believers can study the Word with us. As part of the French Translation Team, you'll help carry that work across faithfully and clearly.",
    responsibilities: [
      "Translate YouVersion reading plans, Bible commentaries and articles into French",
      "Proofread and review translations done by other team members",
      "Keep the meaning, tone and Scripture references accurate to the original",
      "Help build a shared glossary of key Bible and OBS terms in French",
    ],
    lookingFor: [
      "Native French speakers",
      "People who studied French (at school, university or a language course)",
      "Anyone who speaks and writes French confidently",
      "Good English reading comprehension, since most source material is in English",
    ],
  },
  "Social Media Managers": {
    about:
      "Social Media Managers share what God is doing through OBS with the wider world, helping people find our reading plans, teachings and events.",
    responsibilities: [
      "Plan and schedule posts across our social media platforms",
      "Turn articles, sessions and podcast episodes into engaging posts",
      "Respond to comments and messages in a warm, timely way",
      "Track what's working and suggest ideas to grow our reach",
    ],
    lookingFor: [
      "Familiarity with Instagram, X, Facebook, TikTok or LinkedIn",
      "Good writing skills and an eye for what connects with people",
      "Consistency: posting on schedule matters",
    ],
  },
  "Graphics Designers": {
    about:
      "Graphics Designers shape how OBS looks, creating visuals that make the Word clear, beautiful and easy to share.",
    responsibilities: [
      "Design social media graphics, event flyers and reading plan artwork",
      "Create covers and visuals for podcasts, articles and sessions",
      "Keep our designs consistent with the OBS brand",
      "Work with the social media and content teams on upcoming campaigns",
    ],
    lookingFor: [
      "Experience with Figma, Canva, Photoshop or similar tools",
      "A portfolio or a few samples of your work (helpful, not required)",
      "Ability to take feedback and meet deadlines",
    ],
  },
  Illustrators: {
    about:
      "Illustrators help us picture the stories and truths of Scripture, creating original artwork for our teaching materials and reading plans.",
    responsibilities: [
      "Create original illustrations for reading plans, articles and commentaries",
      "Illustrate Bible stories, themes and concepts in a clear, faithful way",
      "Produce artwork for events, merchandise and special projects",
      "Work with designers to fit illustrations into finished pieces",
    ],
    lookingFor: [
      "Hand-drawn or digital illustration skills (Procreate, Illustrator, etc.)",
      "Samples of your work (helpful, not required)",
      "Care for depicting Scripture accurately and respectfully",
    ],
  },
  "Audio Editors": {
    about:
      "Audio Editors make our podcasts, teachings and recordings sound clean and clear, so nothing gets in the way of the message.",
    responsibilities: [
      "Edit podcast episodes and recorded teaching sessions",
      "Clean up background noise, balance levels and cut mistakes",
      "Add intros, outros and music where needed",
      "Export and deliver final audio on schedule",
    ],
    lookingFor: [
      "Experience with Audacity, Adobe Audition, GarageBand, Descript or similar",
      "A good ear and attention to detail",
      "Reliability with turnaround times",
    ],
  },
  "Technical Staff": {
    about:
      "Technical Staff keep our events, classes and online sessions running smoothly behind the scenes.",
    responsibilities: [
      "Set up and run sound, projection and streaming at events",
      "Host and manage online class sessions and meetings",
      "Record sessions so they can be shared later",
      "Troubleshoot technical issues as they come up",
    ],
    lookingFor: [
      "Comfort with audio/visual equipment or livestreaming tools",
      "Calm problem-solving under pressure",
      "Availability for scheduled events and sessions",
    ],
  },
  "Admin Staff": {
    about:
      "Admin Staff keep OBS organised, handling the coordination and communication that let every other team do its work well.",
    responsibilities: [
      "Respond to emails and enquiries from our community",
      "Manage schedules, records and shared documents",
      "Help coordinate events, applications and team meetings",
      "Support team leads with day-to-day tasks",
    ],
    lookingFor: [
      "Strong organisation and attention to detail",
      "Comfort with Google Workspace or similar tools",
      "Clear, friendly written communication",
    ],
  },
};

function RoleDetails({ role }: { role: RoleDescription }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[14px] font-semibold">About the role</h3>
        <p className="text-ink-muted mt-1">{role.about}</p>
      </div>

      <div>
        <h3 className="text-[14px] font-semibold">What you&apos;ll do</h3>
        <ul className="text-ink-muted mt-1 list-disc space-y-1 pl-5">
          {role.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-[14px] font-semibold">Who we&apos;re looking for</h3>
        <ul className="text-ink-muted mt-1 list-disc space-y-1 pl-5">
          {role.lookingFor.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const OPTION_DETAILS: Record<string, React.ReactNode> = {
  "Software Engineers": <SoftwareEngineersDetails />,
  ...Object.fromEntries(
    Object.entries(ROLE_DESCRIPTIONS).map(([team, role]) => [
      team,
      <RoleDetails key={team} role={role} />,
    ]),
  ),
};

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
              closedOptions: CLOSED_TEAMS,
              optionDetails: OPTION_DETAILS,
            }}
            askGender
            askLocation
            askChurch
            askWorkforce
            askBibleStudyRating
            askReadArticles
            hoursOptions={HOURS_PER_WEEK}
          />
        </div>
      </main>
      <MinimalFooter />
    </>
  );
}
