"use client";

import { useActionState } from "react";
import {
  saveResource,
  deleteResource,
  type SaveResourceState,
} from "@/lib/actions/admin-resources";
import type { ResourceDetail, AuthorOption } from "@/lib/queries/admin-resources";
import { RichTextEditor } from "./RichTextEditor";
import { FileUploadField } from "@/components/admin/FileUploadField";

const CATEGORIES = ["Articles", "Bible Studies", "Manuals", "Devotionals", "Downloads"] as const;
const STATUSES = ["draft", "in_review", "published"] as const;
const statusLabels: Record<string, string> = {
  draft: "Draft",
  in_review: "In review",
  published: "Published",
};

const initialState: SaveResourceState = { error: null };

export function ResourceEditorForm({
  resource,
  authors,
}: {
  resource: ResourceDetail | null;
  authors: AuthorOption[];
}) {
  const [state, formAction, pending] = useActionState(saveResource, initialState);

  return (
    <form action={formAction}>
      {resource && <input type="hidden" name="id" value={resource.id} />}

      {state.error && (
        <div className="border-oxblood/30 bg-oxblood/10 text-oxblood mb-5 rounded-[10px] border px-3.5 py-3 text-[13px]">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-[1fr_300px] gap-0 max-[1080px]:grid-cols-1">
        <div className="max-w-[820px] pr-10 max-[1080px]:pr-0">
          <input
            type="text"
            name="title"
            defaultValue={resource?.title}
            required
            placeholder="Article title..."
            className="font-display mb-[22px] w-full border-none bg-transparent text-[32px] font-semibold tracking-[-0.01em] focus:outline-none"
          />

          <div className="mb-5">
            <label className="mb-1.5 block text-[12.5px] font-semibold">Excerpt</label>
            <textarea
              name="excerpt"
              defaultValue={resource?.excerpt}
              required
              className="border-line bg-paper font-ui focus:border-gold-deep min-h-[70px] w-full resize-y rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
            />
          </div>

          <div className="mb-2">
            <label className="text-[12.5px] font-semibold">Body</label>
          </div>

          <RichTextEditor name="bodyHtml" initialHtml={resource?.bodyHtml ?? ""} />
        </div>

        <aside className="border-line border-l pl-6 max-[1080px]:mt-8 max-[1080px]:border-t max-[1080px]:border-l-0 max-[1080px]:pt-6 max-[1080px]:pl-0">
          <div className="mb-6">
            <h4 className="text-ink-muted mb-2.5 text-[12px] font-bold tracking-[0.06em] uppercase">
              Category
            </h4>
            <select
              name="category"
              defaultValue={resource?.category ?? CATEGORIES[0]}
              className="border-line bg-paper font-ui w-full rounded-[9px] border px-3 py-2.5 text-[13.5px]"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <h4 className="text-ink-muted mb-2.5 text-[12px] font-bold tracking-[0.06em] uppercase">
              Tag (badge label)
            </h4>
            <input
              type="text"
              name="tag"
              defaultValue={resource?.tag}
              placeholder="e.g. Article, Series, Manual"
              className="border-line bg-paper font-ui w-full rounded-[9px] border px-3 py-2.5 text-[13.5px]"
            />
          </div>

          <div className="mb-6">
            <h4 className="text-ink-muted mb-2.5 text-[12px] font-bold tracking-[0.06em] uppercase">
              Author
            </h4>
            <select
              name="authorId"
              defaultValue={resource?.authorId ?? ""}
              className="border-line bg-paper font-ui w-full rounded-[9px] border px-3 py-2.5 text-[13.5px]"
            >
              <option value="">—</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <h4 className="text-ink-muted mb-2.5 text-[12px] font-bold tracking-[0.06em] uppercase">
              Meta label
            </h4>
            <input
              type="text"
              name="metaLabel"
              defaultValue={resource?.metaLabel}
              placeholder="e.g. 6 parts, 30 days"
              className="border-line bg-paper font-ui mb-2.5 w-full rounded-[9px] border px-3 py-2.5 text-[13.5px]"
            />
            <h4 className="text-ink-muted mb-2.5 text-[12px] font-bold tracking-[0.06em] uppercase">
              CTA label
            </h4>
            <input
              type="text"
              name="ctaLabel"
              defaultValue={resource?.ctaLabel || "Read →"}
              className="border-line bg-paper font-ui w-full rounded-[9px] border px-3 py-2.5 text-[13.5px]"
            />
          </div>

          <div className="mb-6">
            <h4 className="text-ink-muted mb-2.5 text-[12px] font-bold tracking-[0.06em] uppercase">
              Slug
            </h4>
            <input
              type="text"
              name="slug"
              defaultValue={resource?.slug}
              placeholder="auto-generated from title"
              className="border-line bg-paper font-ui w-full rounded-[9px] border px-3 py-2.5 text-[13.5px]"
            />
          </div>

          <div className="mb-6">
            <FileUploadField
              name="href"
              folder="resources"
              defaultValue={resource?.href}
              accept="application/pdf"
              label="Download file (for Downloads)"
              placeholder="https://… or upload a PDF"
            />
          </div>

          <label className="mb-6 flex items-center gap-2 text-[13px] font-medium">
            <input type="checkbox" name="feature" defaultChecked={resource?.feature} />
            Feature on homepage
          </label>

          <div className="mb-7">
            <h4 className="text-ink-muted mb-2.5 text-[12px] font-bold tracking-[0.06em] uppercase">
              Status
            </h4>
            <select
              name="status"
              defaultValue={resource?.status ?? "draft"}
              className="border-line bg-paper font-ui w-full rounded-[9px] border px-3 py-2.5 text-[13.5px]"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="bg-gold text-ink hover:bg-gold-deep w-full rounded-full px-[22px] py-3 text-[14.5px] font-medium transition-colors disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save"}
          </button>

          {resource && (
            <button
              type="submit"
              formAction={deleteResource.bind(null, resource.id)}
              formNoValidate
              onClick={(e) => {
                if (!confirm("Delete this piece of content? This can't be undone.")) {
                  e.preventDefault();
                }
              }}
              className="border-oxblood/30 text-oxblood hover:bg-oxblood/10 mt-2.5 w-full rounded-full border px-[22px] py-3 text-[14.5px] font-medium transition-colors"
            >
              Delete
            </button>
          )}
        </aside>
      </div>
    </form>
  );
}
