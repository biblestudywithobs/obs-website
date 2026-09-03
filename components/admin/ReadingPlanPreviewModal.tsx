"use client";

import { useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ShareButton } from "@/components/ui/ShareButton";
import type { ReadingPlanDayDraft } from "@/lib/queries/admin-reading-plans";

// Shows exactly how the current (possibly unsaved) form values will render
// on the public /reading-plans page — reuses the same markup as
// components/sections/ReadingPlanLibrary.tsx so this is a true preview, not
// an approximation. `Start Plan`/`Share` are inert here (preview only).
export function ReadingPlanPreviewModal({
  title,
  category,
  durationDays,
  excerpt,
  bodyHtml,
  imageUrl,
  featured,
  planType,
  days,
  onClose,
}: {
  title: string;
  category: string;
  durationDays: number | "";
  excerpt: string;
  bodyHtml: string;
  imageUrl: string;
  featured: boolean;
  planType: "reading_plan" | "commentary";
  days: ReadingPlanDayDraft[];
  onClose: () => void;
}) {
  const [activeDay, setActiveDay] = useState(1);
  const duration =
    durationDays === "" ? "— days" : `${durationDays} day${durationDays === 1 ? "" : "s"}`;
  const displayTitle = title.trim() || "Untitled reading plan";
  const displayExcerpt =
    excerpt.trim() || "No excerpt yet — this is where the plan summary appears.";
  const currentDay = days.find((d) => d.dayNumber === activeDay);

  return (
    <div className="fixed inset-0 z-[400] overflow-y-auto bg-[rgba(26,26,26,0.55)] p-6">
      <div className="bg-paper border-line mx-auto mb-10 max-w-[900px] rounded-[18px] border">
        <div className="border-line bg-cream sticky top-0 z-10 flex items-center justify-between rounded-t-[18px] border-b px-6 py-3.5">
          <span className="font-ui text-ink-muted text-[12.5px] font-semibold tracking-[0.04em] uppercase">
            Preview — how this looks on /reading-plans
          </span>
          <button
            type="button"
            onClick={onClose}
            className="border-line hover:border-gold-deep flex h-8 w-8 items-center justify-center rounded-full border transition-colors"
            aria-label="Close preview"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M1 1L15 15M15 1L1 15" stroke="#2B2420" strokeWidth="1.6" />
            </svg>
          </button>
        </div>

        <div className="px-8 py-10 max-[620px]:px-5">
          {featured ? (
            <>
              <p className="text-ink-muted mb-4 text-[12.5px] font-semibold">
                Shown as the featured plan at the top of the page:
              </p>
              <div className="bg-ink text-cream flex flex-wrap items-center justify-between gap-9 rounded-[22px] px-11 py-10 max-[980px]:flex-col-reverse max-[980px]:items-start max-[620px]:p-[30px]">
                <div>
                  <Eyebrow sparkle={false} onDark>
                    Featured plan
                  </Eyebrow>
                  <h2 className="font-display mt-3 max-w-[20ch] text-[clamp(24px,2.8vw,32px)] font-semibold">
                    {displayTitle}
                  </h2>
                  <p className="font-reading text-cream/70 mt-2.5 max-w-[44ch] text-[14px] leading-[1.6]">
                    {displayExcerpt}
                  </p>
                  <div className="mt-[22px] flex gap-3">
                    <Button href="#">Start Plan</Button>
                    <ShareButton label="Share plan" />
                  </div>
                </div>
                <div className="bg-gold relative h-[190px] w-[150px] shrink-0 overflow-hidden rounded-[14px]">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="bg-gold-deep absolute top-0 right-[22px] h-[60px] w-4 [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)]" />
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-ink-muted mb-4 text-[12.5px] font-semibold">
                Shown as a card in the {category} list:
              </p>
              <div className="max-w-[320px]">
                <div className="border-line bg-paper overflow-hidden rounded-[16px] border">
                  <div className="bg-cream relative flex aspect-[16/10] items-center justify-center overflow-hidden">
                    {imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                    )}
                    <span className="bg-paper absolute top-[14px] right-[14px] rounded-full px-2.5 py-[5px] text-[11px] font-bold">
                      {duration}
                    </span>
                  </div>
                  <div className="px-[22px] pt-5 pb-[22px]">
                    <h3 className="font-display mb-2 text-[17.5px] leading-[1.3] font-semibold">
                      {displayTitle}
                    </h3>
                    <p className="font-reading text-ink-muted mb-[18px] text-[13.5px] leading-[1.55]">
                      {displayExcerpt}
                    </p>
                    <div className="flex items-center gap-2.5">
                      <Button href="#" size="sm" className="flex-1">
                        Start Plan
                      </Button>
                      <ShareButton />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <p className="text-ink-muted border-line mt-12 mb-4 border-t pt-8 text-[12.5px] font-semibold">
            Shown as the full reading plan page:
          </p>
          <div className="border-line bg-paper rounded-[16px] border px-8 py-10 max-[620px]:px-5">
            <div className="mx-auto max-w-[620px] text-center">
              <span className="bg-cream text-gold-deep inline-block rounded-full px-[14px] py-1.5 text-[11.5px] font-bold tracking-[0.06em] uppercase">
                {category}
              </span>
              <h1 className="font-display my-5 text-[clamp(26px,4vw,40px)] leading-[1.15] font-semibold tracking-[-0.01em]">
                {displayTitle}
              </h1>
              <div className="text-ink-muted flex items-center justify-center gap-2.5 text-[13.5px]">
                <span>{duration}</span>
              </div>
              <p className="font-reading text-ink-muted mx-auto mt-5 max-w-[56ch] text-[15px] leading-[1.6]">
                {displayExcerpt}
              </p>
            </div>

            {imageUrl && (
              <div className="relative mx-auto mt-8 aspect-[21/9] max-w-[600px] overflow-hidden rounded-[16px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
            )}

            <div className="mx-auto max-w-[600px] pt-10">
              {planType === "commentary" ? (
                days.length === 0 ? (
                  <p className="text-ink-muted font-reading text-[15px] italic">
                    No days added yet — this is where the day-by-day content will appear.
                  </p>
                ) : (
                  <>
                    <div className="mb-7 flex flex-wrap gap-2">
                      {days.map((d) => (
                        <button
                          key={d.dayNumber}
                          type="button"
                          onClick={() => setActiveDay(d.dayNumber)}
                          className={
                            "font-ui rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors " +
                            (d.dayNumber === activeDay
                              ? "bg-ink text-cream"
                              : "bg-cream text-ink-muted hover:text-ink")
                          }
                        >
                          Day {d.dayNumber}
                        </button>
                      ))}
                    </div>
                    {currentDay && (
                      <div className="mb-6">
                        <h3 className="font-display text-[20px] font-semibold">
                          {currentDay.title}
                        </h3>
                        {currentDay.passageRef && (
                          <p className="text-gold-deep mt-1 text-[13px] font-semibold">
                            {currentDay.passageRef}
                          </p>
                        )}
                      </div>
                    )}
                    {currentDay?.content ? (
                      <div
                        className="prose-editor font-reading text-ink-muted text-[16px] leading-[1.85]"
                        dangerouslySetInnerHTML={{ __html: currentDay.content }}
                      />
                    ) : (
                      <p className="text-ink-muted font-reading text-[15px] italic">
                        Nothing written yet for this day.
                      </p>
                    )}
                  </>
                )
              ) : bodyHtml ? (
                <div
                  className="prose-editor font-reading text-ink-muted text-[16px] leading-[1.85]"
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              ) : (
                <p className="text-ink-muted font-reading text-[15px] italic">
                  Nothing written yet — this is where the plan&apos;s content will appear.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
