import Link from "next/link";
import { cn } from "@/lib/cn";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireProfile } from "@/lib/auth";
import { getAnalyticsOverview } from "@/lib/queries/admin-analytics";

const RANGES = ["all", "monthly"] as const;
type Range = (typeof RANGES)[number];
const rangeLabels: Record<Range, string> = { all: "All time", monthly: "Monthly" };

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const profile = await requireProfile();
  const params = await searchParams;
  const range: Range = params.range === "monthly" ? "monthly" : "all";
  const data = await getAnalyticsOverview();

  const maxMonthly = Math.max(1, ...data.monthlyCounts.map((m) => m.views));
  const maxPageViews = Math.max(1, ...data.topPages.map((p) => p.views));

  return (
    <div className="flex min-h-screen max-[780px]:flex-col">
      <AdminSidebar
        actualRole={profile.role}
        userName={profile.fullName}
        userInitials={profile.avatarInitials}
      />

      <main className="min-w-0 flex-1">
        <div className="border-line bg-paper sticky top-0 z-10 flex h-[72px] items-center justify-between border-b px-8 max-[780px]:px-5">
          <h1 className="font-display text-[20px] font-semibold">Analytics</h1>
        </div>

        <div className="max-w-[1000px] p-8 max-[780px]:p-5">
          {!data.available ? (
            <div className="border-line bg-paper rounded-[16px] border px-6 py-8 text-center">
              <h3 className="font-display mb-2 text-[17px] font-semibold">No analytics data yet</h3>
              <p className="text-ink-muted text-[13.5px]">
                Either PostHog credentials aren&apos;t configured, or there hasn&apos;t been any
                real traffic captured yet. Pageview tracking is live across the site — check back
                once visitors start arriving.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-[30px] grid grid-cols-2 gap-[18px] max-[780px]:grid-cols-1">
                <div className="border-line bg-paper rounded-[16px] border px-[22px] py-5">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-muted text-[12.5px] font-medium">
                      Pageviews (last 30 days)
                    </span>
                    {data.trend && (
                      <span
                        className={cn(
                          "flex items-center gap-[3px] text-[12px] font-bold",
                          data.trend.direction === "up" ? "text-positive" : "text-negative",
                        )}
                      >
                        {data.trend.direction === "up" ? "▲" : "▼"} {data.trend.percent}%
                      </span>
                    )}
                  </div>
                  <div className="font-display mt-3 text-[32px] font-semibold">
                    {data.totalPageviews.toLocaleString()}
                  </div>
                </div>
                <div className="border-line bg-paper rounded-[16px] border px-[22px] py-5">
                  <span className="text-ink-muted text-[12.5px] font-medium">
                    Unique visitors (last 30 days)
                  </span>
                  <div className="font-display mt-3 text-[32px] font-semibold">
                    {data.uniqueVisitors.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[1.3fr_1fr] gap-5 max-[900px]:grid-cols-1">
                <div className="border-line bg-paper rounded-[16px] border px-6 py-[22px]">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-[16px] font-semibold">Pageviews</h3>
                    <div className="bg-cream inline-flex rounded-full p-1">
                      {RANGES.map((r) => (
                        <Link
                          key={r}
                          href={r === "all" ? "/admin/analytics" : `/admin/analytics?range=${r}`}
                          className={cn(
                            "font-ui rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-colors",
                            range === r ? "bg-gold text-ink" : "text-ink-muted hover:text-ink",
                          )}
                        >
                          {rangeLabels[r]}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {range === "all" ? (
                    <div>
                      <div className="font-display text-[40px] font-semibold">
                        {data.allTimePageviews.toLocaleString()}
                      </div>
                      <p className="text-ink-muted mt-1.5 text-[12.5px] font-medium">
                        Total pageviews all time
                      </p>
                    </div>
                  ) : data.monthlyCounts.length === 0 ? (
                    <p className="text-ink-muted text-[13px]">Not enough data yet.</p>
                  ) : (
                    <div className="flex h-[170px] items-end gap-2.5">
                      {data.monthlyCounts.map((m) => (
                        <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
                          <span className="text-ink text-[11.5px] font-bold">
                            {m.views.toLocaleString()}
                          </span>
                          <div
                            className="bg-gold w-full rounded-[3px]"
                            style={{ height: `${Math.max(4, (m.views / maxMonthly) * 120)}px` }}
                            title={`${m.month}: ${m.views}`}
                          />
                          <span className="text-ink-muted text-[9.5px]">
                            {new Date(m.month).toLocaleDateString("en-US", { month: "short" })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-line bg-paper rounded-[16px] border px-6 py-[22px]">
                  <h3 className="font-display mb-4 text-[16px] font-semibold">Top pages</h3>
                  {data.topPages.length === 0 ? (
                    <p className="text-ink-muted text-[13px]">Not enough data yet.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {data.topPages.map((p) => (
                        <div key={p.path}>
                          <div className="mb-1 flex items-center justify-between text-[12.5px]">
                            <span className="truncate font-medium">{p.path}</span>
                            <span className="text-ink-muted shrink-0 pl-2">{p.views}</span>
                          </div>
                          <div className="bg-line h-1.5 overflow-hidden rounded-full">
                            <span
                              className="bg-gold-deep block h-full rounded-full"
                              style={{ width: `${(p.views / maxPageViews) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
