import Link from "next/link";
import { cn } from "@/lib/cn";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireProfile } from "@/lib/auth";
import { staffRoleLabels } from "@/types/staff";
import {
  getOverviewMetrics,
  getRecentActivity,
  getContentStatusBreakdown,
  getNeedsAttention,
} from "@/lib/queries/admin-overview";

export default async function AdminOverviewPage() {
  const profile = await requireProfile();
  const [metrics, activity, statusBreakdown, needsAttention] = await Promise.all([
    getOverviewMetrics(),
    getRecentActivity(),
    getContentStatusBreakdown(),
    getNeedsAttention(),
  ]);

  return (
    <div className="flex min-h-screen max-[780px]:flex-col">
      <AdminSidebar
        actualRole={profile.role}
        userName={profile.fullName}
        userInitials={profile.avatarInitials}
      />

      <main className="min-w-0 flex-1">
        <div className="border-line bg-paper sticky top-0 z-10 flex h-[72px] items-center justify-between border-b px-8 max-[780px]:px-5">
          <h1 className="font-display text-[20px] font-semibold">Overview</h1>
          <div className="flex items-center gap-3.5">
            <div className="bg-cream flex w-60 items-center gap-2 rounded-full px-3.5 py-2 max-[780px]:hidden">
              <svg
                className="h-[15px] w-[15px] shrink-0 opacity-60"
                viewBox="0 0 20 20"
                fill="none"
              >
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
                placeholder="Search content, users..."
                className="font-ui w-full bg-transparent text-[13.5px] focus:outline-none"
              />
            </div>
            <button
              type="button"
              aria-label="Notifications"
              className="border-line relative flex h-[38px] w-[38px] items-center justify-center rounded-full border"
            >
              <svg className="h-[17px] w-[17px]" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 8a5 5 0 0110 0c0 4 1.5 5 1.5 5h-13S5 12 5 8z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="M8 15.5a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span className="bg-gold-deep absolute top-2 right-[9px] h-1.5 w-1.5 rounded-full" />
            </button>
          </div>
        </div>

        <div className="max-w-[1200px] p-8 max-[780px]:p-5">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="font-display text-[27px] font-semibold">
                Welcome back, {profile.fullName.split(" ")[0]}
              </h2>
              <p className="text-ink-muted mt-[5px] text-[14px]">
                Here&apos;s what&apos;s happening across OBS today.
              </p>
            </div>
            <span className="border-line bg-cream inline-flex items-center gap-1.5 rounded-full border px-[13px] py-1.5 text-[12.5px] font-semibold">
              <span className="bg-gold-deep h-1.5 w-1.5 rounded-full" />
              {staffRoleLabels[profile.role]} access
            </span>
          </div>

          <div className="mb-[30px] grid grid-cols-4 gap-[18px] max-[1080px]:grid-cols-2 max-[780px]:grid-cols-1">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="border-line bg-paper rounded-[16px] border px-[22px] py-5"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-cream flex h-[34px] w-[34px] items-center justify-center rounded-[9px]">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                      {m.icon}
                    </svg>
                  </span>
                  {m.trend && (
                    <span
                      className={cn(
                        "flex items-center gap-[3px] text-[12px] font-bold",
                        m.trend.direction === "up" ? "text-positive" : "text-negative",
                      )}
                    >
                      {m.trend.direction === "up" ? "▲" : "▼"} {m.trend.value}
                    </span>
                  )}
                </div>
                <div className="font-display mt-4 text-[30px] font-semibold">{m.value}</div>
                <div className="text-ink-muted mt-1 text-[12.5px] font-medium">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[1.5fr_1fr] items-start gap-5 max-[1080px]:grid-cols-1">
            <div className="border-line bg-paper rounded-[16px] border px-6 py-[22px]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-[17px] font-semibold">Recent activity</h3>
                <Link
                  href="/admin/applications"
                  className="text-gold-deep text-[12.5px] font-semibold"
                >
                  View all
                </Link>
              </div>
              {activity.length === 0 ? (
                <p className="text-ink-muted text-[13.5px]">Nothing yet.</p>
              ) : (
                activity.map((item, i) => (
                  <div
                    key={i}
                    className={cn(
                      "border-line border-b py-3",
                      i === activity.length - 1 && "border-none pb-0",
                    )}
                  >
                    <p className="text-[13.5px] leading-[1.45]">{item.html}</p>
                    <div className="text-ink-muted mt-0.5 text-[12px]">{item.meta}</div>
                  </div>
                ))
              )}

              <div className="mt-5">
                <h3 className="font-display mb-2 text-[15px] font-semibold">Content by status</h3>
                {statusBreakdown.map((s) => (
                  <div key={s.label} className="flex items-center gap-3 py-[9px] text-[13px]">
                    <span className="w-[110px] shrink-0 font-medium">{s.label}</span>
                    <div className="bg-line h-2 flex-1 overflow-hidden rounded-full">
                      <span
                        className="bg-gold block h-full rounded-full"
                        style={{ width: `${s.percent}%` }}
                      />
                    </div>
                    <span className="text-ink-muted w-[34px] shrink-0 text-right font-semibold">
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-line bg-paper rounded-[16px] border px-6 py-[22px]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-[17px] font-semibold">Needs attention</h3>
                <Link
                  href="/admin/applications"
                  className="text-gold-deep text-[12.5px] font-semibold"
                >
                  View all
                </Link>
              </div>
              {needsAttention.length === 0 ? (
                <p className="text-ink-muted text-[13.5px]">Nothing waiting on review — nice.</p>
              ) : (
                needsAttention.map((t, i) => (
                  <div
                    key={t.title}
                    className={cn(
                      "border-line flex items-center gap-2.5 border-b py-2.5",
                      i === needsAttention.length - 1 && "border-none pb-0",
                    )}
                  >
                    <div>
                      <div className="text-[13.5px] font-medium">{t.title}</div>
                      <div className="text-ink-muted mt-0.5 text-[11.5px]">{t.meta}</div>
                    </div>
                    <span className="bg-cream ml-auto rounded-full px-2 py-[3px] text-[10.5px] font-bold tracking-[0.04em] whitespace-nowrap uppercase">
                      {t.tag}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
