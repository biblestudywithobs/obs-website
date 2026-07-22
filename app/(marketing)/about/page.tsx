import type { Metadata } from "next";
import { Fragment } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHead } from "@/components/ui/SectionHead";
import { MinimalFooter } from "@/components/layout/MinimalFooter";

export const metadata: Metadata = {
  title: "About — Open Bible School",
  description:
    "OBS exists to help people understand the Scriptures in a simple, clear, and faithful way.",
};

const timeline = [
  {
    year: "Year One",
    title: "A study group becomes a school",
    body: "What started as a small group meeting to study the Bible together grew into a structured teaching ministry, built on the conviction that clear Scripture changes lives.",
  },
  {
    year: "Year Two",
    title: "First hermeneutics cohort",
    body: "OBS ran its first formal course — a hermeneutics foundation — recorded and shared so anyone, anywhere, could learn to read the Bible in context.",
  },
  {
    year: "Year Three",
    title: "Digital expansion",
    body: "Articles, devotionals, and the OBS Studio Podcast launched, carrying the same teaching further than a classroom ever could.",
  },
  {
    year: "Today",
    title: "Reading plans and a growing partnership",
    body: "OBS reading plans are now shared with thousands of readers, with a YouVersion Content Partner relationship underway to reach further still.",
  },
];

const values = [
  {
    title: "Faithfulness",
    body: "Teaching that stays true to the text, not to trends.",
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
    title: "Clarity",
    body: "If it can't be explained simply, we haven't finished the work.",
    icon: (
      <>
        <circle cx="10" cy="10" r="7" stroke="#2B2420" strokeWidth="1.5" />
        <path d="M10 6v4l3 2" stroke="#2B2420" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Excellence",
    body: "Scholarship and craft, offered as worship.",
    icon: (
      <path
        d="M4 3l1.9 4.2 4.6.4-3.5 3 1.1 4.5-4.1-2.5-4.1 2.5 1.1-4.5-3.5-3 4.6-.4z"
        transform="translate(6,0)"
        stroke="#2B2420"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Community",
    body: "Scripture studied together, not just alone.",
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
];

const statement = [
  {
    heading: "Scripture",
    body: "We believe the Bible is God's inspired, authoritative word — sufficient for faith and practice, and meant to be read in context, not isolation.",
  },
  {
    heading: "God",
    body: "We believe in one God, eternally existing in three persons — Father, Son, and Holy Spirit — perfect in holiness, wisdom, and love.",
  },
  {
    heading: "Christ",
    body: "We believe Jesus Christ is fully God and fully man, who died for our sins, rose bodily from the grave, and is the only way to the Father.",
  },
  {
    heading: "Salvation",
    body: "We believe salvation is by grace through faith in Christ alone — not by works, but resulting in a transformed life marked by obedience.",
  },
  {
    heading: "The Church",
    body: "We believe every believer is called to serve within a local church, and that teaching exists to strengthen the church, not replace it.",
  },
];

export default function AboutPage() {
  return (
    <>
      <main className="flex-1">
        {/* HERO */}
        <section className="pt-[84px] pb-[70px] text-center">
          <div className="wrap">
            <Eyebrow>About Open Bible School</Eyebrow>
            <h1 className="font-display mt-4 text-[clamp(36px,5vw,56px)] font-semibold tracking-[-0.01em]">
              Scripture made clear enough to live by.
            </h1>
            <p className="font-reading text-ink-muted mx-auto mt-4 max-w-[56ch] text-[18px] leading-[1.65]">
              OBS exists to help people understand the Scriptures in a simple, clear, and faithful
              way — leading them to know Christ more deeply and serve Him faithfully within their
              local church communities.
            </p>
          </div>
        </section>

        {/* STORY / TIMELINE */}
        <section id="our-story" className="section-pad-page">
          <div className="wrap">
            <SectionHead eyebrow="Our story" title="How OBS came to be" />
            <div className="before:bg-line relative pl-9 before:absolute before:top-1.5 before:bottom-1.5 before:left-2 before:w-[1.5px] before:content-['']">
              {timeline.map((item, i) => (
                <div
                  key={item.year}
                  className={
                    "before:border-paper before:bg-gold relative before:absolute before:top-1 before:-left-9 before:h-[17px] before:w-[17px] before:rounded-full before:border-[3px] before:shadow-[0_0_0_1.5px_var(--color-gold-deep)] before:content-[''] " +
                    (i === timeline.length - 1 ? "pb-0" : "pb-10")
                  }
                >
                  <div className="font-display text-gold-deep text-[13px] font-semibold tracking-[0.04em]">
                    {item.year}
                  </div>
                  <h4 className="font-display mt-1.5 text-[19px] font-semibold">{item.title}</h4>
                  <p className="font-reading text-ink-muted mt-1.5 max-w-[56ch] text-[14.5px] leading-[1.6]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MISSION / VISION + VALUES */}
        <section className="pb-[88px] max-[620px]:pb-14">
          <div className="wrap">
            <div className="mb-14 grid grid-cols-2 gap-[30px] max-[980px]:grid-cols-1">
              <div className="bg-cream rounded-[18px] px-[34px] py-8">
                <h3 className="font-display mb-3 text-[20px] font-semibold">Mission</h3>
                <p className="font-reading text-ink-muted text-[15px] leading-[1.65]">
                  To help people understand the Scriptures in a simple, clear, and faithful way —
                  through teaching, reading plans, and community — so they know Christ more deeply.
                </p>
              </div>
              <div className="bg-cream rounded-[18px] px-[34px] py-8">
                <h3 className="font-display mb-3 text-[20px] font-semibold">Vision</h3>
                <p className="font-reading text-ink-muted text-[15px] leading-[1.65]">
                  A generation of believers who read Scripture with confidence, teach it with
                  clarity, and serve their local churches with the depth of what they&apos;ve
                  learned.
                </p>
              </div>
            </div>

            <SectionHead eyebrow="What we hold to" title="Our values" />
            <div className="grid grid-cols-4 gap-[18px] max-[980px]:grid-cols-2 max-[620px]:grid-cols-1">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="border-line rounded-[16px] border px-[22px] py-[26px]"
                >
                  <span className="bg-gold mb-4 flex h-[38px] w-[38px] items-center justify-center rounded-[10px]">
                    <svg className="h-[18px] w-[18px]" viewBox="0 0 20 20" fill="none">
                      {v.icon}
                    </svg>
                  </span>
                  <h4 className="font-display mb-2 text-[16.5px] font-semibold">{v.title}</h4>
                  <p className="text-ink-muted text-[13px] leading-[1.55]">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATEMENT OF FAITH */}
        <section id="statement-of-faith" className="section-pad-page bg-ink text-cream">
          <div className="wrap max-w-[800px]">
            <SectionHead onDark eyebrow="What we believe" title="Statement of Faith" />
            <div className="font-reading text-cream/85 text-[16.5px] leading-[1.85]">
              {statement.map((s) => (
                <Fragment key={s.heading}>
                  <h4 className="font-display text-gold mt-[30px] mb-2.5 text-[18px] font-semibold first:mt-0">
                    {s.heading}
                  </h4>
                  <p className="mb-2">{s.body}</p>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
      </main>
      <MinimalFooter />
    </>
  );
}
