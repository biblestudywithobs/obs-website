"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LibraryCard } from "@/components/cards/LibraryCard";
import type { LibraryResource } from "@/types/content";

// Mirrors the resource_category Postgres enum (supabase/migrations/0001_init.sql)
// — a fixed schema-level list, not content, so it's safe to keep as a plain
// client-side constant rather than importing the server-only query module.
const libraryCategories = [
  "all",
  "Articles",
  "Bible Studies",
  "Manuals",
  "Devotionals",
  "Downloads",
  "Substack",
] as const;

// Client-side resource library: category chips + live text search, ported from
// the vanilla applyFilters() in OBS-Resources.html (category match AND text
// match over the card's content). Pagination is cosmetic, as in the prototype.
// `resources` is real published data fetched server-side by the page.
export function ResourceLibrary({ resources }: { resources: LibraryResource[] }) {
  const [activeCat, setActiveCat] = useState<string>("all");
  const [term, setTerm] = useState("");

  const filtered = useMemo(() => {
    const q = term.trim().toLowerCase();
    return resources.filter((r) => {
      const matchesCat = activeCat === "all" || r.category === activeCat;
      const haystack = `${r.tag} ${r.title} ${r.excerpt} ${r.meta} ${r.category}`.toLowerCase();
      const matchesSearch = !q || haystack.includes(q);
      return matchesCat && matchesSearch;
    });
  }, [activeCat, term, resources]);

  return (
    <>
      <section className="pt-16 pb-[34px]">
        <div className="wrap">
          <Eyebrow sparkle={false}>The library</Eyebrow>
          <h1 className="font-display mt-[14px] text-[clamp(32px,4vw,46px)] font-semibold tracking-[-0.01em]">
            Resources
          </h1>
          <p className="font-reading text-ink-muted mt-3 max-w-[58ch] text-[16px] leading-[1.6]">
            Articles, teaching manuals, devotionals, and downloads — everything OBS has taught,
            organized in one place.
          </p>
          <div className="bg-cream mt-[26px] flex max-w-[460px] items-center gap-2 rounded-full px-[18px] py-[11px]">
            <svg className="h-4 w-4 shrink-0 opacity-60" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M17 17l-3.5-3.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search resources..."
              aria-label="Search resources"
              className="font-ui w-full bg-transparent text-[14.5px] focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="pb-[88px] max-[620px]:pb-14">
        <div className="wrap">
          <div className="border-line mb-7 flex flex-wrap gap-2.5 border-b pt-[26px] pb-2">
            {libraryCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCat(cat)}
                className={cn(
                  "mb-4 rounded-full border px-[18px] py-[9px] text-[13.5px] font-semibold transition-all duration-[180ms]",
                  activeCat === cat
                    ? "border-ink bg-ink text-cream"
                    : "border-line bg-paper text-ink-muted hover:border-gold-deep",
                )}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-[22px] pb-5 max-[980px]:grid-cols-2 max-[620px]:grid-cols-1">
            {filtered.map((r) => (
              <LibraryCard key={r.title} resource={r} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 pt-[30px] pb-[90px]">
            {["← Prev", "1", "2", "3", "Next →"].map((label) => {
              const isArrow = label.includes("←") || label.includes("→");
              const isActive = label === "1";
              return (
                <span
                  key={label}
                  className={cn(
                    "flex h-9 items-center justify-center rounded-[9px] border text-[13.5px] font-semibold",
                    isArrow ? "w-auto px-[14px]" : "w-9",
                    isActive
                      ? "border-ink bg-ink text-cream"
                      : "border-line text-ink-muted hover:border-gold-deep",
                  )}
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
