import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Resource } from "@/types/content";

// Faint page-lines motif shown behind the feature card's thumbnail.
function PageLines() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-50"
      viewBox="0 0 300 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g stroke="#2B2420" strokeWidth="1.5" opacity="0.25">
        <line x1="30" y1="40" x2="220" y2="30" />
        <line x1="30" y1="60" x2="230" y2="52" />
        <line x1="30" y1="80" x2="210" y2="74" />
        <line x1="30" y1="100" x2="225" y2="96" />
      </g>
    </svg>
  );
}

export function ResourceCard({ resource }: { resource: Resource }) {
  const { slug, title, excerpt, tag, meta, feature } = resource;

  return (
    <article
      className={cn(
        "border-line bg-cream hover:shadow-card-hover flex flex-col overflow-hidden rounded-[18px] border transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-1",
        feature && "row-span-2 max-[980px]:col-span-2 max-[980px]:row-span-1",
      )}
    >
      <div
        className={cn(
          "relative flex items-end bg-[linear-gradient(180deg,transparent_55%,rgba(26,26,26,0.35)_100%),var(--color-gold)] p-[18px]",
          feature ? "aspect-[16/13]" : "aspect-[16/11]",
        )}
      >
        {feature && <PageLines />}
        <span className="bg-paper text-ink relative rounded-full px-[11px] py-[5px] text-[11.5px] font-bold tracking-[0.06em] uppercase">
          {tag}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-[10px] px-6 pt-[22px] pb-[26px]">
        <h3
          className={cn(
            "font-display leading-[1.28] font-semibold",
            feature ? "text-[26px]" : "text-[20px]",
          )}
        >
          {title}
        </h3>
        <p className="font-reading text-ink-muted flex-1 text-[14.5px] leading-[1.55]">{excerpt}</p>
        <div className="text-ink-muted mt-[6px] flex items-center justify-between text-[12.5px]">
          <span>{meta}</span>
          <Link
            href={`/articles/${slug}`}
            className="text-ink flex items-center gap-[5px] font-semibold"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
