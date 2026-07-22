import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { ApplyNowChooser } from "@/components/sections/ApplyNowChooser";

export const metadata: Metadata = {
  title: "Community — Open Bible School",
  description:
    "Scripture was never meant to be studied alone. Here's how to plug in — whatever season you're in.",
};

const cards = [
  {
    title: "Volunteer Opportunities",
    body: "Help run events, edit teaching materials, or support the OBS Studio Podcast — no formal training required, just willingness.",
    action: "Learn More",
    href: "/community/volunteer",
    icon: (
      <path
        d="M10 2l7 3v5c0 5-3.5 7.5-7 8-3.5-.5-7-3-7-8V5z"
        stroke="#2B2420"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Bible Study Partners",
    body: "Get matched with someone working through the same reading plan — study together, ask questions, stay accountable.",
    action: "Find a Partner",
    href: "/community/bible-study-partners",
    icon: (
      <>
        <circle cx="7" cy="7" r="3" stroke="#2B2420" strokeWidth="1.5" />
        <circle cx="14" cy="9" r="2.4" stroke="#2B2420" strokeWidth="1.5" />
        <path
          d="M2 17c0-3 2.3-5 5-5s5 2 5 5"
          stroke="#2B2420"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    title: "Internships",
    body: "Work alongside OBS faculty on teaching content, digital presence, or ministry operations for a season.",
    action: "Apply Now",
    href: "/community/internships",
    icon: (
      <>
        <path d="M4 3h9l3 3v11H4z" stroke="#2B2420" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M7 8h6M7 11h6M7 14h4" stroke="#2B2420" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Community Groups",
    body: "Local, in-person groups that meet weekly to study Scripture together and walk through OBS course material.",
    action: "Find a Group",
    href: "/community/groups",
    icon: (
      <>
        <rect x="3" y="4" width="14" height="13" rx="1.5" stroke="#2B2420" strokeWidth="1.5" />
        <path d="M3 8h14" stroke="#2B2420" strokeWidth="1.5" />
      </>
    ),
  },
];

export default function CommunityPage() {
  return (
    <>
      <main className="flex-1">
        <section className="pt-[84px] pb-[60px] text-center">
          <div className="wrap">
            <Eyebrow sparkle={false}>You belong here</Eyebrow>
            <h1 className="font-display mt-4 text-[clamp(34px,4.6vw,50px)] font-semibold tracking-[-0.01em]">
              Become part of OBS
            </h1>
            <p className="font-reading text-ink-muted mx-auto mt-3.5 max-w-[54ch] text-[17px] leading-[1.65]">
              Scripture was never meant to be studied alone. Here&apos;s how to plug in — whatever
              season you&apos;re in.
            </p>
          </div>
        </section>

        <section className="pb-[90px]">
          <div className="wrap">
            <div className="grid grid-cols-2 gap-[22px] max-[980px]:grid-cols-1">
              {cards.map((c) => (
                <div
                  key={c.title}
                  className="border-line flex flex-col rounded-[18px] border px-8 py-[30px]"
                >
                  <span className="bg-gold mb-[18px] flex h-[42px] w-[42px] items-center justify-center rounded-[11px]">
                    <svg className="h-[19px] w-[19px]" viewBox="0 0 20 20" fill="none">
                      {c.icon}
                    </svg>
                  </span>
                  <h3 className="font-display mb-2.5 text-[20px] font-semibold">{c.title}</h3>
                  <p className="font-reading text-ink-muted mb-[22px] flex-1 text-[14.5px] leading-[1.6]">
                    {c.body}
                  </p>
                  <Button href={c.href} variant="secondary" className="self-start">
                    {c.action}
                  </Button>
                </div>
              ))}
            </div>

            <div className="bg-ink text-cream mt-[22px] rounded-[22px] px-[52px] py-12 text-center max-[620px]:px-[26px] max-[620px]:py-[34px]">
              <Eyebrow sparkle={false} onDark>
                Called to teach?
              </Eyebrow>
              <h2 className="font-display text-cream mt-[14px] mb-3 text-[clamp(26px,3vw,34px)] font-semibold">
                Join the OBS Team
              </h2>
              <p className="font-reading text-cream/[0.72] mx-auto mb-6 max-w-[54ch] text-[15px] leading-[1.6]">
                If you&apos;re drawn to teaching, writing, or ministry operations, we&apos;re always
                looking for people who love Scripture enough to make it clear for others.
              </p>
              <ApplyNowChooser />
            </div>
          </div>
        </section>
      </main>
      <MinimalFooter />
    </>
  );
}
