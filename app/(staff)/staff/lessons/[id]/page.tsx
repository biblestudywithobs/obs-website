import { notFound } from "next/navigation";
import { PortalHeader } from "@/components/staff/PortalHeader";
import { BackLink } from "@/components/staff/BackLink";
import { StaffButton } from "@/components/staff/StaffButton";
import { cn } from "@/lib/cn";
import { requireProfile } from "@/lib/auth";
import { getLessonForUser } from "@/lib/queries/onboarding";
import { markLessonComplete } from "@/lib/actions/onboarding";

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
      <path
        d="M4 10l4 4 8-8"
        stroke="var(--color-paper)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await requireProfile();
  const lesson = await getLessonForUser(id, profile.id);
  if (!lesson) notFound();

  const markComplete = markLessonComplete.bind(null, lesson.id);

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <PortalHeader initials={profile.avatarInitials} />

      <div className="flex flex-1">
        <aside className="border-line w-[280px] shrink-0 overflow-y-auto border-r px-5 py-[26px] max-[900px]:hidden">
          <div className="mb-[22px]">
            <BackLink href="/staff">Back to modules</BackLink>
          </div>
          <h3 className="font-display mb-3.5 text-[16px] font-semibold">
            {lesson.moduleNumber}. {lesson.moduleTitle}
          </h3>
          {lesson.nav.map((item) => (
            <div
              key={item.id}
              className={cn(
                "text-ink-muted mb-0.5 flex items-center gap-2.5 rounded-[9px] px-2.5 py-2.5 text-[13.5px] font-medium",
                item.status === "current" && "bg-cream text-ink font-semibold",
              )}
            >
              <span
                className={cn(
                  "border-line flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px]",
                  item.status === "done" && "border-gold-deep bg-gold-deep",
                )}
              >
                {item.status === "done" && <CheckIcon />}
              </span>
              {item.label}
            </div>
          ))}
        </aside>

        <div className="max-w-[760px] flex-1 px-12 py-10 max-[900px]:px-[22px] max-[900px]:py-7">
          <span className="text-gold-deep text-[12px] font-semibold tracking-[0.07em] uppercase">
            Module {lesson.moduleNumber} · Lesson {lesson.lessonNumber} of {lesson.lessonCount}
          </span>
          <h1 className="font-display mt-2.5 text-[30px] font-semibold">{lesson.title}</h1>

          <div className="bg-ink mt-6 flex aspect-video items-center justify-center rounded-[16px]">
            <div className="bg-gold flex h-16 w-16 items-center justify-center rounded-full">
              <svg className="ml-[3px] h-[22px] w-[22px]" viewBox="0 0 20 20" fill="none">
                <path d="M6 4l10 6-10 6z" fill="#2B2420" />
              </svg>
            </div>
          </div>

          <div className="font-reading text-ink-muted mt-[26px] max-w-[64ch] text-[15.5px] leading-[1.75]">
            {lesson.body.length > 0 ? (
              lesson.body.map((block, i) => (
                <p key={i} className="mb-4">
                  {block.text}
                </p>
              ))
            ) : (
              <p className="mb-4 italic">Lesson content coming soon.</p>
            )}
          </div>

          <div className="border-line mt-9 flex items-center justify-between border-t pt-6">
            {lesson.previousLessonId ? (
              <StaffButton href={`/staff/lessons/${lesson.previousLessonId}`} variant="secondary">
                Previous lesson
              </StaffButton>
            ) : (
              <StaffButton variant="secondary" disabled>
                Previous lesson
              </StaffButton>
            )}
            <form action={markComplete}>
              <StaffButton type="submit">Mark complete &amp; continue</StaffButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
