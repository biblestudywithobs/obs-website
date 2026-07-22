"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/cn";

export type SelectableListItem = {
  id: string;
  href: string;
  content: React.ReactNode;
};

// Shared checkbox-select + bulk-delete list, used by the Events, Content,
// and Reading Plans admin list pages so an admin can delete many rows at
// once instead of opening each one individually. `onDeleteSelected` is a
// Server Action called directly (not via a <form>), so it revalidates in
// place rather than redirecting — see bulkDelete* in lib/actions/admin-*.ts.
//
// `items` carries pre-rendered row content (built by the Server Component
// page) rather than a render-prop function — plain closures can't cross the
// Server/Client boundary as props, only Server Actions and React nodes can.
export function SelectableList({
  items,
  onDeleteSelected,
  itemLabel = "item",
}: {
  items: SelectableListItem[];
  onDeleteSelected: (ids: string[]) => Promise<void>;
  itemLabel?: string;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) =>
      prev.size === items.length ? new Set() : new Set(items.map((i) => i.id)),
    );
  }

  function deleteSelected() {
    const count = selected.size;
    if (count === 0) return;
    if (!confirm(`Delete ${count} ${itemLabel}${count === 1 ? "" : "s"}? This can't be undone.`))
      return;

    const ids = Array.from(selected);
    startTransition(async () => {
      await onDeleteSelected(ids);
      setSelected(new Set());
      router.refresh();
    });
  }

  return (
    <div>
      {selected.size > 0 && (
        <div className="border-oxblood/30 bg-oxblood/10 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[12px] border px-4 py-3">
          <span className="text-oxblood text-[13.5px] font-semibold">{selected.size} selected</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="text-ink-muted hover:text-ink text-[13px] font-semibold"
            >
              Clear
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={deleteSelected}
              className="bg-oxblood text-cream hover:bg-oxblood-deep rounded-full px-4 py-2 text-[13px] font-semibold transition-colors disabled:opacity-60"
            >
              {isPending ? "Deleting…" : "Delete selected"}
            </button>
          </div>
        </div>
      )}

      <div className="border-line bg-paper rounded-[16px] border">
        <div className="border-line flex items-center gap-3 border-b px-6 py-3">
          <input
            type="checkbox"
            checked={items.length > 0 && selected.size === items.length}
            onChange={toggleAll}
            aria-label="Select all"
            className="accent-oxblood h-4 w-4 shrink-0"
          />
          <span className="text-ink-muted text-[12px] font-bold tracking-[0.06em] uppercase">
            Select all
          </span>
        </div>
        {items.map((item, i) => (
          <div
            key={item.id}
            className={cn(
              "hover:bg-cream flex items-center gap-3 px-6 py-4 transition-colors",
              i !== items.length - 1 && "border-line border-b",
            )}
          >
            <input
              type="checkbox"
              checked={selected.has(item.id)}
              onChange={() => toggle(item.id)}
              aria-label={`Select row ${i + 1}`}
              className="accent-oxblood h-4 w-4 shrink-0"
            />
            <Link
              href={item.href}
              className="flex min-w-0 flex-1 items-center justify-between gap-4"
            >
              {item.content}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
