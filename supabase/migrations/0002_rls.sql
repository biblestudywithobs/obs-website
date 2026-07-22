-- Row Level Security. This is the real access boundary — it holds regardless
-- of what the Next.js app does or doesn't check client-side (the admin
-- "Viewing as" selector in the UI is a preview only; this is the enforcement).

-- ---------------------------------------------------------------------------
-- Helper: current signed-in user's staff role, bypassing RLS via
-- SECURITY DEFINER to avoid recursive policy evaluation on `profiles`.
-- ---------------------------------------------------------------------------

create or replace function current_staff_role()
returns staff_role
language sql
stable
security definer
set search_path = public
as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from profiles where id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

alter table profiles enable row level security;

create policy profiles_select on profiles
  for select
  using (id = auth.uid() or current_staff_role() = 'admin');

create policy profiles_update_own on profiles
  for update
  using (id = auth.uid() or current_staff_role() = 'admin')
  with check (id = auth.uid() or current_staff_role() = 'admin');

-- Block self-escalation: only an admin may change anyone's `role` column.
create or replace function prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and current_staff_role() is distinct from 'admin' then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_escalation
  before update on profiles
  for each row execute function prevent_role_self_escalation();

-- ---------------------------------------------------------------------------
-- resources (Articles + Resources library) — admin, editor, scholar can write
-- ---------------------------------------------------------------------------

alter table resources enable row level security;

create policy resources_select_published on resources
  for select
  using (status = 'published' or is_staff());

create policy resources_write on resources
  for all
  using (current_staff_role() in ('admin', 'editor', 'scholar'))
  with check (current_staff_role() in ('admin', 'editor', 'scholar'));

-- ---------------------------------------------------------------------------
-- reading_plans / reading_plan_days — admin, editor, scholar can write
-- ---------------------------------------------------------------------------

alter table reading_plans enable row level security;

create policy reading_plans_select_published on reading_plans
  for select
  using (status = 'published' or is_staff());

create policy reading_plans_write on reading_plans
  for all
  using (current_staff_role() in ('admin', 'editor', 'scholar'))
  with check (current_staff_role() in ('admin', 'editor', 'scholar'));

alter table reading_plan_days enable row level security;

create policy reading_plan_days_select on reading_plan_days
  for select
  using (
    exists (
      select 1 from reading_plans p
      where p.id = plan_id and (p.status = 'published' or is_staff())
    )
  );

create policy reading_plan_days_write on reading_plan_days
  for all
  using (current_staff_role() in ('admin', 'editor', 'scholar'))
  with check (current_staff_role() in ('admin', 'editor', 'scholar'));

-- ---------------------------------------------------------------------------
-- class_sessions — admin, editor, scholar can write
-- ---------------------------------------------------------------------------

alter table class_sessions enable row level security;

create policy class_sessions_select_published on class_sessions
  for select
  using (status = 'published' or is_staff());

create policy class_sessions_write on class_sessions
  for all
  using (current_staff_role() in ('admin', 'editor', 'scholar'))
  with check (current_staff_role() in ('admin', 'editor', 'scholar'));

-- ---------------------------------------------------------------------------
-- events — write restricted to admin, editor (matches the admin sidebar's
-- data-roles="admin,editor" gate on the Events nav item)
-- ---------------------------------------------------------------------------

alter table events enable row level security;

create policy events_select_published on events
  for select
  using (status = 'published' or is_staff());

create policy events_write on events
  for all
  using (current_staff_role() in ('admin', 'editor'))
  with check (current_staff_role() in ('admin', 'editor'));

-- ---------------------------------------------------------------------------
-- courses / course_modules / lessons — any signed-in staff member can read
-- (onboarding applies to every role); only admins manage course content
-- ---------------------------------------------------------------------------

alter table courses enable row level security;
alter table course_modules enable row level security;
alter table lessons enable row level security;

create policy courses_select_staff on courses for select using (is_staff());
create policy course_modules_select_staff on course_modules for select using (is_staff());
create policy lessons_select_staff on lessons for select using (is_staff());

create policy courses_write_admin on courses
  for all using (current_staff_role() = 'admin') with check (current_staff_role() = 'admin');
create policy course_modules_write_admin on course_modules
  for all using (current_staff_role() = 'admin') with check (current_staff_role() = 'admin');
create policy lessons_write_admin on lessons
  for all using (current_staff_role() = 'admin') with check (current_staff_role() = 'admin');

-- ---------------------------------------------------------------------------
-- enrollments / lesson_progress — a user manages only their own rows;
-- admins can read all (reporting)
-- ---------------------------------------------------------------------------

alter table enrollments enable row level security;
alter table lesson_progress enable row level security;

create policy enrollments_own on enrollments
  for all
  using (user_id = auth.uid() or current_staff_role() = 'admin')
  with check (user_id = auth.uid());

create policy lesson_progress_own on lesson_progress
  for all
  using (user_id = auth.uid() or current_staff_role() = 'admin')
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- certificates — a user reads only their own; issuance is a server-side
-- action using the service-role key (bypasses RLS), never a client insert
-- ---------------------------------------------------------------------------

alter table certificates enable row level security;

create policy certificates_select_own on certificates
  for select
  using (user_id = auth.uid() or current_staff_role() = 'admin');

-- ---------------------------------------------------------------------------
-- Public form submissions — anonymous visitors may insert; only staff may
-- read/manage. contact_messages is admin-only (may contain sensitive asks).
-- ---------------------------------------------------------------------------

alter table newsletter_subscribers enable row level security;
alter table contact_messages enable row level security;
alter table community_applications enable row level security;

create policy newsletter_insert_anyone on newsletter_subscribers
  for insert
  with check (true);

create policy newsletter_select_staff on newsletter_subscribers
  for select
  using (current_staff_role() in ('admin', 'editor'));

create policy contact_insert_anyone on contact_messages
  for insert
  with check (true);

create policy contact_manage_admin on contact_messages
  for select
  using (current_staff_role() = 'admin');

create policy contact_update_admin on contact_messages
  for update
  using (current_staff_role() = 'admin')
  with check (current_staff_role() = 'admin');

create policy community_insert_anyone on community_applications
  for insert
  with check (true);

create policy community_manage_staff on community_applications
  for select
  using (current_staff_role() in ('admin', 'editor'));

create policy community_update_staff on community_applications
  for update
  using (current_staff_role() in ('admin', 'editor'))
  with check (current_staff_role() in ('admin', 'editor'));
