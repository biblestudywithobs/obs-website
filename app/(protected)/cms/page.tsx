import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SelectableList } from "@/components/admin/SelectableList";
import { requireProfile } from "@/lib/auth";
import { listResources } from "@/lib/queries/admin-resources";
import { bulkDeleteResources } from "@/lib/actions/admin-resources";
import { cn } from "@/lib/cn";

const CATEGORIES = ["Articles", "Bible Studies", "Manuals", "Devotionals", "Downloads"] as const;
const statusLabels: Record<string, string> = {
  draft: "Draft",
  in_review: "In review",
  published: "Published",
};

export default async function CmsListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const profile = await requireProfile();
  const params = await searchParams;
  const activeCategory =
    params.category && (CATEGORIES as readonly string[]).includes(params.category)
      ? params.category
      : "all";

  const resources = await listResources(activeCategory === "all" ? undefined : activeCategory);

  return (
    <div className="flex min-h-screen max-[780px]:flex-col">
      <AdminSidebar
        actualRole={profile.role}
        userName={profile.fullName}
        userInitials={profile.avatarInitials}
      />

      <main className="min-w-0 flex-1">
        <div className="border-line bg-paper sticky top-0 z-10 flex h-[72px] items-center justify-between border-b px-8 max-[780px]:px-5">
          <h1 className="font-display text-[20px] font-semibold">Content</h1>
          <Link
            href="/cms/new"
            className="bg-gold text-ink hover:bg-gold-deep rounded-full px-[18px] py-2.5 text-[13.5px] font-medium transition-colors"
          >
            + New
          </Link>
        </div>

        <div className="max-w-[1000px] p-8 max-[780px]:p-5">
          <div className="mb-6 flex flex-wrap gap-2.5">
            <Link
              href="/cms"
              className={cn(
                "rounded-full border px-[16px] py-2 text-[13px] font-semibold transition-colors",
                activeCategory === "all"
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-paper text-ink-muted hover:border-gold-deep",
              )}
            >
              All
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/cms?category=${encodeURIComponent(c)}`}
                className={cn(
                  "rounded-full border px-[16px] py-2 text-[13px] font-semibold transition-colors",
                  activeCategory === c
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-paper text-ink-muted hover:border-gold-deep",
                )}
              >
                {c}
              </Link>
            ))}
          </div>

          {resources.length === 0 ? (
            <p className="text-ink-muted text-[14px]">Nothing here yet.</p>
          ) : (
            <SelectableList
              itemLabel="piece of content"
              onDeleteSelected={bulkDeleteResources}
              items={resources.map((r) => ({
                id: r.id,
                href: `/cms/${r.id}`,
                content: (
                  <>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display truncate text-[15px] font-semibold">
                          {r.title}
                        </h3>
                        {r.feature && (
                          <span className="bg-gold shrink-0 rounded-full px-2 py-[2px] text-[10px] font-bold uppercase">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="text-ink-muted mt-0.5 text-[12.5px]">
                        {r.category} · {r.tag}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-[11px] py-[5px] text-[11px] font-bold tracking-[0.04em] uppercase",
                        r.status === "published"
                          ? "bg-cream text-gold-deep"
                          : "border-line text-ink-muted border",
                      )}
                    >
                      {statusLabels[r.status]}
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
