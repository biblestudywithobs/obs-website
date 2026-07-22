import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Session } from "@/types/content";

// Class-session card with the hover-reactive waveform (bars turn gold and the
// play button turns gold-deep on hover — driven by the `group` modifier).
//
// Used two ways: on the homepage carousel (fixed 290px, series tag links to
// the filtered library) and on the library grid (fills its cell, tag is a
// plain badge). `className` handles the width; `tagAsLink` the badge.
export function SessionCard({
  session,
  className,
  tagAsLink = true,
}: {
  session: Session;
  className?: string;
  tagAsLink?: boolean;
}) {
  const { series, duration, title, teacher, recordedLabel, waveform, videoUrl } = session;

  const tagClasses =
    "rounded-full bg-cream px-[10px] py-1 text-[11px] font-bold uppercase tracking-[0.05em] text-gold-deep";

  return (
    <article
      className={cn(
        "group border-line bg-paper hover:border-gold-deep rounded-[16px] border px-[22px] pt-5 pb-[22px] transition-[border-color,transform] duration-200 hover:-translate-y-0.5",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        {tagAsLink ? (
          <Link href={`/sessions?series=${encodeURIComponent(series)}`} className={tagClasses}>
            {series}
          </Link>
        ) : (
          <span className={tagClasses}>{series}</span>
        )}
        <span className="text-ink-muted text-[12px] font-medium">{duration}</span>
      </div>

      <div className="mb-4 flex h-[34px] items-end gap-[3px]">
        {waveform.map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%` }}
            className="bg-line group-hover:bg-gold block w-[3px] rounded-[2px]"
          />
        ))}
      </div>

      <h4 className="font-display mb-1.5 text-[17px] leading-[1.3] font-semibold">{title}</h4>
      <div className="text-ink-muted mb-[18px] text-[12.5px]">Taught by {teacher}</div>

      <div className="flex items-center justify-between">
        <span className="text-ink-muted text-[12px]">{recordedLabel}</span>
        {videoUrl ? (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Listen to ${title}`}
            className="bg-ink group-hover:bg-gold-deep flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full transition-colors duration-200"
          >
            <svg className="ml-0.5 h-[13px] w-[13px]" viewBox="0 0 20 20" fill="none">
              <path d="M6 4l10 6-10 6z" fill="#F9ECC9" />
            </svg>
          </a>
        ) : (
          <span className="bg-ink group-hover:bg-gold-deep flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full transition-colors duration-200">
            <svg className="ml-0.5 h-[13px] w-[13px]" viewBox="0 0 20 20" fill="none">
              <path d="M6 4l10 6-10 6z" fill="#F9ECC9" />
            </svg>
          </span>
        )}
      </div>
    </article>
  );
}
