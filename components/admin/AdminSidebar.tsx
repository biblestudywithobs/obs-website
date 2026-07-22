"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { adminNav } from "@/lib/data/admin-nav";
import { SignOutButton } from "@/components/staff/SignOutButton";
import { staffRoles, staffRoleLabels, type StaffRole } from "@/types/staff";

type SidebarProps = {
  actualRole: StaffRole;
  userName: string;
  userInitials: string;
  /** "dashboard" shows the role switcher/label + user chip; "editor" (used by
   * the CMS article editor) shows an exit link back to /admin instead,
   * matching cms/index.html's sidebar footer. */
  footer?: "dashboard" | "editor";
};

// Sidebar shared by /admin and /cms. Renders as a fixed left rail at
// desktop widths and, at ≤780px (where the rail is hidden entirely), as a
// sticky top bar with a hamburger-triggered slide-out drawer — same
// interaction pattern as the public site's SiteHeader mobile drawer, so
// staff on a phone always have a way to navigate and sign out.
export function AdminSidebar({
  actualRole,
  userName,
  userInitials,
  footer = "dashboard",
}: SidebarProps) {
  const pathname = usePathname();
  const [previewRole, setPreviewRole] = useState<StaffRole>(actualRole);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const canPreview = actualRole === "admin";

  // Closing the drawer on navigation is a state reset triggered by a prop
  // change, not a sync with an external system — adjusting it directly
  // during render (React's documented pattern for this) avoids the extra
  // commit a useEffect + setState would cause.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setDrawerOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const navContent = (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      {adminNav.map((group) => (
        <div key={group.label}>
          <div className="text-ink-muted px-2.5 pt-3.5 pb-2 text-[11px] font-bold tracking-[0.08em] uppercase">
            {group.label}
          </div>
          <ul>
            {group.items
              .filter((item) => item.roles.includes(previewRole))
              .map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.label} className="mb-0.5">
                    <Link
                      href={item.href}
                      className={cn(
                        "text-ink-muted hover:bg-cream hover:text-ink flex items-center gap-[11px] rounded-[9px] px-2.5 py-2.5 text-[14px] font-medium transition-colors",
                        isActive && "bg-ink text-paper hover:bg-ink hover:text-paper",
                      )}
                    >
                      <svg
                        className={cn(
                          "h-[17px] w-[17px] shrink-0 opacity-75",
                          isActive && "opacity-100",
                        )}
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke={isActive ? "var(--color-paper)" : "currentColor"}
                      >
                        {item.icon}
                      </svg>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const footerContent =
    footer === "dashboard" ? (
      <div className="border-line border-t px-3.5 pt-3.5 pb-[18px]">
        {canPreview && (
          <div className="mb-3.5 flex flex-col gap-2">
            <label
              htmlFor="roleSelect"
              className="text-ink-muted text-[11px] font-bold tracking-[0.06em] uppercase"
            >
              Viewing as
            </label>
            <select
              id="roleSelect"
              value={previewRole}
              onChange={(e) => setPreviewRole(e.target.value as StaffRole)}
              className="border-line bg-paper font-ui rounded-[9px] border px-2.5 py-[9px] text-[13.5px] font-medium"
            >
              {staffRoles.map((r) => (
                <option key={r} value={r}>
                  {staffRoleLabels[r]}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-center gap-2.5">
          <span className="bg-gold font-display flex h-[34px] w-[34px] items-center justify-center rounded-full text-[14px] font-semibold">
            {userInitials}
          </span>
          <span className="text-[13px] leading-[1.2] font-semibold">
            {userName}
            <span className="text-ink-muted mt-px block text-[11.5px] font-medium">
              {staffRoleLabels[actualRole]}
            </span>
          </span>
        </div>
        <div className="mt-3">
          <SignOutButton />
        </div>
      </div>
    ) : (
      <div className="mt-3.5 flex flex-col gap-1 px-3.5">
        <Link
          href="/admin"
          className="text-ink-muted hover:bg-cream hover:text-ink flex items-center gap-2 rounded-[9px] px-2.5 py-2 text-[13px] font-semibold"
        >
          ← Exit editor
        </Link>
        <SignOutButton />
      </div>
    );

  const brandmark = (
    <div className="flex items-center gap-2.5">
      <span className="bg-gold font-display flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[8px] text-[14px] font-bold">
        O
      </span>
      <span className="font-display text-[16px] leading-[1.15] font-semibold">
        OBS Studio
        <small className="font-ui text-ink-muted mt-px block text-[11px] font-medium tracking-[0.02em]">
          Staff Dashboard
        </small>
      </span>
    </div>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside className="border-line bg-paper sticky top-0 flex h-screen w-[248px] shrink-0 flex-col border-r max-[780px]:hidden">
        <div className="border-line flex items-center gap-2.5 border-b px-[22px] pt-[22px] pb-[18px]">
          {brandmark}
        </div>
        {navContent}
        {footerContent}
      </aside>

      {/* Mobile top bar */}
      <div className="border-line bg-paper sticky top-0 z-[100] hidden h-[60px] items-center justify-between border-b px-5 max-[780px]:flex">
        {brandmark}
        <button
          type="button"
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          aria-expanded={drawerOpen}
          aria-controls="adminMobileDrawer"
          onClick={() => setDrawerOpen((v) => !v)}
          className={cn(
            "border-line flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] border transition-colors",
            drawerOpen && "border-ink",
          )}
        >
          {drawerOpen ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 1L15 15M15 1L1 15" stroke="#2B2420" strokeWidth="1.6" />
            </svg>
          ) : (
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <path d="M0 1H18M0 7H18M0 13H18" stroke="#2B2420" strokeWidth="1.6" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile scrim + drawer */}
      <div
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-[190] hidden bg-[rgba(26,26,26,0.45)] transition-opacity duration-[250ms] max-[780px]:block",
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        id="adminMobileDrawer"
        aria-label="Admin navigation"
        className={cn(
          "border-line bg-paper fixed top-0 left-0 z-[200] hidden h-full w-[min(300px,82vw)] flex-col border-r transition-transform duration-300 max-[780px]:flex",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="border-line flex items-center gap-2.5 border-b px-[22px] pt-[22px] pb-[18px]">
          {brandmark}
        </div>
        {navContent}
        {footerContent}
      </aside>
    </>
  );
}
