"use client";

import { useActionState, useRef, useState } from "react";
import {
  saveReadingPlan,
  deleteReadingPlan,
  regeneratePreviewToken,
  type SaveReadingPlanState,
} from "@/lib/actions/admin-reading-plans";
import type { ReadingPlanDetail, ReadingPlanDayDraft } from "@/lib/queries/admin-reading-plans";
import { ReadingPlanPreviewModal } from "@/components/admin/ReadingPlanPreviewModal";
import { ReadingPlanDayEditor } from "@/components/admin/ReadingPlanDayEditor";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { cn } from "@/lib/cn";

const CATEGORIES = ["Beginner", "Topical", "Book Study", "Devotional"] as const;
const STATUSES = ["draft", "in_review", "published"] as const;
const statusLabels: Record<string, string> = {
  draft: "Draft",
  in_review: "In review",
  published: "Published",
};
const PLAN_TYPES = [
  { value: "reading_plan", label: "Reading Plan" },
  { value: "commentary", label: "Commentary" },
] as const;

const initialState: SaveReadingPlanState = { error: null };

export function ReadingPlanEditorForm({ plan }: { plan: ReadingPlanDetail | null }) {
  const [state, formAction, pending] = useActionState(saveReadingPlan, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Controlled so the Preview panel reflects what's on screen right now,
  // including unsaved edits — not just what's already in the database.
  const [title, setTitle] = useState(plan?.title ?? "");
  const [category, setCategory] = useState(plan?.category ?? CATEGORIES[0]);
  const [durationDays, setDurationDays] = useState<number | "">(plan?.durationDays ?? "");
  const [excerpt, setExcerpt] = useState(plan?.excerpt ?? "");
  const [featured, setFeatured] = useState(plan?.featured ?? false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(plan?.imageUrl ?? "");
  const [planType, setPlanType] = useState<"reading_plan" | "commentary">(
    plan?.planType ?? "reading_plan",
  );
  const [dayCount, setDayCount] = useState(() =>
    plan?.planType === "commentary" ? Math.max(plan.days.length, plan.durationDays, 1) : 1,
  );
  const [showPreview, setShowPreview] = useState(false);
  const [previewBodyHtml, setPreviewBodyHtml] = useState("");
  const [previewDays, setPreviewDays] = useState<ReadingPlanDayDraft[]>([]);
  const [previewToken, setPreviewToken] = useState(plan?.previewToken ?? "");
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const daysByNumber = new Map(plan?.days.map((d) => [d.dayNumber, d]));

  function handleDurationChange(value: number | "") {
    setDurationDays(value);
    if (planType === "commentary" && value !== "") {
      setDayCount(Math.max(1, value));
    }
  }

  function handlePlanTypeChange(next: "reading_plan" | "commentary") {
    setPlanType(next);
    if (next === "commentary" && durationDays !== "") {
      setDayCount(Math.max(1, durationDays));
    }
  }

  // RichTextEditor keeps its own Tiptap state and only syncs out to hidden
  // <input>s, so the freshest value lives in the DOM, not in this
  // component's React state — read it straight off the form at the moment
  // Preview is clicked rather than trying to mirror every keystroke.
  function openPreview() {
    const form = formRef.current;
    const bodyInput = form?.elements.namedItem("bodyHtml") as HTMLInputElement | null;
    setPreviewBodyHtml(bodyInput?.value ?? "");

    const days: ReadingPlanDayDraft[] = [];
    for (let i = 0; i < dayCount; i++) {
      const titleInput = form?.elements.namedItem(`day_title_${i}`) as HTMLInputElement | null;
      const passageInput = form?.elements.namedItem(`day_passageRef_${i}`) as HTMLInputElement | null;
      const contentInput = form?.elements.namedItem(`day_content_${i}`) as HTMLInputElement | null;
      days.push({
        id: null,
        dayNumber: i + 1,
        title: titleInput?.value || `Day ${i + 1}`,
        passageRef: passageInput?.value ?? "",
        content: contentInput?.value ?? "",
      });
    }
    setPreviewDays(days);
    setShowPreview(true);
  }

  async function copyPreviewLink() {
    await navigator.clipboard.writeText(
      `${window.location.origin}/reading-plans/preview/${previewToken}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  // Invalidates the current link (anyone holding the old one gets a 404)
  // and copies the new one — for when a draft link was shared too widely.
  async function regenerateAndCopy() {
    if (!plan) return;
    setRegenerating(true);
    const result = await regeneratePreviewToken(plan.id);
    setRegenerating(false);
    if ("error" in result) {
      alert(`Couldn't regenerate the link: ${result.error}`);
      return;
    }
    setPreviewToken(result.token);
    await navigator.clipboard.writeText(
      `${window.location.origin}/reading-plans/preview/${result.token}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <>
      <form
        ref={formRef}
        action={formAction}
        className="max-w-[720px] min-[1200px]:max-w-[860px] min-[1600px]:max-w-[980px]"
      >
        {plan && <input type="hidden" name="id" value={plan.id} />}
        <input type="hidden" name="planType" value={planType} />

        {state.error && (
          <div className="border-oxblood/30 bg-oxblood/10 text-oxblood mb-5 rounded-[10px] border px-3.5 py-3 text-[13px]">
            {state.error}
          </div>
        )}

        {/* Substack-style compose toolbar: preview on the left, save/publish
            actions on the right, sitting above a large borderless title. */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={openPreview}
              className="border-line hover:border-gold-deep font-ui flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path
                  d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z"
                  stroke="#2B2420"
                  strokeWidth="1.4"
                />
                <circle cx="10" cy="10" r="2.5" stroke="#2B2420" strokeWidth="1.4" />
              </svg>
              Preview
            </button>

            {plan && (
              <button
                type="button"
                onClick={copyPreviewLink}
                className="border-line hover:border-gold-deep font-ui relative flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M8 12a3.5 3.5 0 0 0 5 0l2-2a3.5 3.5 0 1 0-5-5l-.5.5M12 8a3.5 3.5 0 0 0-5 0l-2 2a3.5 3.5 0 1 0 5 5l.5-.5"
                    stroke="#2B2420"
                    strokeWidth="1.4"
                  />
                </svg>
                Copy preview link
                {copied && (
                  <span className="bg-ink text-cream absolute -top-9 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap">
                    Link copied
                  </span>
                )}
              </button>
            )}
            {plan && (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Regenerate the preview link? The old link will stop working."))
                    regenerateAndCopy();
                }}
                disabled={regenerating}
                className="text-ink-muted hover:text-ink font-ui text-[12px] font-medium underline decoration-dotted disabled:opacity-60"
              >
                Regenerate
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="bg-gold text-ink hover:bg-gold-deep rounded-full px-[22px] py-2.5 text-[14px] font-semibold transition-colors disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            {plan && (
              <button
                type="submit"
                formAction={deleteReadingPlan.bind(null, plan.id)}
                formNoValidate
                onClick={(e) => {
                  if (!confirm("Delete this reading plan? This can't be undone."))
                    e.preventDefault();
                }}
                className="border-oxblood/30 text-oxblood hover:bg-oxblood/10 rounded-full border px-[22px] py-2.5 text-[14px] font-semibold transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Reading Plan vs Commentary — picks single long-form content vs a
            day-by-day breakdown below. */}
        <div className="bg-cream mb-8 inline-flex rounded-full p-1">
          {PLAN_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => handlePlanTypeChange(t.value)}
              className={cn(
                "font-ui rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors",
                planType === t.value ? "bg-gold text-ink" : "text-ink-muted hover:text-ink",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Big borderless title, matching a Substack/Medium compose surface */}
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder={planType === "commentary" ? "Commentary title…" : "Reading plan title…"}
          className="font-display placeholder:text-ink-muted/40 mb-3 w-full bg-transparent text-[34px] leading-[1.2] font-semibold focus:outline-none"
        />

        {/* Excerpt doubles as the "subtitle" line */}
        <textarea
          name="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
          rows={2}
          placeholder="Add a short excerpt readers will see on the card…"
          className="font-reading text-ink-muted placeholder:text-ink-muted/40 mb-6 w-full resize-none bg-transparent text-[17px] leading-[1.5] focus:outline-none"
        />

        {/* Compact inline meta pills, Substack-tag style */}
        <div className="mb-8 flex flex-wrap items-center gap-2.5">
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-cream font-ui rounded-full border-none px-4 py-2 text-[13px] font-semibold focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="bg-cream font-ui flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold">
            <input
              type="number"
              name="durationDays"
              min={1}
              value={durationDays}
              onChange={(e) =>
                handleDurationChange(e.target.value === "" ? "" : Number(e.target.value))
              }
              required
              className="w-10 bg-transparent text-right focus:outline-none"
            />
            days
          </div>
          <label className="bg-cream font-ui flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Feature at the top
          </label>
          {/* Mirrors the checkbox above under the field name the Server Action reads */}
          <input type="hidden" name="featured" value={featured ? "on" : ""} />
        </div>

        {/* Cover image — shown on the card and detail page. */}
        <div className="mb-8">
          <label className="mb-1.5 block text-[12.5px] font-semibold">Cover image (optional)</label>
          <input type="hidden" name="existingImageUrl" value={plan?.imageUrl ?? ""} />
          <div className="flex items-center gap-4">
            {imagePreviewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreviewUrl}
                alt="Cover preview"
                className="border-line h-20 w-20 shrink-0 rounded-[10px] border object-cover"
              />
            )}
            <label className="border-line bg-paper text-ink-muted hover:border-gold-deep hover:text-ink flex cursor-pointer items-center justify-center rounded-[10px] border px-4 py-2.5 text-[13px] font-semibold transition-colors">
              {imagePreviewUrl ? "Replace image" : "Upload an image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setImagePreviewUrl(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
        </div>

        {/* Reading Plan: one long-form piece. Commentary: a day-by-day
            breakdown, day count driven by the "days" field above. */}
        {planType === "reading_plan" ? (
          <div className="mb-8">
            <RichTextEditor name="bodyHtml" initialHtml={plan?.bodyHtml ?? ""} />
          </div>
        ) : (
          <div className="mb-8">
            <input type="hidden" name="dayCount" value={dayCount} />
            {Array.from({ length: dayCount }, (_, i) => i + 1).map((dayNumber) => (
              <ReadingPlanDayEditor
                key={dayNumber}
                dayNumber={dayNumber}
                day={daysByNumber.get(dayNumber)}
                defaultOpen={dayNumber === 1}
              />
            ))}
          </div>
        )}

        {/* Publishing settings — de-emphasized, everything an editor needs
            before publishing but not competing with the writing surface. */}
        <div className="border-line bg-cream/40 rounded-[14px] border p-6">
          <h2 className="font-ui text-ink-muted mb-4 text-[11.5px] font-bold tracking-[0.06em] uppercase">
            Publishing settings
          </h2>
          <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold">Slug (optional)</label>
              <input
                type="text"
                name="slug"
                defaultValue={plan?.slug}
                placeholder="auto-generated from title"
                className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-2.5 text-[14px] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold">Status</label>
              <select
                name="status"
                defaultValue={plan?.status ?? "draft"}
                className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-2.5 text-[14px] focus:outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {statusLabels[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </form>

      {showPreview && (
        <ReadingPlanPreviewModal
          title={title}
          category={category}
          durationDays={durationDays}
          excerpt={excerpt}
          bodyHtml={previewBodyHtml}
          imageUrl={imagePreviewUrl}
          featured={featured}
          planType={planType}
          days={previewDays}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
