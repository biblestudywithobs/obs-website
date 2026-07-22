-- profiles never stored email (by original design — there was no RLS-safe
-- way for the client to read auth.users.email directly). The admin Users
-- page needs to list staff by email, so denormalize a copy here, kept in
-- sync at signup by handle_new_user().

alter table profiles add column email text;

-- Backfill existing rows before enforcing not-null/unique below.
update profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;

alter table profiles
  alter column email set not null,
  add constraint profiles_email_key unique (email);

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$ language plpgsql security definer set search_path = public;
