import Link from "next/link";
import { ShareButton } from "@/components/ui/ShareButton";
import { CommentaryDayViewer } from "@/components/sections/CommentaryDayViewer";
import type { ReadingPlanArticle } from "@/lib/queries/public-reading-plans";

// The actual reading-plan/commentary page body — hero, cover image, and
// content. Shared by the live /reading-plans/[slug] page and the
// /reading-plans/preview/[token] draft route so a preview never drifts from
// what the page will look like once published.
export function ReadingPlanDetailView({ plan }: { plan: ReadingPlanArticle }) {
  return (
    <div className="wrap">
      <div className="mx-auto max-w-[760px] px-0 pt-2 pb-[34px] text-center">
        <span className="bg-cream text-gold-deep inline-block rounded-full px-[14px] py-1.5 text-[11.5px] font-bold tracking-[0.06em] uppercase">
          {plan.category}
        </span>
        <h1 className="font-display my-5 text-[clamp(30px,4.6vw,48px)] leading-[1.12] font-semibold tracking-[-0.01em]">
          {plan.title}
        </h1>
        <div className="text-ink-muted flex items-center justify-center gap-2.5 text-[13.5px]">
          <span>{plan.duration}</span>
          <span className="bg-ink-muted h-[3px] w-[3px] rounded-full" />
          <span>{plan.updated}</span>
        </div>
        {plan.excerpt && (
          <p className="font-reading text-ink-muted mx-auto mt-5 max-w-[56ch] text-[16px] leading-[1.6]">
            {plan.excerpt}
          </p>
        )}
      </div>

      {plan.imageUrl && (
        <div className="relative mx-auto aspect-[21/9] max-w-[960px] overflow-hidden rounded-[20px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={plan.imageUrl} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mx-auto max-w-[700px] pt-14 max-[620px]:pt-10">
        {plan.planType === "commentary" ? (
          <CommentaryDayViewer days={plan.days} />
        ) : plan.bodyHtml ? (
          <div
            className="prose-editor font-reading text-ink-muted text-[17px] leading-[1.85] max-[620px]:text-[16px]"
            dangerouslySetInnerHTML={{ __html: plan.bodyHtml }}
          />
        ) : (
          <p className="text-ink-muted font-reading text-[15px] italic">
            This plan&apos;s full content is coming soon.
          </p>
        )}

        <div className="border-line mt-[46px] flex flex-wrap items-center justify-between gap-4 border-t pt-[26px]">
          <Link
            href="/reading-plans"
            className="text-ink hover:text-gold-deep text-[13.5px] font-semibold"
          >
            ← All reading plans
          </Link>
          <ShareButton className="h-9 w-9" />
        </div>
      </div>
    </div>
  );
}
