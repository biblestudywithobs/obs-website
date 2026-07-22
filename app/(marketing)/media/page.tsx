import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { listMediaItems } from "@/lib/queries/public-media";
import { MediaView } from "./MediaView";

export const metadata: Metadata = {
  title: "Podcast & Media — Open Bible School",
  description:
    "Sermons, teaching series, and the OBS Studio Podcast — everything we've recorded, in one place.",
};

export default async function MediaPage() {
  const items = await listMediaItems();

  return (
    <>
      <main className="flex-1">
        <section className="pt-16 pb-[34px]">
          <div className="wrap">
            <Eyebrow sparkle={false}>OBS Studio Podcast</Eyebrow>
            <h1 className="font-display mt-[14px] text-[clamp(32px,4vw,46px)] font-semibold tracking-[-0.01em]">
              Podcast &amp; Media
            </h1>
            <p className="font-reading text-ink-muted mt-3 max-w-[58ch] text-[16px] leading-[1.6]">
              Sermons, teaching series, and the OBS Studio Podcast — everything we&apos;ve recorded,
              all in one place, straight from Spotify and Substack.
            </p>

            <MediaView items={items} />
          </div>
        </section>
      </main>
      <MinimalFooter />
    </>
  );
}
