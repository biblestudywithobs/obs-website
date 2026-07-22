import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SelectableList } from "@/components/admin/SelectableList";
import { requireRole } from "@/lib/auth";
import { EDITOR_TIER_ROLES } from "@/types/staff";
import { listEvents } from "@/lib/queries/admin-events";
import { bulkDeleteEvents } from "@/lib/actions/admin-events";
import { cn } from "@/lib/cn";

const statusLabels: Record<string, string> = {
  draft: "Draft",
  in_review: "In review",
  published: "Published",
};

export default async function AdminEventsPage() {
  // Matches the events_write RLS scope (admin, editor).
  const profile = await requireRole(EDITOR_TIER_ROLES);
  const events = await listEvents();

  return (
    <div className="flex min-h-screen max-[780px]:flex-col">
      <AdminSidebar
        actualRole={profile.role}
        userName={profile.fullName}
        userInitials={profile.avatarInitials}
      />

      <main className="min-w-0 flex-1">
        <div className="border-line bg-paper sticky top-0 z-10 flex h-[72px] items-center justify-between border-b px-8 max-[780px]:px-5">
          <h1 className="font-display text-[20px] font-semibold">Events</h1>
          <Link
            href="/admin/events/new"
            className="bg-gold text-ink hover:bg-gold-deep rounded-full px-[18px] py-2.5 text-[13.5px] font-medium transition-colors"
          >
            + New
          </Link>
        </div>

        <div className="max-w-[1000px] p-8 max-[780px]:p-5">
          {events.length === 0 ? (
            <p className="text-ink-muted text-[14px]">No events yet.</p>
          ) : (
            <SelectableList
              itemLabel="event"
              onDeleteSelected={bulkDeleteEvents}
              items={events.map((e) => ({
                id: e.id,
                href: `/admin/events/${e.id}`,
                content: (
                  <>
                    <div className="min-w-0">
                      <h3 className="font-display truncate text-[15px] font-semibold">{e.title}</h3>
                      <div className="text-ink-muted mt-0.5 text-[12.5px]">
                        {new Date(e.startsAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}{" "}
                        · {e.location}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-[11px] py-[5px] text-[11px] font-bold tracking-[0.04em] uppercase",
                        e.status === "published"
                          ? "bg-cream text-gold-deep"
                          : "border-line text-ink-muted border",
                      )}
                    >
                      {statusLabels[e.status]}
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
