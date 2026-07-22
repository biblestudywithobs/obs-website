-- Volunteer applications collect two more real fields: gender and how many
-- hours per week the applicant can dedicate. Nullable since only the
-- Volunteer form (area = 'volunteer') asks for them.
alter table community_applications add column gender text;
alter table community_applications add column hours_per_week text;
