import { Eyebrow } from "@/components/ui/Eyebrow";
import Link from "next/link";

// Figures from YouVersion Partner analytics for the beginner's guide plan.
// Update by hand when the numbers move.
const PLAN_STATS = [
  { value: "3,683", label: "Subscriptions" },
  { value: "1,059", label: "Completions" },
  { value: "94", label: "Countries" },
];

// Homepage CTA: celebrates the reach of our most-read reading plan and
// points people to the volunteer page for the roles that growth needs.
export function VolunteerCallout() {
  return (
    <section>
      <div className="wrap">
        <div className="bg-ink text-cream grid grid-cols-[1.1fr_1fr] items-center gap-10 rounded-[20px] px-12 py-12 shadow-[6px_6px_0_var(--color-gold-deep)] max-[980px]:grid-cols-1 max-[620px]:px-6 max-[620px]:py-9">
          <div>
            <Eyebrow sparkle={false} onDark>
              We&apos;re growing
            </Eyebrow>
            <h2 className="text-h2 mt-4">
              <em className="text-gold font-medium italic">
                How to Study Your Bible: A Beginner&apos;s Guide
              </em>{" "}
              is reaching readers in 94 countries.
            </h2>
            <p className="font-reading text-cream/75 mt-4 max-w-[52ch] text-[17px] leading-[1.65]">
              God is taking our YouVersion plan further than we imagined. To keep up, we&apos;re
              looking for <strong className="text-cream">French translators</strong> to bring our
              reading plans and Bible commentaries to French speakers, and{" "}
              <strong className="text-cream">software engineers</strong> to help build our website.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/community/volunteer"
                className="bg-gold border-gold text-ink inline-flex items-center justify-center rounded-full border px-[22px] py-[11px] text-[14.5px] leading-[1.2] font-medium tracking-[0.06em] uppercase shadow-[3px_3px_0_var(--color-cream)] transition-[transform,box-shadow] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-cream)]"
              >
                Volunteer With Us
              </Link>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-4 max-[620px]:gap-3">
            {PLAN_STATS.map((stat) => (
              <div
                key={stat.label}
                className="border-cream/[0.18] rounded-[14px] border px-4 py-6 text-center max-[620px]:px-2 max-[620px]:py-4"
              >
                <dd className="font-display text-gold text-[clamp(26px,3.4vw,40px)] leading-none font-semibold">
                  {stat.value}
                </dd>
                <dt className="text-cream/60 mt-2 text-[12px] tracking-[0.06em] uppercase">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
