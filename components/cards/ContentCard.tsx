import Link from "next/link";
import Image from "next/image";
import type { LatestItem } from "@/types/content";

// Compact "Latest from OBS" card: thumbnail tile + title + meta line. Podcast
// items show their real cover art; everything else (Articles/Reading
// Plans/Events don't have a thumbnail image of their own) shows the OBS
// logo instead of a generic placeholder icon.
export function ContentCard({ item }: { item: LatestItem }) {
  return (
    <Link
      href={item.href}
      className="border-line bg-paper hover:border-gold-deep flex gap-4 rounded-[16px] border p-[18px] transition-[border-color,transform] duration-200 hover:-translate-y-0.5"
    >
      <div className="bg-cream relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[10px]">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <Image
            src="/logo.jpg"
            alt=""
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div>
        <h4 className="font-display mb-1.5 text-[16px] leading-[1.3] font-semibold">
          {item.title}
        </h4>
        <p className="text-ink-muted text-[12.5px]">{item.meta}</p>
      </div>
    </Link>
  );
}
