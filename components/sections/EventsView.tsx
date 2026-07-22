"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import type { PublicEvent } from "@/lib/queries/public-events";

const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type EventCalendar = {
  label: string;
  leadingEmpty: number;
  daysInMonth: number;
  eventDays: Record<number, string>;
};

// Builds the calendar cells: leading blanks, then day numbers (some with an
// event dot), then trailing blanks to complete the final week.
function buildCells(calendar: EventCalendar) {
  const cells: { day: number | null; event?: string }[] = [];
  for (let i = 0; i < calendar.leadingEmpty; i++) cells.push({ day: null });
  for (let d = 1; d <= calendar.daysInMonth; d++) {
    cells.push({ day: d, event: calendar.eventDays[d] });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null });
  return cells;
}

export function EventsView({
  upcoming,
  past,
  calendar,
}: {
  upcoming: PublicEvent[];
  past: PublicEvent[];
  calendar: EventCalendar;
}) {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const cells = useMemo(() => buildCells(calendar), [calendar]);
  const events = tab === "upcoming" ? upcoming : past;

  return (
    <section>
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6 pt-16 pb-[34px]">
          <div>
            <Eyebrow sparkle={false}>Gather with us</Eyebrow>
            <h1 className="font-display mt-[14px] text-[clamp(32px,4vw,46px)] font-semibold tracking-[-0.01em]">
              Events
            </h1>
            <p className="font-reading text-ink-muted mt-3 max-w-[52ch] text-[16px] leading-[1.6]">
              Leadership courses, Bible study sessions, conferences, and workshops — where OBS
              teaching happens live.
            </p>
          </div>
          <div className="bg-cream flex gap-1 rounded-full p-1">
            {(["list", "calendar"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={cn(
                  "rounded-full px-[18px] py-[9px] text-[13px] font-semibold capitalize transition-colors",
                  view === v
                    ? "bg-paper text-ink shadow-[0_2px_6px_rgba(26,26,26,0.08)]"
                    : "text-ink-muted",
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <Tabs
          labels={["Upcoming Events", "Past Events"]}
          onChange={(i) => setTab(i === 0 ? "upcoming" : "past")}
          className="mb-8"
        />

        {view === "list" ? (
          <div className="flex flex-col gap-[18px] pb-[90px]">
            {events.length === 0 && (
              <p className="text-ink-muted text-[14px]">
                {tab === "upcoming" ? "No upcoming events yet." : "No past events."}
              </p>
            )}
            {events.map((e) => (
              <div
                key={e.slug}
                className="border-line bg-paper hover:border-gold-deep flex items-center gap-[22px] rounded-[16px] border px-6 py-5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 max-[620px]:flex-wrap"
              >
                <div className="bg-gold flex h-[66px] w-[66px] shrink-0 flex-col items-center justify-center rounded-[12px]">
                  <span className="text-[11px] font-bold tracking-[0.04em] uppercase">
                    {e.month}
                  </span>
                  <span className="font-display mt-0.5 text-[22px] leading-none font-semibold">
                    {e.day}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display mb-1.5 text-[18px] font-semibold">{e.title}</h3>
                  <div className="text-ink-muted flex flex-wrap gap-4 text-[13px]">
                    <span className="flex items-center gap-1.5">
                      <svg className="h-[14px] w-[14px]" viewBox="0 0 20 20" fill="none">
                        <path d="M4 3h9l3 3v11H4z" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                      {e.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="h-[14px] w-[14px]" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M10 18s6-5.5 6-10a6 6 0 10-12 0c0 4.5 6 10 6 10z"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                        <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                      {e.location}
                    </span>
                  </div>
                </div>
                {e.registerUrl && (
                  <Button href={e.registerUrl} className="shrink-0 max-[620px]:w-full">
                    Register
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="pb-[90px]">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-[20px] font-semibold">{calendar.label}</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous month"
                  className="border-line flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border"
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Next month"
                  className="border-line flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border"
                >
                  →
                </button>
              </div>
            </div>
            <div className="border-line bg-line grid grid-cols-7 gap-px overflow-hidden rounded-[14px] border">
              {dow.map((d) => (
                <div
                  key={d}
                  className="bg-cream text-ink-muted py-2.5 text-center text-[11.5px] font-bold tracking-[0.04em] uppercase"
                >
                  {d}
                </div>
              ))}
              {cells.map((c, i) => (
                <div
                  key={i}
                  className={cn(
                    "bg-paper text-ink-muted relative min-h-[88px] p-2 text-[12.5px] max-[620px]:min-h-[56px] max-[620px]:text-[11px]",
                    c.day === null && "opacity-40",
                  )}
                >
                  {c.day !== null && <span className="text-ink font-semibold">{c.day}</span>}
                  {c.event && (
                    <span className="bg-gold text-ink mt-2 inline-block rounded-[5px] px-1.5 py-[3px] text-[10.5px] font-bold">
                      {c.event}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
