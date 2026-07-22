import { staffRoles, EDITOR_TIER_ROLES, ADMIN_ONLY_ROLES, type StaffRole } from "@/types/staff";

export type NavItem = {
  label: string;
  href: string;
  roles: StaffRole[];
  icon: React.ReactNode;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

// Sidebar nav, gated per item by role — mirrors the data-roles matrix from
// admin/index.html. Client-side filtering here is a UX preview only; the real
// access boundary is Supabase RLS + server-side role checks (Phase E).
export const adminNav: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      {
        label: "Overview",
        href: "/admin",
        roles: staffRoles,
        icon: (
          <>
            <rect
              x="2.5"
              y="2.5"
              width="6"
              height="6"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <rect
              x="11.5"
              y="2.5"
              width="6"
              height="6"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <rect
              x="2.5"
              y="11.5"
              width="6"
              height="6"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <rect
              x="11.5"
              y="11.5"
              width="6"
              height="6"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </>
        ),
      },
      {
        label: "Content",
        href: "/cms",
        roles: staffRoles,
        icon: (
          <>
            <path
              d="M4 3h9l3 3v11H4z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M7 8h6M7 11h6M7 14h4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </>
        ),
      },
      {
        label: "Events",
        href: "/admin/events",
        roles: EDITOR_TIER_ROLES,
        icon: (
          <>
            <rect
              x="3"
              y="4"
              width="14"
              height="13"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M3 8h14M7 2v4M13 2v4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </>
        ),
      },
      {
        label: "Reading Plans",
        href: "/admin/reading-plans",
        roles: staffRoles,
        icon: (
          <path
            d="M10 3l1.9 4.2 4.6.4-3.5 3 1.1 4.5-4.1-2.5-4.1 2.5 1.1-4.5-3.5-3 4.6-.4z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        ),
      },
      {
        label: "Class Sessions",
        href: "/admin/class-sessions",
        roles: staffRoles,
        icon: (
          <>
            <rect
              x="3"
              y="6"
              width="14"
              height="9"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="M8.2 8.5l4 2.5-4 2.5z" fill="currentColor" />
          </>
        ),
      },
      {
        label: "Media",
        href: "/admin/media",
        roles: EDITOR_TIER_ROLES,
        icon: (
          <>
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 7l5 3-5 3z" fill="currentColor" />
          </>
        ),
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        label: "Applications",
        href: "/admin/applications",
        // Matches the community_manage_staff RLS policy — scholars can't
        // read this table, so they don't see the nav item either.
        roles: EDITOR_TIER_ROLES,
        icon: (
          <>
            <path
              d="M3 6a1 1 0 011-1h12a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M3 6l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </>
        ),
      },
      {
        label: "Users",
        href: "/admin/users",
        roles: ADMIN_ONLY_ROLES,
        icon: (
          <>
            <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M4 17c0-3 2.7-5 6-5s6 2 6 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </>
        ),
      },
      {
        label: "Analytics",
        href: "/admin/analytics",
        roles: staffRoles,
        icon: (
          <path
            d="M4 16V9M10 16V4M16 16v-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ),
      },
    ],
  },
];
