-- Phone number so staff can reach an applicant even if they miss the email.
alter table community_applications
  add column phone text;
