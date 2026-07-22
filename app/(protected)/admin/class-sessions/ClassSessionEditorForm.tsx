"use client";

import { useActionState } from "react";
import {
  saveClassSession,
  deleteClassSession,
  type SaveClassSessionState,
} from "@/lib/actions/admin-class-sessions";
import type { ClassSessionDetail } from "@/lib/queries/admin-class-sessions";
import { FileUploadField } from "@/components/admin/FileUploadField";

const STATUSES = ["draft", "in_review", "published"] as const;
const statusLabels: Record<string, string> = {
  draft: "Draft",
  in_review: "In review",
  published: "Published",
};

const initialState: SaveClassSessionState = { error: null };

export function ClassSessionEditorForm({ session }: { session: ClassSessionDetail | null }) {
  const [state, formAction, pending] = useActionState(saveClassSession, initialState);

  return (
    <form action={formAction} className="max-w-[560px]">
      {session && <input type="hidden" name="id" value={session.id} />}

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
          defaultValue={session?.title}
          required
          placeholder="e.g. Session 1"
          className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold">Series</label>
          <input
            type="text"
            name="series"
            defaultValue={session?.series}
            required
            placeholder="e.g. Soteriology"
            className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold">Teacher</label>
          <input
            type="text"
            name="teacher"
            defaultValue={session?.teacher}
            required
            placeholder="e.g. OBS Faculty"
            className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold">Duration label</label>
          <input
            type="text"
            name="durationLabel"
            defaultValue={session?.durationLabel}
            required
            placeholder="e.g. 42 min or 1h 27m"
            className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold">Recorded date</label>
          <input
            type="date"
            name="recordedAt"
            defaultValue={session?.recordedAt}
            required
            className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-4">
        <FileUploadField
          name="videoUrl"
          folder="class-sessions"
          defaultValue={session?.videoUrl}
          accept="audio/*,video/*"
          label="Audio/video (optional)"
          placeholder="https://… or upload a file"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-[12.5px] font-semibold">Slug (optional)</label>
        <input
          type="text"
          name="slug"
          defaultValue={session?.slug}
          placeholder="auto-generated from title"
          className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <label className="mb-1.5 block text-[12.5px] font-semibold">Status</label>
        <select
          name="status"
          defaultValue={session?.status ?? "draft"}
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
        {session && (
          <button
            type="submit"
            formAction={deleteClassSession.bind(null, session.id)}
            formNoValidate
            onClick={(e) => {
              if (!confirm("Delete this class session? This can't be undone.")) e.preventDefault();
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
