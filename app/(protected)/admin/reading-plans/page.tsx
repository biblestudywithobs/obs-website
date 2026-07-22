import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SelectableList } from "@/components/admin/SelectableList";
import { requireProfile } from "@/lib/auth";
import { listReadingPlans } from "@/lib/queries/admin-reading-plans";
import { bulkDeleteReadingPlans } from "@/lib/actions/admin-reading-plans";
import { cn } from "@/lib/cn";

const statusLabels: Record<string, string> = {
  draft: "Draft",
  in_review: "In review",
  published: "Published",
};

export default async function AdminReadingPlansPage() {
  const profile = await requireProfile();
  const plans = await listReadingPlans();

  return (
    <div className="flex min-h-screen max-[780px]:flex-col">
      <AdminSidebar
        actualRole={profile.role}
        userName={profile.fullName}
        userInitials={profile.avatarInitials}
      />

      <main className="min-w-0 flex-1">
        <div className="border-line bg-paper sticky top-0 z-10 flex h-[72px] items-center justify-between border-b px-8 max-[780px]:px-5">
          <h1 className="font-display text-[20px] font-semibold">Reading Plans</h1>
          <Link
            href="/admin/reading-plans/new"
            className="bg-gold text-ink hover:bg-gold-deep rounded-full px-[18px] py-2.5 text-[13.5px] font-medium transition-colors"
          >
            + New
          </Link>
        </div>

        <div className="max-w-[1000px] p-8 max-[780px]:p-5">
          {plans.length === 0 ? (
            <p className="text-ink-muted text-[14px]">No reading plans yet.</p>
          ) : (
            <SelectableList
              itemLabel="reading plan"
              onDeleteSelected={bulkDeleteReadingPlans}
              items={plans.map((p) => ({
                id: p.id,
                href: `/admin/reading-plans/${p.id}`,
                content: (
                  <>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display truncate text-[15px] font-semibold">
                          {p.title}
                        </h3>
                        {p.featured && (
                          <span className="bg-gold shrink-0 rounded-full px-2 py-[2px] text-[10px] font-bold uppercase">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="text-ink-muted mt-0.5 text-[12.5px]">
                        {p.category} · {p.durationDays} days
                      </div>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-[11px] py-[5px] text-[11px] font-bold tracking-[0.04em] uppercase",
                        p.status === "published"
                          ? "bg-cream text-gold-deep"
                          : "border-line text-ink-muted border",
                      )}
                    >
                      {statusLabels[p.status]}
                    </span>
                  </>
                ),
              }))}
            />
          )}
        </div>
      </main>
    </div>
  );
}
