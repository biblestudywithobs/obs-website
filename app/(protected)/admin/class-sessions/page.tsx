import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SelectableList } from "@/components/admin/SelectableList";
import { requireProfile } from "@/lib/auth";
import { listClassSessions } from "@/lib/queries/admin-class-sessions";
import { bulkDeleteClassSessions } from "@/lib/actions/admin-class-sessions";
import { cn } from "@/lib/cn";

const statusLabels: Record<string, string> = {
  draft: "Draft",
  in_review: "In review",
  published: "Published",
};

export default async function AdminClassSessionsPage() {
  const profile = await requireProfile();
  const sessions = await listClassSessions();

  return (
    <div className="flex min-h-screen max-[780px]:flex-col">
      <AdminSidebar
        actualRole={profile.role}
        userName={profile.fullName}
        userInitials={profile.avatarInitials}
      />

      <main className="min-w-0 flex-1">
        <div className="border-line bg-paper sticky top-0 z-10 flex h-[72px] items-center justify-between border-b px-8 max-[780px]:px-5">
          <h1 className="font-display text-[20px] font-semibold">Class Sessions</h1>
          <Link
            href="/admin/class-sessions/new"
            className="bg-gold text-ink hover:bg-gold-deep rounded-full px-[18px] py-2.5 text-[13.5px] font-medium transition-colors"
          >
            + New
          </Link>
        </div>

        <div className="max-w-[1000px] p-8 max-[780px]:p-5">
          {sessions.length === 0 ? (
            <p className="text-ink-muted text-[14px]">No class sessions yet.</p>
          ) : (
            <SelectableList
              itemLabel="class session"
              onDeleteSelected={bulkDeleteClassSessions}
              items={sessions.map((s) => ({
                id: s.id,
                href: `/admin/class-sessions/${s.id}`,
                content: (
                  <>
                    <div className="min-w-0">
                      <h3 className="font-display truncate text-[15px] font-semibold">{s.title}</h3>
                      <div className="text-ink-muted mt-0.5 text-[12.5px]">
                        {s.series} · {s.durationLabel} ·{" "}
                        {new Date(s.recordedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-[11px] py-[5px] text-[11px] font-bold tracking-[0.04em] uppercase",
                        s.status === "published"
                          ? "bg-cream text-gold-deep"
                          : "border-line text-ink-muted border",
                      )}
                    >
                      {statusLabels[s.status]}
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
