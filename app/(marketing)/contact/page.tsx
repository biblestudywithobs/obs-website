import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { ContactForm } from "@/components/sections/ContactForm";
import { MinimalFooter } from "@/components/layout/MinimalFooter";

export const metadata: Metadata = {
  title: "Contact — Open Bible School",
  description:
    "Questions about a course, a reading plan, or joining the team — reach out, we read everything.",
};

const faqs = [
  {
    q: "Is OBS content free to access?",
    a: "Yes — every article, devotional, and reading plan on the site is free. Some downloadable manuals are offered as a free download as well.",
  },
  {
    q: "Do I need any background to start?",
    a: 'No. Our Beginner reading plans and "A Beginner\'s Journey Through Scripture" plan are built for people who have never studied the Bible closely before.',
  },
  {
    q: "Can my church use OBS materials for a small group?",
    a: "Absolutely — our teaching manuals are built for exactly that. Reach out through the form above and we'll point you to the right starting resources.",
  },
  {
    q: "How do I apply to volunteer or intern with OBS?",
    a: "Visit the Community page and use the Apply Now button under Internships or Join the OBS Team — we review every application personally.",
  },
];

export default function ContactPage() {
  return (
    <>
      <main className="flex-1">
        <section className="pt-[76px] pb-[50px] text-center">
          <div className="wrap">
            <Eyebrow sparkle={false}>Get in touch</Eyebrow>
            <h1 className="font-display mt-4 text-[clamp(34px,4.6vw,48px)] font-semibold">
              We&apos;d love to hear from you
            </h1>
            <p className="font-reading text-ink-muted mx-auto mt-3 max-w-[52ch] text-[16px] leading-[1.6]">
              Questions about a course, a reading plan, or joining the team — reach out, we read
              everything.
            </p>
          </div>
        </section>

        <section>
          <div className="wrap">
            <div className="grid grid-cols-[1.2fr_1fr] items-start gap-[50px] pb-[90px] max-[980px]:grid-cols-1">
              <ContactForm />

              <div className="bg-cream rounded-[18px] px-8 py-[30px] max-[620px]:p-6">
                <h3 className="font-display mb-4 text-[17px] font-semibold">Reach us directly</h3>
                <div className="mb-3 flex items-center gap-3 text-[14px]">
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="none">
                    <path d="M3 5l7 5 7-5" stroke="#2B2420" strokeWidth="1.4" />
                    <rect
                      x="3"
                      y="4"
                      width="14"
                      height="12"
                      rx="1.5"
                      stroke="#2B2420"
                      strokeWidth="1.4"
                    />
                  </svg>
                  <a href="mailto:hello@biblestudywithobs.com" className="hover:text-gold-deep">
                    hello@biblestudywithobs.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-[14px]">
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 18s6-5.5 6-10a6 6 0 10-12 0c0 4.5 6 10 6 10z"
                      stroke="#2B2420"
                      strokeWidth="1.4"
                    />
                    <circle cx="10" cy="8" r="2" stroke="#2B2420" strokeWidth="1.4" />
                  </svg>
                  Ibadan, Nigeria
                </div>
                <div className="mt-[18px] flex gap-2.5">
                  <a
                    href="https://www.instagram.com/openbibleschool/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="bg-paper hover:bg-gold flex h-[38px] w-[38px] items-center justify-center rounded-full"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                      <rect
                        x="3"
                        y="3"
                        width="14"
                        height="14"
                        rx="4"
                        stroke="#2B2420"
                        strokeWidth="1.4"
                      />
                      <circle cx="10" cy="10" r="3.2" stroke="#2B2420" strokeWidth="1.4" />
                      <circle cx="14.3" cy="5.7" r="0.9" fill="#2B2420" />
                    </svg>
                  </a>
                  <a
                    href="https://www.youtube.com/@studywithOBS"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="bg-paper hover:bg-gold flex h-[38px] w-[38px] items-center justify-center rounded-full"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                      <rect
                        x="2"
                        y="5"
                        width="16"
                        height="10"
                        rx="3"
                        stroke="#2B2420"
                        strokeWidth="1.4"
                      />
                      <path d="M8.5 8l4 2-4 2z" fill="#2B2420" />
                    </svg>
                  </a>
                  <a
                    href="https://open.spotify.com/show/0G6DSKiA0fA6UYcxpEOcCl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Spotify"
                    className="bg-paper hover:bg-gold flex h-[38px] w-[38px] items-center justify-center rounded-full"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="7" stroke="#2B2420" strokeWidth="1.4" />
                      <path
                        d="M6 8.5c3-1 6-.5 8 .7M6.5 11c2.4-.7 4.8-.4 6.5.6M7 13.3c1.8-.5 3.6-.3 5 .4"
                        stroke="#2B2420"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-[100px]">
          <div className="wrap">
            <div className="mb-[30px]">
              <Eyebrow sparkle={false}>Common questions</Eyebrow>
              <h2 className="font-display mt-2.5 text-[clamp(26px,3vw,32px)] font-semibold">
                Frequently Asked Questions
              </h2>
            </div>
            <FaqAccordion items={faqs} />
          </div>
        </section>
      </main>
      <MinimalFooter />
    </>
  );
}
