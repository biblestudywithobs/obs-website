"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SessionCard } from "@/components/cards/SessionCard";
import type { Session } from "@/types/content";

// Class-session library: series chips + search + a live result count + empty
// state. Deep-links from session tags (?series=Name) pre-select a series,
// matching the query-param handling in OBS-Class-Sessions-Library.html.
// `sessions`/`seriesList` are real published data fetched server-side.
export function SessionLibrary({
  sessions,
  seriesList,
}: {
  sessions: Session[];
  seriesList: string[];
}) {
  const params = useSearchParams();
  const sessionSeries = ["all", ...seriesList];
  const seriesParam = params.get("series");
  const initialSeries = seriesParam && seriesList.includes(seriesParam) ? seriesParam : "all";

  const [activeSeries, setActiveSeries] = useState<string>(initialSeries);
  const [term, setTerm] = useState("");

  const filtered = useMemo(() => {
    const q = term.trim().toLowerCase();
    return sessions.filter((s) => {
      const matchesSeries = activeSeries === "all" || s.series === activeSeries;
      const matchesSearch =
        !q || s.title.toLowerCase().includes(q) || s.series.toLowerCase().includes(q);
      return matchesSeries && matchesSearch;
    });
  }, [activeSeries, term, sessions]);

  return (
    <>
      <section className="border-line border-b pt-16 pb-10">
        <div className="wrap">
          <Eyebrow>Recorded live</Eyebrow>
          <h1 className="font-display mt-[14px] text-[clamp(32px,4vw,46px)] font-semibold tracking-[-0.01em]">
            Class Sessions
          </h1>
          <p className="font-reading text-ink-muted mt-3 max-w-[56ch] text-[16px] leading-[1.6]">
            Every OBS class, recorded and split into sessions — search by teaching, filter by
            series, and pick up right where a session left off.
          </p>
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
              placeholder="Search sessions..."
              aria-label="Search sessions"
              className="font-ui w-full bg-transparent text-[14.5px] focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="flex flex-wrap gap-2.5 pt-[26px]">
            {sessionSeries.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setActiveSeries(s)}
                className={cn(
                  "rounded-full border px-[18px] py-[9px] text-[13.5px] font-semibold transition-all duration-[180ms]",
                  activeSeries === s
                    ? "border-ink bg-ink text-cream"
                    : "border-line bg-paper text-ink-muted hover:border-gold-deep",
                )}
              >
                {s === "all" ? "All series" : s}
              </button>
            ))}
          </div>

          <div className="text-ink-muted pt-[18px] pb-1.5 text-[13px]">
            {filtered.length} {filtered.length === 1 ? "session" : "sessions"}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-3 gap-[22px] pt-5 pb-[100px] max-[980px]:grid-cols-2 max-[620px]:grid-cols-1">
              {filtered.map((s) => (
                <SessionCard key={s.slug} session={s} tagAsLink={false} />
              ))}
            </div>
          ) : (
            <div className="px-5 py-20 text-center">
              <h3 className="font-display mb-2 text-[20px] font-semibold">
                No sessions match that search
              </h3>
              <p className="text-ink-muted text-[14px]">
                Try a different keyword, or clear the filter to see all series.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
