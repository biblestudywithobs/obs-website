"use client";

import { useActionState } from "react";
import { saveEvent, deleteEvent, type SaveEventState } from "@/lib/actions/admin-events";
import type { EventDetail } from "@/lib/queries/admin-events";

const STATUSES = ["draft", "in_review", "published"] as const;
const statusLabels: Record<string, string> = {
  draft: "Draft",
  in_review: "In review",
  published: "Published",
};

const initialState: SaveEventState = { error: null };

// Formats an ISO timestamp for <input type="datetime-local">'s value/
// defaultValue, which requires "YYYY-MM-DDTHH:mm" in local time.
function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventEditorForm({ event }: { event: EventDetail | null }) {
  const [state, formAction, pending] = useActionState(saveEvent, initialState);

  // datetime-local has no timezone info, so it must be converted to a real
  // ISO string in the browser (using the admin's own local timezone) before
  // submitting — otherwise the server would interpret it in whatever
  // timezone it happens to run in, which is wrong the moment staff and the
  // deployed server aren't in the same one.
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const localInput = form.elements.namedItem("startsAtLocal") as HTMLInputElement;
    const isoInput = form.elements.namedItem("startsAt") as HTMLInputElement;
    if (localInput.value) {
      isoInput.value = new Date(localInput.value).toISOString();
    }
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className="max-w-[560px]"
      encType="multipart/form-data"
    >
      {event && <input type="hidden" name="id" value={event.id} />}
      <input type="hidden" name="startsAt" />
      <input type="hidden" name="existingFlyerUrl" value={event?.flyerUrl ?? ""} />

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
          defaultValue={event?.title}
          required
          className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold">Date &amp; time</label>
          <input
            type="datetime-local"
            name="startsAtLocal"
            defaultValue={event ? toLocalInputValue(event.startsAt) : undefined}
            required
            className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold">Location</label>
          <input
            type="text"
            name="location"
            defaultValue={event?.location}
            required
            placeholder="e.g. Ibadan & Online"
            className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-[12.5px] font-semibold">Description (optional)</label>
        <textarea
          name="description"
          defaultValue={event?.description ?? ""}
          className="border-line bg-paper font-ui focus:border-gold-deep min-h-[90px] w-full resize-y rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-[12.5px] font-semibold">Flyer (optional)</label>
        {event?.flyerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.flyerUrl}
            alt="Current flyer"
            className="border-line mb-2 h-32 w-auto rounded-[10px] border object-cover"
          />
        )}
        <input
          type="file"
          name="flyer"
          accept="image/*"
          className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[13.5px] focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-[12.5px] font-semibold">
          Registration URL (optional)
        </label>
        <input
          type="url"
          name="registerUrl"
          defaultValue={event?.registerUrl ?? ""}
          placeholder="https://…"
          className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-[12.5px] font-semibold">Slug (optional)</label>
        <input
          type="text"
          name="slug"
          defaultValue={event?.slug}
          placeholder="auto-generated from title"
          className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <label className="mb-1.5 block text-[12.5px] font-semibold">Status</label>
        <select
          name="status"
          defaultValue={event?.status ?? "draft"}
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
        {event && (
          <button
            type="submit"
            formAction={deleteEvent.bind(null, event.id)}
            formNoValidate
            onClick={(e) => {
              if (!confirm("Delete this event? This can't be undone.")) e.preventDefault();
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
