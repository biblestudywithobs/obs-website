"use client";

import { useActionState } from "react";
import {
  saveReadingPlan,
  deleteReadingPlan,
  type SaveReadingPlanState,
} from "@/lib/actions/admin-reading-plans";
import type { ReadingPlanDetail } from "@/lib/queries/admin-reading-plans";

const CATEGORIES = ["Beginner", "Topical", "Book Study", "Devotional"] as const;
const STATUSES = ["draft", "in_review", "published"] as const;
const statusLabels: Record<string, string> = {
  draft: "Draft",
  in_review: "In review",
  published: "Published",
};

const initialState: SaveReadingPlanState = { error: null };

export function ReadingPlanEditorForm({ plan }: { plan: ReadingPlanDetail | null }) {
  const [state, formAction, pending] = useActionState(saveReadingPlan, initialState);

  return (
    <form action={formAction} className="max-w-[560px]">
      {plan && <input type="hidden" name="id" value={plan.id} />}

      {state.error && (
        <div className="border-oxblood/30 bg-oxblood/10 text-oxblood mb-5 rounded-[10px] border px-3.5 py-3 text-[13px]">
          {state.error}
        </div>
      )}

      <div className="mb-4">
        <label className="mb-1.5 block text-[12.5px] font-semibold">Title</label>
        <input
          type="text"
          name="title"
          defaultValue={plan?.title}
          required
          className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold">Category</label>
          <select
            name="category"
            defaultValue={plan?.category ?? CATEGORIES[0]}
            className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold">Duration (days)</label>
          <input
            type="number"
            name="durationDays"
            min={1}
            defaultValue={plan?.durationDays}
            required
            className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-[12.5px] font-semibold">Excerpt</label>
        <textarea
          name="excerpt"
          defaultValue={plan?.excerpt}
          required
          className="border-line bg-paper font-ui focus:border-gold-deep min-h-[90px] w-full resize-y rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-[12.5px] font-semibold">Slug (optional)</label>
        <input
          type="text"
          name="slug"
          defaultValue={plan?.slug}
          placeholder="auto-generated from title"
          className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        />
      </div>

      <label className="mb-4 flex items-center gap-2 text-[13px] font-medium">
        <input type="checkbox" name="featured" defaultChecked={plan?.featured} />
        Feature at the top of /reading-plans
      </label>

      <div className="mb-6">
        <label className="mb-1.5 block text-[12.5px] font-semibold">Status</label>
        <select
          name="status"
          defaultValue={plan?.status ?? "draft"}
          className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-gold text-ink hover:bg-gold-deep rounded-full px-[22px] py-3 text-[14.5px] font-medium transition-colors disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {plan && (
          <button
            type="submit"
            formAction={deleteReadingPlan.bind(null, plan.id)}
            formNoValidate
            onClick={(e) => {
              if (!confirm("Delete this reading plan? This can't be undone.")) e.preventDefault();
            }}
            className="border-oxblood/30 text-oxblood hover:bg-oxblood/10 rounded-full border px-[22px] py-3 text-[14.5px] font-medium transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
