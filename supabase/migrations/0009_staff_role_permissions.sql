-- Maps the expanded role list (0008) onto the existing 3 permission tiers:
--   • Content tier (write resources/reading_plans/class_sessions) — every
--     staff role, since Voice Over Artist and all Intern roles were asked to
--     have "Scholar-level" access, and Scholar already had this.
--   • Editor tier (write events/podcast_episodes, manage applications) —
--     admin, editor, technical_team ("editor-level" access as specified).
--   • Admin tier (Users) — unchanged, admin only.

drop policy resources_write on resources;
create policy resources_write on resources
  for all using (is_staff()) with check (is_staff());

drop policy reading_plans_write on reading_plans;
create policy reading_plans_write on reading_plans
  for all using (is_staff()) with check (is_staff());

drop policy reading_plan_days_write on reading_plan_days;
create policy reading_plan_days_write on reading_plan_days
  for all using (is_staff()) with check (is_staff());

drop policy class_sessions_write on class_sessions;
create policy class_sessions_write on class_sessions
  for all using (is_staff()) with check (is_staff());

drop policy events_write on events;
create policy events_write on events
  for all
  using (current_staff_role() in ('admin', 'editor', 'technical_team'))
  with check (current_staff_role() in ('admin', 'editor', 'technical_team'));

drop policy podcast_episodes_write on podcast_episodes;
create policy podcast_episodes_write on podcast_episodes
  for all
  using (current_staff_role() in ('admin', 'editor', 'technical_team'))
  with check (current_staff_role() in ('admin', 'editor', 'technical_team'));

drop policy community_manage_staff on community_applications;
create policy community_manage_staff on community_applications
  for select
  using (current_staff_role() in ('admin', 'editor', 'technical_team'));

drop policy community_update_staff on community_applications;
create policy community_update_staff on community_applications
  for update
  using (current_staff_role() in ('admin', 'editor', 'technical_team'))
  with check (current_staff_role() in ('admin', 'editor', 'technical_team'));

drop policy newsletter_select_staff on newsletter_subscribers;
create policy newsletter_select_staff on newsletter_subscribers
  for select
  using (current_staff_role() in ('admin', 'editor', 'technical_team'));
