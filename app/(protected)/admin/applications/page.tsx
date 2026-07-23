import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
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
  searchParams: Promise<{ area?: string }>;
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
  let query = supabase
    .from("community_applications")
    .select(
      "id, name, email, phone, area, role_detail, location, gender, hours_per_week, state, country, church, workforce, bible_study_rating, read_articles, message, created_at",
    )
    .order("created_at", { ascending: false });
  if (activeArea !== "all") {
    query = query.eq("area", activeArea);
  }
  const { data: applications } = await query;

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
        </div>

        <div className="max-w-[1000px] p-8 max-[780px]:p-5">
          <div className="mb-6 flex flex-wrap gap-2.5">
            <Link
              href="/admin/applications"
              className={cn(
                "rounded-full border px-[16px] py-2 text-[13px] font-semibold transition-colors",
                activeArea === "all"
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-paper text-ink-muted hover:border-gold-deep",
              )}
            >
              All
            </Link>
            {applicationAreas.map((a) => (
              <Link
                key={a}
                href={`/admin/applications?area=${a}`}
                className={cn(
                  "rounded-full border px-[16px] py-2 text-[13px] font-semibold transition-colors",
                  activeArea === a
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-paper text-ink-muted hover:border-gold-deep",
                )}
              >
                {areaLabels[a]}
              </Link>
            ))}
          </div>

          {!applications || applications.length === 0 ? (
            <p className="text-ink-muted text-[14px]">No applications yet.</p>
          ) : (
            <div className="flex flex-col gap-3.5">
              {applications.map((app) => {
                const applicantLocation = [app.state, app.country].filter(Boolean).join(", ");
                const detail = [
                  app.role_detail,
                  app.location,
                  app.gender,
                  app.hours_per_week,
                  applicantLocation,
                  app.church && `Church: ${app.church}`,
                  app.workforce && `Workforce: ${app.workforce}`,
                  app.bible_study_rating && `Bible study/prayer life: ${app.bible_study_rating}`,
                  app.read_articles && `Read our articles: ${app.read_articles}`,
                ]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <div
                    key={app.id}
                    className="border-line bg-paper rounded-[16px] border px-6 py-5"
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-display text-[16.5px] font-semibold">{app.name}</h3>
                      <span className="bg-cream text-gold-deep rounded-full px-[11px] py-[5px] text-[11px] font-bold tracking-[0.04em] uppercase">
                        {areaLabels[app.area] ?? app.area}
                      </span>
                    </div>
                    {detail && (
                      <div className="text-ink-muted mb-2 text-[13px] font-semibold">{detail}</div>
                    )}
                    <div className="text-ink-muted mb-2 flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
                      <a href={`mailto:${app.email}`} className="hover:text-ink">
                        {app.email}
                      </a>
                      {app.phone && (
                        <a href={`tel:${app.phone}`} className="hover:text-ink">
                          {app.phone}
                        </a>
                      )}
                      <span>
                        {new Date(app.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {app.message && (
                      <p className="font-reading text-ink-muted mt-2 max-w-[70ch] text-[14px] leading-[1.6]">
                        {app.message}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
