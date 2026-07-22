"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs } from "@/components/ui/Tabs";
import { ContentCard } from "@/components/cards/ContentCard";
import type { LatestTab } from "@/lib/queries/homepage-latest";
import type { LatestItem } from "@/types/content";

// Mirrors LATEST_TABS in lib/queries/homepage-latest.ts — kept as a plain
// client-side constant rather than importing it, since that module pulls in
// the server-only Supabase client (next/headers) which can't cross into a
// Client Component.
const LATEST_TABS: LatestTab[] = ["Articles", "Podcasts", "Reading Plans", "Events"];

// Where "View all" should send someone, depending on which tab they're
// looking at — each tab's full library lives on a different page.
const TAB_HREFS: Record<LatestTab, string> = {
  Articles: "/resources",
  Podcasts: "/media",
  "Reading Plans": "/reading-plans",
  Events: "/events",
};

function ArrowRight() {
  return (
    <svg className="h-[14px] w-[14px]" viewBox="0 0 14 14" fill="none">
      <path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// "Latest from OBS" homepage section — tabs actually switch between real
// latest Articles/Podcasts/Reading Plans/Events now, rather than always
// showing the same 3 hardcoded articles regardless of tab. A "View all"
// link follows whichever tab is active, so scrolling past the 3 preview
// cards always leads somewhere with the full picture, not a dead end.
export function LatestFromOBS({ itemsByTab }: { itemsByTab: Record<LatestTab, LatestItem[]> }) {
  const [tab, setTab] = useState<LatestTab>("Articles");
  const items = itemsByTab[tab];

  return (
    <>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <Tabs labels={[...LATEST_TABS]} onChange={(i) => setTab(LATEST_TABS[i])} />
        <Link
          href={TAB_HREFS[tab]}
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold whitespace-nowrap"
        >
          View all {tab} <ArrowRight />
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-ink-muted text-[14px]">Nothing published here yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-[22px] max-[980px]:grid-cols-2 max-[620px]:grid-cols-1">
          {items.map((item) => (
            <ContentCard key={item.title} item={item} />
          ))}
        </div>
      )}
    </>
  );
}
