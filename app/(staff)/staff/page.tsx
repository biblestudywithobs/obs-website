import { PortalHeader } from "@/components/staff/PortalHeader";
import { StaffButton } from "@/components/staff/StaffButton";
import { ProgressRing } from "@/components/staff/ProgressRing";
import { cn } from "@/lib/cn";
import { requireProfile } from "@/lib/auth";
import { getOnboardingOverview } from "@/lib/queries/onboarding";

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M4 10l4 4 8-8"
        stroke="#2B2420"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function StaffDashboardPage() {
  const profile = await requireProfile();
  const overview = await getOnboardingOverview(profile.id);

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <PortalHeader initials={profile.avatarInitials} />

      <div className="mx-auto w-full max-w-[920px] flex-1 px-8 pt-10 pb-[100px]">
        <div className="bg-ink text-cream mb-[30px] flex flex-wrap items-center justify-between gap-[30px] rounded-[20px] px-[38px] py-9">
          <div>
            <span className="text-gold text-[12px] font-semibold tracking-[0.08em] uppercase">
              Staff Onboarding
            </span>
            <h1 className="font-display mt-2.5 max-w-[20ch] text-[26px] font-semibold">
              Get grounded before you get started.
            </h1>
            <p className="font-reading text-cream/70 mt-2 max-w-[38ch] text-[14px]">
              Five short modules covering our mission, our doctrine, and how we work — go at your
              own pace.
            </p>
          </div>
          {overview && <ProgressRing percent={overview.overallPercent} />}
        </div>

        {!overview ? (
          <p className="text-ink-muted text-[14px]">No onboarding course is set up yet.</p>
        ) : (
          <>
            <div className="flex flex-col gap-3.5">
              {overview.modules.map((m) => {
                const ctaHref = m.firstIncompleteLessonId
                  ? `/staff/lessons/${m.firstIncompleteLessonId}`
                  : null;
                const ctaLabel =
                  m.status === "done" ? "Review" : m.status === "active" ? "Continue" : "Locked";

                return (
                  <div
                    key={m.id}
                    className={cn(
                      "border-line bg-paper flex items-center gap-[18px] rounded-[16px] border px-[22px] py-[18px]",
                      m.status === "locked" && "opacity-55",
                    )}
                  >
                    <div
                      className={cn(
                        "bg-cream font-display flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] text-[16px] font-semibold",
                        m.status === "done" && "bg-gold",
                        m.status === "locked" && "bg-line text-ink-muted",
                      )}
                    >
                      {m.status === "done" ? <CheckIcon /> : m.moduleNumber}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display text-[16.5px] font-semibold">{m.title}</h4>
                      <div className="text-ink-muted mt-[3px] text-[12.5px]">
                        {m.metaLabel}
                        {m.totalLessons > 0 && m.status === "active" && ` · in progress`}
                      </div>
                    </div>
                    <div className="w-[120px] shrink-0">
                      <div className="bg-line h-1.5 overflow-hidden rounded-full">
                        <span
                          className="bg-gold-deep block h-full rounded-full"
                          style={{ width: `${m.percent}%` }}
                        />
                      </div>
                      <div className="text-ink-muted mt-1 text-right text-[11px]">
                        {m.status === "locked" ? "Locked" : `${m.percent}%`}
                      </div>
                    </div>
                    <div className="shrink-0">
                      {ctaHref ? (
                        <StaffButton
                          href={ctaHref}
                          variant={m.status === "active" ? "gold" : "secondary"}
                        >
                          {ctaLabel}
                        </StaffButton>
                      ) : (
                        <StaffButton variant="secondary" disabled>
                          {ctaLabel}
                        </StaffButton>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-gold-deep mt-7 flex flex-wrap items-center justify-between gap-5 rounded-[16px] border-[1.5px] border-dashed px-[26px] py-6">
              <div className="flex items-center gap-3.5">
                <svg className="h-[34px] w-[34px] shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="9" r="6" stroke="#D89A2E" strokeWidth="1.5" />
                  <path
                    d="M8.5 14L7 21l5-2.5L17 21l-1.5-7"
                    stroke="#D89A2E"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <h4 className="font-display text-[16px] font-semibold">
                    Your Certificate of Completion
                  </h4>
                  <p className="text-ink-muted mt-0.5 text-[12.5px]">
                    {overview.allDone
                      ? "Unlocked — ready to view."
                      : `Unlocks automatically once all modules are complete (${overview.remainingModules} remaining).`}
                  </p>
                </div>
              </div>
              {overview.allDone ? (
                <StaffButton href="/staff/certificate/staff-onboarding" variant="secondary">
                  Preview certificate
                </StaffButton>
              ) : (
                <StaffButton variant="secondary" disabled>
                  Preview certificate
                </StaffButton>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
