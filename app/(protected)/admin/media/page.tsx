import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireRole } from "@/lib/auth";
import { EDITOR_TIER_ROLES } from "@/types/staff";
import { listMediaItems } from "@/lib/queries/public-media";
import { cn } from "@/lib/cn";

// Read-only — Media is pulled live from Spotify + Substack (see
// lib/queries/public-media.ts), so there's nothing to create or edit here.
// This is just a staff-facing preview of exactly what /media shows.
export default async function AdminMediaPage() {
  const profile = await requireRole(EDITOR_TIER_ROLES);
  const items = await listMediaItems();

  return (
    <div className="flex min-h-screen max-[780px]:flex-col">
      <AdminSidebar
        actualRole={profile.role}
        userName={profile.fullName}
        userInitials={profile.avatarInitials}
      />

      <main className="min-w-0 flex-1">
        <div className="border-line bg-paper sticky top-0 z-10 flex h-[72px] items-center justify-between border-b px-8 max-[780px]:px-5">
          <h1 className="font-display text-[20px] font-semibold">Media</h1>
          <a
            href="/media"
            target="_blank"
            rel="noopener noreferrer"
            className="border-line text-ink-muted hover:border-gold-deep hover:text-ink rounded-full border px-[16px] py-2.5 text-[13.5px] font-semibold transition-colors"
          >
            View live page →
          </a>
        </div>

        <div className="max-w-[1000px] p-8 max-[780px]:p-5">
          <p className="text-ink-muted mb-5 text-[13px]">
            Pulled live from Spotify and Substack — publish or unpublish an episode from those
            platforms directly; it shows up here automatically.
          </p>
          {items.length === 0 ? (
            <p className="text-ink-muted text-[14px]">
              Nothing yet — check that SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET are set.
            </p>
          ) : (
            <div className="border-line bg-paper rounded-[16px] border">
              {items.map((item, i) => (
                <a
                  key={item.title + item.publishedAt}
                  href={item.spotifyUrl ?? item.substackUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "hover:bg-cream flex items-center justify-between gap-4 px-6 py-4 transition-colors",
                    i !== items.length - 1 && "border-line border-b",
                  )}
                >
                  <div className="min-w-0">
                    <h3 className="font-display truncate text-[15px] font-semibold">
                      {item.title}
                    </h3>
                    <div className="text-ink-muted mt-0.5 text-[12.5px]">
                      {new Date(item.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {item.duration && ` · ${item.duration}`}
                    </div>
                  </div>
                  <span className="border-line text-ink-muted shrink-0 rounded-full border px-[11px] py-[5px] text-[11px] font-bold tracking-[0.04em] uppercase">
                    {item.source === "both"
                      ? "Spotify & Substack"
                      : item.source === "spotify"
                        ? "Spotify"
                        : "Substack"}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
