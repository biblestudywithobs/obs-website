"use client";

import { useMemo, useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import type { MediaItem } from "@/lib/queries/public-media";

const FILTERS = ["All", "Spotify", "Substack"] as const;

function directHref(item: MediaItem): string | null {
  if (item.source === "spotify") return item.spotifyUrl;
  if (item.source === "substack") return item.substackUrl;
  return null; // "both" — the chooser decides
}

function Thumbnail({ item }: { item: MediaItem }) {
  return (
    <>
      {item.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <span className="bg-ink relative flex h-[44px] w-[44px] items-center justify-center rounded-full">
        <svg className="ml-0.5 h-[14px] w-[14px]" viewBox="0 0 20 20" fill="none">
          <path d="M6 4l10 6-10 6z" fill="#F9ECC9" />
        </svg>
      </span>
    </>
  );
}

export function MediaView({ items }: { items: MediaItem[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [choosing, setChoosing] = useState<MediaItem | null>(null);

  const filtered = useMemo(() => {
    if (filter === "All") return items;
    if (filter === "Spotify")
      return items.filter((i) => i.source === "spotify" || i.source === "both");
    return items.filter((i) => i.source === "substack" || i.source === "both");
  }, [items, filter]);

  const nowPlaying = filtered[0];

  return (
    <>
      {/* Now playing — links straight to the real episode, or opens the
          Spotify/Substack chooser when it's on both. There's no in-page
          player since the audio itself lives on those platforms. */}
      {nowPlaying &&
        (() => {
          const href = directHref(nowPlaying);
          const Wrapper = href ? "a" : "button";
          return (
            <Wrapper
              {...(href
                ? { href, target: "_blank", rel: "noopener noreferrer" }
                : { type: "button", onClick: () => setChoosing(nowPlaying) })}
              className="bg-ink text-cream mt-[34px] flex w-full flex-wrap items-center gap-6 rounded-[22px] px-8 py-7 text-left transition-opacity hover:opacity-90 max-[620px]:p-[22px]"
            >
              <div className="bg-gold relative flex h-[78px] w-[78px] shrink-0 items-center justify-center overflow-hidden rounded-[12px]">
                {nowPlaying.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={nowPlaying.imageUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <svg width="26" height="26" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="7" stroke="#2B2420" strokeWidth="1.4" />
                    <path d="M8 7l5 3-5 3z" fill="#2B2420" />
                  </svg>
                )}
              </div>
              <div className="min-w-[200px] flex-1">
                <div className="text-gold text-[11px] font-bold tracking-[0.06em] uppercase">
                  Latest ·{" "}
                  {nowPlaying.source === "both"
                    ? "Spotify & Substack"
                    : nowPlaying.source === "spotify"
                      ? "Spotify"
                      : "Substack"}
                </div>
                <h4 className="font-display mt-1 text-[18px] font-semibold">{nowPlaying.title}</h4>
                {nowPlaying.subtitle && (
                  <div className="text-cream/60 mt-[3px] text-[12.5px]">{nowPlaying.subtitle}</div>
                )}
              </div>
              {nowPlaying.duration && (
                <span className="bg-cream/10 text-cream shrink-0 rounded-[8px] px-3 py-1.5 text-[12.5px] font-semibold">
                  {nowPlaying.duration}
                </span>
              )}
            </Wrapper>
          );
        })()}

      <Tabs
        labels={[...FILTERS]}
        onChange={(i) => setFilter(FILTERS[i])}
        className="mt-[34px] mb-10"
      />

      {filtered.length === 0 ? (
        <p className="text-ink-muted pb-[90px] text-[14px]">Nothing here yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-[22px] pb-[90px] max-[980px]:grid-cols-2 max-[620px]:grid-cols-1">
          {filtered.map((item) => {
            const href = directHref(item);
            const Wrapper = href ? "a" : "button";
            return (
              <Wrapper
                key={item.title + item.publishedAt}
                {...(href
                  ? { href, target: "_blank", rel: "noopener noreferrer" }
                  : { type: "button", onClick: () => setChoosing(item) })}
                className="border-line bg-paper hover:shadow-card-hover overflow-hidden rounded-[16px] border text-left transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px]"
              >
                <div className="bg-cream relative flex aspect-[16/10] items-center justify-center">
                  <Thumbnail item={item} />
                  <span className="text-cream absolute top-3 left-3 rounded-[6px] bg-[rgba(26,26,26,0.75)] px-2 py-[3px] text-[11px] font-semibold">
                    {item.source === "both"
                      ? "Spotify & Substack"
                      : item.source === "spotify"
                        ? "Spotify"
                        : "Substack"}
                  </span>
                  {item.duration && (
                    <span className="text-cream absolute right-3 bottom-3 rounded-[6px] bg-[rgba(26,26,26,0.75)] px-2 py-[3px] text-[11px] font-semibold">
                      {item.duration}
                    </span>
                  )}
                </div>
                <div className="px-5 pt-[18px] pb-5">
                  <h4 className="font-display mb-1.5 text-[16px] leading-[1.3] font-semibold">
                    {item.title}
                  </h4>
                  {item.subtitle && <p className="text-ink-muted text-[12.5px]">{item.subtitle}</p>}
                </div>
              </Wrapper>
            );
          })}
        </div>
      )}

      {/* Spotify/Substack chooser for episodes published on both */}
      {choosing && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-[rgba(26,26,26,0.45)] p-6"
          onClick={() => setChoosing(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="border-line bg-paper w-full max-w-[380px] rounded-[18px] border p-7"
          >
            <h4 className="font-display mb-1.5 text-[18px] leading-[1.3] font-semibold">
              {choosing.title}
            </h4>
            <p className="text-ink-muted mb-6 text-[13px]">Where would you like to listen?</p>
            <div className="flex flex-col gap-2.5">
              <a
                href={choosing.spotifyUrl!}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setChoosing(null)}
                className="bg-gold text-ink hover:bg-gold-deep rounded-full px-5 py-3 text-center text-[14px] font-semibold transition-colors"
              >
                Listen on Spotify
              </a>
              <a
                href={choosing.substackUrl!}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setChoosing(null)}
                className="border-line text-ink hover:border-gold-deep rounded-full border px-5 py-3 text-center text-[14px] font-semibold transition-colors"
              >
                Listen on Substack
              </a>
            </div>
            <button
              type="button"
              onClick={() => setChoosing(null)}
              className="text-ink-muted hover:text-ink mt-5 w-full text-center text-[12.5px] font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
