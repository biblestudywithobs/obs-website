-- prevent_role_self_escalation() blocked ALL role changes made outside a
-- client session (auth.uid() is null for service-role/direct-SQL access),
-- including legitimate administrative bootstrapping. It should only block a
-- signed-in non-admin from changing roles (including their own) — direct
-- service-role access is already maximally trusted (it bypasses RLS
-- entirely), so it should never be blocked by this trigger.

create or replace function prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and current_staff_role() is distinct from 'admin' then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end;
$$;
