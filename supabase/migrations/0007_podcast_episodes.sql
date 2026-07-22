-- Podcast episodes for the public /media page. Previously pure hardcoded
-- data (lib/data/media.ts) with no table at all.

create table podcast_episodes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text not null default 'OBS Studio Podcast',
  duration_label text not null,
  media_url text,
  status content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index podcast_episodes_status_idx on podcast_episodes (status);

create trigger podcast_episodes_set_updated_at
  before update on podcast_episodes
  for each row execute function set_updated_at();

alter table podcast_episodes enable row level security;

create policy podcast_episodes_select_published on podcast_episodes
  for select
  using (status = 'published' or is_staff());

-- Matches the Media nav item's role gate (admin, editor — not scholar).
create policy podcast_episodes_write on podcast_episodes
  for all
  using (current_staff_role() in ('admin', 'editor'))
  with check (current_staff_role() in ('admin', 'editor'));
