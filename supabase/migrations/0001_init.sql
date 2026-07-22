-- OBS schema: core tables for content, courses, and public form submissions.
-- Written by hand against Supabase Postgres (no CLI-generated scaffolding).
-- RLS policies live in 0002_rls.sql — this file only defines structure.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type staff_role as enum ('admin', 'editor', 'scholar');
create type content_status as enum ('draft', 'in_review', 'published');
create type resource_category as enum ('Articles', 'Bible Studies', 'Manuals', 'Devotionals', 'Downloads');
create type lesson_progress_status as enum ('not_started', 'in_progress', 'done');
create type application_area as enum ('volunteer', 'bible_study_partner', 'internship', 'community_group', 'team');
create type application_status as enum ('new', 'reviewed', 'accepted', 'declined');
create type message_status as enum ('new', 'read', 'archived');

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- profiles — one row per auth.users, carries the staff role used by RLS
-- ---------------------------------------------------------------------------

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  avatar_initials text not null default '',
  role staff_role not null default 'scholar',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Auto-create a profile row when a new auth user signs up (invite flow).
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- resources — unifies homepage "featured resources", the /resources library,
-- and full article bodies (article_body is null until a piece has long-form
-- content, e.g. the article-detail page).
-- ---------------------------------------------------------------------------

create table resources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category resource_category not null,
  tag text not null,
  title text not null,
  excerpt text not null,
  meta_label text not null default '',
  cta_label text not null default 'Read →',
  href text,
  feature boolean not null default false,
  article_body jsonb,
  author_id uuid references profiles (id),
  status content_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index resources_status_idx on resources (status);
create index resources_category_idx on resources (category);

create trigger resources_set_updated_at
  before update on resources
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- reading_plans + reading_plan_days
-- ---------------------------------------------------------------------------

create table reading_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null,
  duration_days integer not null,
  title text not null,
  excerpt text not null,
  featured boolean not null default false,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger reading_plans_set_updated_at
  before update on reading_plans
  for each row execute function set_updated_at();

create table reading_plan_days (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references reading_plans (id) on delete cascade,
  day_number integer not null,
  title text not null,
  passage_ref text not null,
  content text,
  unique (plan_id, day_number)
);

-- ---------------------------------------------------------------------------
-- class_sessions
-- ---------------------------------------------------------------------------

create table class_sessions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  series text not null,
  duration_label text not null,
  title text not null,
  teacher text not null,
  recorded_at date not null,
  waveform integer[] not null default '{}',
  video_url text,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index class_sessions_series_idx on class_sessions (series);

create trigger class_sessions_set_updated_at
  before update on class_sessions
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------

create table events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  starts_at timestamptz not null,
  location text not null,
  description text,
  register_url text,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_starts_at_idx on events (starts_at);

create trigger events_set_updated_at
  before update on events
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- courses → course_modules → lessons (the staff onboarding flow)
-- ---------------------------------------------------------------------------

create table courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

create table course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses (id) on delete cascade,
  module_number integer not null,
  title text not null,
  meta_label text not null default '',
  sort_order integer not null,
  unique (course_id, module_number)
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references course_modules (id) on delete cascade,
  lesson_number integer not null,
  title text not null,
  video_url text,
  body jsonb not null default '[]',
  sort_order integer not null,
  unique (module_id, lesson_number)
);

-- ---------------------------------------------------------------------------
-- enrollments + lesson_progress
-- ---------------------------------------------------------------------------

create table enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  course_id uuid not null references courses (id) on delete cascade,
  started_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  lesson_id uuid not null references lessons (id) on delete cascade,
  status lesson_progress_status not null default 'not_started',
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create trigger lesson_progress_set_updated_at
  before update on lesson_progress
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- certificates
-- ---------------------------------------------------------------------------

create table certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  course_id uuid not null references courses (id) on delete cascade,
  issued_at timestamptz not null default now(),
  certificate_number text not null unique,
  pdf_url text,
  unique (user_id, course_id)
);

-- ---------------------------------------------------------------------------
-- Public form submissions
-- ---------------------------------------------------------------------------

create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'website',
  subscribed_at timestamptz not null default now()
);

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status message_status not null default 'new',
  created_at timestamptz not null default now()
);

create table community_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  area application_area not null,
  message text,
  status application_status not null default 'new',
  created_at timestamptz not null default now()
);
