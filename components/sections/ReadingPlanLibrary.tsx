"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ShareButton } from "@/components/ui/ShareButton";
import type { ReadingPlan } from "@/types/content";
import type { FeaturedPlan } from "@/lib/queries/public-reading-plans";

// Reading-plans page: featured plan + category/search filtering, ported from
// the vanilla applyFilters() in OBS-Reading-Plans.html. `plans`/`categories`/
// `featured` are real published data fetched server-side by the page.
export function ReadingPlanLibrary({
  plans,
  categories,
  featured,
}: {
  plans: ReadingPlan[];
  categories: string[];
  featured: FeaturedPlan | null;
}) {
  const [activeCat, setActiveCat] = useState<string>("all");
  const [term, setTerm] = useState("");
  const planCategories = ["all", ...categories];

  const filtered = useMemo(() => {
    const q = term.trim().toLowerCase();
    return plans.filter((p) => {
      const matchesCat = activeCat === "all" || p.category === activeCat;
      const haystack = `${p.duration} ${p.title} ${p.excerpt} ${p.category}`.toLowerCase();
      return matchesCat && (!q || haystack.includes(q));
    });
  }, [activeCat, term, plans]);

  return (
    <>
      <section className="pt-16 pb-10">
        <div className="wrap">
          <Eyebrow sparkle={false}>YouVersion &amp; OBS</Eyebrow>
          <h1 className="font-display mt-[14px] text-[clamp(32px,4vw,46px)] font-semibold tracking-[-0.01em]">
            Bible Reading Plans
          </h1>
          <p className="font-reading text-ink-muted mt-3 max-w-[58ch] text-[16px] leading-[1.6]">
            Structured, day-by-day plans built from OBS teaching — read on your own or alongside a
            class.
          </p>

          {/* Featured plan — only renders when one is marked featured in the CMS */}
          {featured && (
            <div className="bg-ink text-cream mt-[34px] flex flex-wrap items-center justify-between gap-9 rounded-[22px] px-11 py-10 max-[980px]:flex-col-reverse max-[980px]:items-start max-[620px]:p-[30px]">
              <div>
                <Eyebrow sparkle={false} onDark>
                  Featured plan
                </Eyebrow>
                <h2 className="font-display mt-3 max-w-[20ch] text-[clamp(24px,2.8vw,32px)] font-semibold">
                  {featured.title}
                </h2>
                <p className="font-reading text-cream/70 mt-2.5 max-w-[44ch] text-[14px] leading-[1.6]">
                  {featured.excerpt}
                </p>
                <div className="mt-[22px] flex gap-3">
                  <Button href="#">Start Plan</Button>
                  <ShareButton label="Share plan" />
                </div>
              </div>
              <div className="bg-gold relative h-[190px] w-[150px] shrink-0 overflow-hidden rounded-[14px]">
                <div className="bg-gold-deep absolute top-0 right-[22px] h-[60px] w-4 [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)]" />
              </div>
            </div>
          )}

          <div className="bg-cream mt-[26px] flex max-w-[460px] items-center gap-2 rounded-full px-[18px] py-[11px]">
            <svg className="h-4 w-4 shrink-0 opacity-60" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M17 17l-3.5-3.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search reading plans..."
              aria-label="Search reading plans"
              className="font-ui w-full bg-transparent text-[14.5px] focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="border-line mb-7 flex flex-wrap gap-2.5 border-b pt-[26px] pb-2">
            {planCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCat(cat)}
                className={cn(
                  "mb-4 rounded-full border px-[18px] py-[9px] text-[13.5px] font-semibold transition-all duration-[180ms]",
                  activeCat === cat
                    ? "border-ink bg-ink text-cream"
                    : "border-line bg-paper text-ink-muted hover:border-gold-deep",
                )}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-[22px] pb-[90px] max-[980px]:grid-cols-2 max-[620px]:grid-cols-1">
            {filtered.map((p) => (
              <div
                key={p.title}
                className="border-line bg-paper hover:shadow-card-hover overflow-hidden rounded-[16px] border transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px]"
              >
                <div className="bg-cream relative flex aspect-[16/10] items-center justify-center">
                  <span className="bg-paper absolute top-[14px] right-[14px] rounded-full px-2.5 py-[5px] text-[11px] font-bold">
                    {p.duration}
                  </span>
                </div>
                <div className="px-[22px] pt-5 pb-[22px]">
                  <h3 className="font-display mb-2 text-[17.5px] leading-[1.3] font-semibold">
                    {p.title}
                  </h3>
                  <p className="font-reading text-ink-muted mb-[18px] text-[13.5px] leading-[1.55]">
                    {p.excerpt}
                  </p>
                  <div className="flex items-center gap-2.5">
                    <Button href="#" size="sm" className="flex-1">
                      Start Plan
                    </Button>
                    <ShareButton />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
