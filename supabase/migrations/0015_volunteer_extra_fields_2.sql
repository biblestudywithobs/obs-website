-- Volunteer and Internship applications collect four more real fields about
-- the applicant's church involvement and spiritual walk. Nullable since only
-- those two forms ask for them.
alter table community_applications add column church text;
alter table community_applications add column workforce text;
alter table community_applications add column bible_study_rating text;
alter table community_applications add column read_articles text;
