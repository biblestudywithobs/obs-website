import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ApplicationsList } from "@/components/admin/ApplicationsList";
import { ExportCsvButton } from "@/components/admin/ExportCsvButton";
import { requireRole } from "@/lib/auth";
import { EDITOR_TIER_ROLES } from "@/types/staff";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/cn";
import { applicationAreas } from "@/lib/validation/forms";

const areaLabels: Record<string, string> = {
  volunteer: "Volunteer Opportunities",
  bible_study_partner: "Bible Study Partners",
  internship: "Internships",
  community_group: "Community Groups",
  team: "Join the OBS Team",
  partnership: "Partnerships",
};

type Area = (typeof applicationAreas)[number];

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; role?: string }>;
}) {
  // Also enforced by RLS (community_manage_staff): scholars get an empty
  // result set regardless. This just gives them a clean redirect instead.
  const profile = await requireRole(EDITOR_TIER_ROLES);
  const params = await searchParams;
  const activeArea =
    params.area && (applicationAreas as readonly string[]).includes(params.area)
      ? (params.area as Area)
      : "all";

  const supabase = await createClient();
  // Fetched unfiltered — the counts below need the full set regardless of
  // which area/role is currently selected, and this table is small enough
  // (an admin applicant list, not user-facing traffic) that filtering in
  // memory is simpler than two round trips.
  const { data } = await supabase
    .from("community_applications")
    .select(
      "id, name, email, phone, area, role_detail, location, gender, hours_per_week, state, country, church, workforce, bible_study_rating, read_articles, message, created_at",
    )
    .order("created_at", { ascending: false });

  const applications = data ?? [];

  const areaCounts = new Map<string, number>();
  for (const app of applications) {
    areaCounts.set(app.area, (areaCounts.get(app.area) ?? 0) + 1);
  }

  // Role breakdown is scoped to whichever area is active — "Volunteer"
  // and "Internship" roles are different sets, so combining across areas
  // wouldn't mean anything. Only areas whose form actually asks for a
  // role/team (a `detailField` of kind "select") ever produce this.
  const roleCounts = new Map<string, number>();
  if (activeArea !== "all") {
    for (const app of applications) {
      if (app.area !== activeArea) continue;
      const role = app.role_detail?.trim();
      if (!role) continue;
      roleCounts.set(role, (roleCounts.get(role) ?? 0) + 1);
    }
  }
  const roleBreakdown = Array.from(roleCounts.entries())
    .map(([role, count]) => ({ role, count }))
    .sort((a, b) => b.count - a.count);
  const maxRoleCount = roleBreakdown[0]?.count ?? 0;

  const activeRole =
    params.role && roleBreakdown.some((r) => r.role === params.role) ? params.role : null;

  const visible = applications.filter((app) => {
    if (activeArea !== "all" && app.area !== activeArea) return false;
    if (activeRole && app.role_detail !== activeRole) return false;
    return true;
  });

  const heroLabel = activeArea === "all" ? "Total applications" : `${areaLabels[activeArea]}`;
  const heroValue = activeArea === "all" ? applications.length : (areaCounts.get(activeArea) ?? 0);

  const exportFilename = [
    "applications",
    activeArea === "all" ? "all" : activeArea,
    activeRole?.toLowerCase().replace(/\s+/g, "-"),
  ]
    .filter(Boolean)
    .join("-")
    .concat(".csv");

  return (
    <div className="flex min-h-screen max-[780px]:flex-col">
      <AdminSidebar
        actualRole={profile.role}
        userName={profile.fullName}
        userInitials={profile.avatarInitials}
      />

      <main className="min-w-0 flex-1">
        <div className="border-line bg-paper sticky top-0 z-10 flex h-[72px] items-center justify-between border-b px-8 max-[780px]:px-5">
          <h1 className="font-display text-[20px] font-semibold">Applications</h1>
          <ExportCsvButton
            applications={visible}
            areaLabels={areaLabels}
            filename={exportFilename}
          />
        </div>

        <div className="max-w-[1000px] p-8 max-[780px]:p-5">
          {/* Hero stat — the one number this view leads with, scoped to
              whatever's currently selected. */}
          <div className="border-line bg-paper mb-7 flex items-center gap-5 rounded-[16px] border px-[22px] py-6">
            <span className="bg-cream flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px]">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 6a2 2 0 012-2h8a2 2 0 012 2v9a1 1 0 01-1.6.8L12 14H6a2 2 0 01-2-2V6z"
                  stroke="#D89A2E"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="7.5" cy="8.5" r="0.9" fill="#D89A2E" />
                <path
                  d="M10 8.5h4M10 11h3"
                  stroke="#D89A2E"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <div>
              <div className="font-display text-[32px] leading-none font-semibold">{heroValue}</div>
              <div className="text-ink-muted mt-1.5 text-[13px] font-medium">{heroLabel}</div>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2.5">
            <Link
              href="/admin/applications"
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-[16px] py-2 text-[13px] font-semibold transition-colors",
                activeArea === "all"
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-paper text-ink-muted hover:border-gold-deep",
              )}
            >
              All
              <span
                className={cn(
                  "rounded-full px-[7px] py-[1px] text-[11px] font-bold",
                  activeArea === "all" ? "bg-paper/15" : "bg-cream text-ink",
                )}
              >
                {applications.length}
              </span>
            </Link>
            {applicationAreas.map((a) => (
              <Link
                key={a}
                href={`/admin/applications?area=${a}`}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-[16px] py-2 text-[13px] font-semibold transition-colors",
                  activeArea === a
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-paper text-ink-muted hover:border-gold-deep",
                )}
              >
                {areaLabels[a]}
                <span
                  className={cn(
                    "rounded-full px-[7px] py-[1px] text-[11px] font-bold",
                    activeArea === a ? "bg-paper/15" : "bg-cream text-ink",
                  )}
                >
                  {areaCounts.get(a) ?? 0}
                </span>
              </Link>
            ))}
          </div>

          {/* Role breakdown — only appears once an area with real role/team
              data is selected, and doubles as the role filter. */}
          {roleBreakdown.length > 0 && (
            <div className="border-line bg-paper mb-6 rounded-[16px] border px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-[15px] font-semibold">
                  {areaLabels[activeArea]} by role
                </h3>
                {activeRole && (
                  <Link
                    href={`/admin/applications?area=${activeArea}`}
                    className="text-gold-deep text-[12.5px] font-semibold"
                  >
                    Clear role filter
                  </Link>
                )}
              </div>
              <div className="flex flex-col gap-[9px]">
                {roleBreakdown.map(({ role, count }) => (
                  <Link
                    key={role}
                    href={
                      activeRole === role
                        ? `/admin/applications?area=${activeArea}`
                        : `/admin/applications?area=${activeArea}&role=${encodeURIComponent(role)}`
                    }
                    className="group flex items-center gap-3 py-1 text-[13px]"
                  >
                    <span
                      className={cn(
                        "w-[170px] shrink-0 truncate font-medium transition-colors",
                        activeRole === role ? "text-ink" : "text-ink-muted group-hover:text-ink",
                      )}
                    >
                      {role}
                    </span>
                    <div className="bg-line h-2 flex-1 overflow-hidden rounded-full">
                      <span
                        className={cn(
                          "block h-full rounded-full transition-colors",
                          activeRole === role ? "bg-gold-deep" : "bg-gold",
                        )}
                        style={{ width: `${(count / maxRoleCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-ink-muted w-[26px] shrink-0 text-right font-semibold">
                      {count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {visible.length === 0 ? (
            <p className="text-ink-muted text-[14px]">No applications yet.</p>
          ) : (
            <ApplicationsList applications={visible} areaLabels={areaLabels} />
          )}
        </div>
      </main>
    </div>
  );
}
