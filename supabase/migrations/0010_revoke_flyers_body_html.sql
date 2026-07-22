-- Adds: profiles.is_active (real revoke flag, enforced inside the RLS
-- helper functions themselves — not just an app-level check), events.flyer_url,
-- and resources.body_html (replaces the old article_body jsonb block array
-- now that the CMS editor produces real HTML).

alter table profiles add column is_active boolean not null default true;

alter table events add column flyer_url text;

alter table resources add column body_html text;
alter table resources drop column article_body;

-- ---------------------------------------------------------------------------
-- Revoked staff lose staff status immediately, everywhere RLS checks it —
-- this is the real enforcement, independent of whether their JWT has expired.
-- ---------------------------------------------------------------------------

create or replace function current_staff_role()
returns staff_role
language sql
stable
security definer
set search_path = public
as $$
  select role from profiles where id = auth.uid() and is_active;
$$;

create or replace function is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from profiles where id = auth.uid() and is_active);
$$;

-- ---------------------------------------------------------------------------
-- Storage: a single public-read "uploads" bucket for event flyers and
-- content images. Staff (any active role) may write; anyone may read, since
-- these are always public-facing assets.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

create policy uploads_public_read on storage.objects
  for select
  using (bucket_id = 'uploads');

create policy uploads_staff_insert on storage.objects
  for insert
  with check (bucket_id = 'uploads' and is_staff());

create policy uploads_staff_update on storage.objects
  for update
  using (bucket_id = 'uploads' and is_staff())
  with check (bucket_id = 'uploads' and is_staff());

create policy uploads_staff_delete on storage.objects
  for delete
  using (bucket_id = 'uploads' and is_staff());
