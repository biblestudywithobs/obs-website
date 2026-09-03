"use client";

import { useState } from "react";
import type { ReadingPlanDay } from "@/types/content";

// Day-by-day content for a Commentary — all days ship to the client already
// (no gating/scheduling), this just switches which one is shown.
export function CommentaryDayViewer({ days }: { days: ReadingPlanDay[] }) {
  const [activeDay, setActiveDay] = useState(days[0]?.dayNumber ?? 1);
  const current = days.find((d) => d.dayNumber === activeDay) ?? days[0];

  if (!current) {
    return (
      <p className="text-ink-muted font-reading text-[15px] italic">
        This commentary&apos;s content is coming soon.
      </p>
    );
  }

  return (
    <div>
      <div className="border-line mb-8 flex gap-2 overflow-x-auto border-b pb-4">
        {days.map((d) => (
          <button
            key={d.dayNumber}
            type="button"
            onClick={() => setActiveDay(d.dayNumber)}
            className={
              "font-ui shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors " +
              (d.dayNumber === activeDay
                ? "bg-ink text-cream"
                : "bg-cream text-ink-muted hover:text-ink")
            }
          >
            Day {d.dayNumber}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="font-display text-[24px] font-semibold">{current.title}</h2>
        {current.passageRef && (
          <p className="text-gold-deep mt-1.5 text-[14px] font-semibold">{current.passageRef}</p>
        )}
      </div>

      {current.contentHtml ? (
        <div
          className="prose-editor font-reading text-ink-muted text-[17px] leading-[1.85] max-[620px]:text-[16px]"
          dangerouslySetInnerHTML={{ __html: current.contentHtml }}
        />
      ) : (
        <p className="text-ink-muted font-reading text-[15px] italic">
          This day&apos;s content is coming soon.
        </p>
      )}
    </div>
  );
}
