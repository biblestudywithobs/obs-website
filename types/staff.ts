// Mirrors the `staff_role` Postgres enum exactly (supabase/migrations/0001,
// 0008). Three permission tiers map onto these 11 roles — see the RLS
// policies in 0002/0009_staff_role_permissions.sql for the source of truth:
//   • Admin tier: admin only (Users management).
//   • Editor tier: admin, editor, technical_team (Events, Media, Applications).
//   • Content tier: every role (Content, Reading Plans) — the floor everyone gets.
export type StaffRole =
  | "admin"
  | "editor"
  | "scholar"
  | "technical_team"
  | "voice_over_artist"
  | "bible_study_intern"
  | "technical_staff_intern"
  | "content_editorial_intern"
  | "media_podcast_intern"
  | "ministry_operations_intern"
  | "scholar_team_intern";

export const staffRoles: StaffRole[] = [
  "admin",
  "editor",
  "scholar",
  "technical_team",
  "voice_over_artist",
  "bible_study_intern",
  "technical_staff_intern",
  "content_editorial_intern",
  "media_podcast_intern",
  "ministry_operations_intern",
  "scholar_team_intern",
];

// 'editor' displays as "Staff Writer" — only the label changed, not the
// underlying enum value, to avoid touching every existing reference.
export const staffRoleLabels: Record<StaffRole, string> = {
  admin: "Admin",
  editor: "Staff Writer",
  scholar: "Scholar",
  technical_team: "Technical Team",
  voice_over_artist: "Voice Over Artist",
  bible_study_intern: "Bible Study Intern",
  technical_staff_intern: "Technical Staff Intern",
  content_editorial_intern: "Content & Editorial Intern",
  media_podcast_intern: "Media & Podcast Intern",
  ministry_operations_intern: "Ministry Operations Intern",
  scholar_team_intern: "Scholar Team Intern",
};

// Named permission-tier groups, matching the RLS policies exactly — use
// these instead of ad hoc arrays so a future role change only happens here.
export const EDITOR_TIER_ROLES: StaffRole[] = ["admin", "editor", "technical_team"];
export const ADMIN_ONLY_ROLES: StaffRole[] = ["admin"];
