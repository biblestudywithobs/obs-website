-- Cover image for reading plans, shown on the public card and detail page —
-- same "uploads" storage bucket pattern as events.flyer_url.
alter table reading_plans add column image_url text;
