-- Adds a Commentary content type alongside the existing single-blob Reading
-- Plan, and a shareable draft-preview token — see plan notes for context.

create type reading_plan_type as enum ('reading_plan', 'commentary');

alter table reading_plans
  add column plan_type reading_plan_type not null default 'reading_plan';

-- Shareable "preview before publishing" link — looked up via the
-- service-role client (bypassing RLS) by exact token match, so a draft can
-- be handed to someone outside the CMS without changing who can list/read
-- drafts through normal (RLS-gated) queries.
alter table reading_plans
  add column preview_token uuid not null default gen_random_uuid();
create unique index reading_plans_preview_token_idx on reading_plans (preview_token);

-- Revives reading_plan_days (0001_init.sql) for Commentary's per-day
-- content — built for exactly this shape, left unused once reading plans
-- moved to a single body_html blob (0016_reading_plan_body.sql). A
-- commentary day doesn't always anchor to one passage, so relax this.
alter table reading_plan_days alter column passage_ref drop not null;
