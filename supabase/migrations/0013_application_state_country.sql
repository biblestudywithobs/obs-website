-- Volunteer and Internship applications also collect where the applicant is
-- applying from: state/region and country. Nullable since only those two
-- forms ask for it.
alter table community_applications add column state text;
alter table community_applications add column country text;
