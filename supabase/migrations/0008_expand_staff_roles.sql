-- Expands the staff role model from 3 broad tiers to reflect how the team is
-- actually organized. Split into its own migration (separate from the RLS
-- policy updates in 0009) because Postgres requires a new enum value to be
-- committed before it can be referenced by other statements.
--
-- 'editor' keeps its underlying value (only its display label changes to
-- "Staff Writer" in the app) to avoid an enum rename touching every existing
-- reference; the new values below are additions only.

alter type staff_role add value 'technical_team';
alter type staff_role add value 'voice_over_artist';
alter type staff_role add value 'bible_study_intern';
alter type staff_role add value 'technical_staff_intern';
alter type staff_role add value 'content_editorial_intern';
alter type staff_role add value 'media_podcast_intern';
alter type staff_role add value 'ministry_operations_intern';
alter type staff_role add value 'scholar_team_intern';
