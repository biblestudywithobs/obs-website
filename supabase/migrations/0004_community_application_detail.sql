-- Captures the specific team/role (Volunteer, Internships) or general
-- location (Community Groups) chosen within an application area, so staff
-- reviewing applications see more than just the broad area enum.

alter table community_applications
  add column role_detail text,
  add column location text;
