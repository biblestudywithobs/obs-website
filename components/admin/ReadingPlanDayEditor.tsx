"use client";

import { RichTextEditor } from "@/components/admin/RichTextEditor";
import type { ReadingPlanDayDraft } from "@/lib/queries/admin-reading-plans";

// One day of a Commentary. Wrapped in <details> rather than unmounted when
// collapsed, so every day's hidden inputs (including RichTextEditor's) stay
// in the form's DOM and submit correctly regardless of which day is
// expanded — the day count itself (not a per-card remove button) is what
// adds/removes days, driven by the "days" field in ReadingPlanEditorForm.
export function ReadingPlanDayEditor({
  dayNumber,
  day,
  defaultOpen,
}: {
  dayNumber: number;
  day: ReadingPlanDayDraft | undefined;
  defaultOpen: boolean;
}) {
  return (
    <details
      className="border-line bg-paper mb-3 rounded-[14px] border px-5 py-4 open:pb-5"
      open={defaultOpen}
    >
      <summary className="font-ui flex cursor-pointer list-none items-center gap-2.5 text-[14px] font-semibold">
        <span className="bg-gold text-ink flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11.5px] font-bold">
          {dayNumber}
        </span>
        Day {dayNumber}
        {day?.title && day.title !== `Day ${dayNumber}` && (
          <span className="text-ink-muted font-normal">— {day.title}</span>
        )}
      </summary>

      <div className="mt-4 grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
        <div>
          <label className="mb-1.5 block text-[12px] font-semibold">Day title</label>
          <input
            type="text"
            name={`day_title_${dayNumber - 1}`}
            defaultValue={day?.title ?? ""}
            placeholder={`Day ${dayNumber}`}
            className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-2.5 text-[14px] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[12px] font-semibold">Passage (optional)</label>
          <input
            type="text"
            name={`day_passageRef_${dayNumber - 1}`}
            defaultValue={day?.passageRef ?? ""}
            placeholder="e.g. Genesis 3:1-24"
            className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-2.5 text-[14px] focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-3">
        <RichTextEditor name={`day_content_${dayNumber - 1}`} initialHtml={day?.content ?? ""} />
      </div>
    </details>
  );
}
