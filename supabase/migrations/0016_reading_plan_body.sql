-- Reading plans on this site are single long-form pieces (article/commentary
-- style) rather than day-by-day content — the existing reading_plan_days
-- table was built for a day-by-day model but isn't the right fit here (that
-- structure already lives on YouVersion); left untouched but unused.
alter table reading_plans add column body_html text;
