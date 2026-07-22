-- Seed data mirroring the content currently hardcoded in lib/data/*.ts, so the
-- DB-backed pages render identically to the seed-data version once the data
-- layer is switched over. Run after 0001_init.sql + 0002_rls.sql, e.g.:
--   supabase db push && psql "$DATABASE_URL" -f supabase/seed.sql
-- (or paste into the Supabase SQL editor).
--
-- profiles / enrollments / lesson_progress / certificates are per-user rows
-- created at signup / runtime (via the handle_new_user trigger and the app
-- itself) — they are intentionally not seeded here.

-- ---------------------------------------------------------------------------
-- resources — the full /resources library (lib/data/library.ts). The first
-- row is also the homepage feature card and carries the full article body
-- (lib/data/articles.ts) for /articles/[slug].
-- ---------------------------------------------------------------------------

insert into resources (slug, category, tag, title, excerpt, meta_label, cta_label, feature, status, published_at, body_html)
values
  (
    'how-to-read-and-understand-your-bible', 'Articles', 'Article',
    'How to Read and Understand Your Bible',
    'A foundational guide to reading Scripture in context.',
    'OBS Faculty', 'Read →', true, 'published', now(),
    '<p>Most people who struggle with the Bible are not struggling with faith — they are struggling with a method. They open to a random page, read a few verses, and walk away more confused than when they started. That is not a spiritual failure. It is a reading problem, and reading problems have solutions.</p><h2>Start with context, not verses</h2><p>A verse pulled out of its chapter is like a sentence pulled out of a conversation — technically words, but not necessarily meaning what you think. Before you ask what does this verse say, ask what book is this, who wrote it, and who were they writing to. That single habit resolves more confusion than any commentary.</p><blockquote><p>Scripture was written for us, but not originally to us — and that distinction changes everything about how we read it.</p></blockquote><h2>Read the whole book before the verse</h2><p>Try reading an entire short book — Philippians, or Ruth — in one sitting before you study any single passage from it closely. You will notice the argument, the story arc, the emotional shape of the letter. That shape is the frame every individual verse hangs on.</p><h2>Ask what kind of writing it is</h2><p>Poetry, law, narrative, prophecy, and letter all work differently. A psalm uses metaphor on purpose; a legal code does not. Knowing which one you are reading tells you how literally, or how symbolically, to take what is in front of you.</p><h2>Bring a question, not just your eyes</h2><p>Read with a pen. Ask what does this tell me about God, about people, what is the tension in this passage and how does it resolve. Passive reading produces passive faith. Active reading — even just a few honest questions in the margin — is where understanding actually starts.</p>'
  ),
  ('the-bible-translation-series', 'Bible Studies', 'Series', 'The Bible Translation Series', 'Why translations differ, and how to study across them.', '6 parts', 'Read →', false, 'published', now(), null),
  ('leadership-course-manual', 'Manuals', 'Manual', 'Leadership Course Manual', 'Formation for those called to teach and shepherd.', '8 sessions', 'Download →', false, 'published', now(), null),
  ('growing-in-faith', 'Devotionals', 'Devotional', 'Growing in Faith', 'Daily devotionals rooted in the text itself.', '30 days', 'Read →', false, 'published', now(), null),
  ('soteriology-doctrine-of-salvation', 'Manuals', 'Manual', 'Soteriology: The Doctrine of Salvation', 'A three-session teaching manual on salvation.', '3 sessions', 'Download →', false, 'published', now(), null),
  ('hebrews-overview-study-sheet', 'Downloads', 'Download', 'Hebrews Overview — Study Sheet', 'A printable one-page summary of the book of Hebrews.', 'PDF · 2 pages', 'Download →', false, 'published', now(), null),
  ('reading-hebrews-slowly', 'Articles', 'Article', 'Reading Hebrews Slowly', 'A slower approach to a dense, argument-driven book.', 'OBS Faculty', 'Read →', false, 'published', now(), null),
  ('a-beginners-journey-through-scripture', 'Bible Studies', 'Study', 'A Beginner''s Journey Through Scripture', 'A gentle on-ramp for first-time Bible readers.', '4 weeks', 'Read →', false, 'published', now(), null),
  ('psalms-of-ascent-15-day-reader', 'Devotionals', 'Devotional', 'Psalms of Ascent — 15 Day Reader', 'Meditations through the songs pilgrims sang.', '15 days', 'Read →', false, 'published', now(), null);

-- ---------------------------------------------------------------------------
-- reading_plans (lib/data/reading-plans.ts), plus the featured plan shown at
-- the top of /reading-plans
-- ---------------------------------------------------------------------------

insert into reading_plans (slug, category, duration_days, title, excerpt, featured, status)
values
  ('how-to-read-and-understand-your-bible-plan', 'Beginner', 7, 'How To Read And Understand Your Bible', 'A 7-day plan built from our foundational hermeneutics course — the best place to start if you have never studied Scripture this way before.', true, 'published'),
  ('a-beginners-journey-through-scripture', 'Beginner', 7, 'A Beginner''s Journey Through Scripture', 'A gentle, four-week on-ramp for first-time Bible readers.', false, 'published'),
  ('reading-hebrews-slowly', 'Book Study', 14, 'Reading Hebrews Slowly', 'A slower, section-by-section walk through a dense, argument-driven letter.', false, 'published'),
  ('psalms-of-ascent', 'Devotional', 15, 'Psalms of Ascent', 'Meditations through the songs pilgrims sang on their way to worship.', false, 'published'),
  ('what-is-salvation', 'Topical', 10, 'What Is Salvation?', 'A topical walk through Soteriology, built from our teaching manual.', false, 'published'),
  ('why-the-bible-is-trustworthy', 'Beginner', 5, 'Why the Bible Is Trustworthy', 'A short primer on canon, transmission, and translation.', false, 'published'),
  ('growing-in-faith', 'Devotional', 30, 'Growing in Faith', 'Daily devotionals to root your walk with Christ in the text itself.', false, 'published');

-- ---------------------------------------------------------------------------
-- class_sessions (lib/data/session-library.ts)
-- ---------------------------------------------------------------------------

insert into class_sessions (slug, series, duration_label, title, teacher, recorded_at, waveform, status)
values
  ('hermeneutics-genre-and-context', 'Hermeneutics', '42 min', 'Session 4: Genre & Context', 'OBS Faculty', '2026-07-09', '{40,70,30,90,55,75,35,60,45,80,25,65}', 'published'),
  ('hermeneutics-reading-in-context', 'Hermeneutics', '44 min', 'Session 3: Reading in Context', 'OBS Faculty', '2026-06-18', '{35,60,80,45,65,30,75,50,85,40,55,30}', 'published'),
  ('hermeneutics-what-is-hermeneutics', 'Hermeneutics', '39 min', 'Session 2: What Is Hermeneutics?', 'OBS Faculty', '2026-06-11', '{50,75,40,65,30,85,45,70,35,60,50,25}', 'published'),
  ('soteriology-justification-by-faith', 'Soteriology', '51 min', 'Session 2: Justification by Faith', 'Ife', '2026-07-02', '{55,30,85,50,65,40,90,35,70,45,60,25}', 'published'),
  ('soteriology-what-is-salvation', 'Soteriology', '47 min', 'Session 1: What Is Salvation?', 'Ife', '2026-06-11', '{50,80,35,60,90,45,70,30,55,65,40,25}', 'published'),
  ('soteriology-sanctification', 'Soteriology', '49 min', 'Session 3: Sanctification', 'Ife', '2026-07-16', '{60,35,75,45,85,30,65,50,40,70,55,25}', 'published'),
  ('leadership-shepherding-well', 'Leadership Course', '38 min', 'Session 6: Shepherding Well', 'Kareem', '2026-06-25', '{65,40,75,30,55,85,45,60,35,70,50,25}', 'published'),
  ('leadership-teaching-with-clarity', 'Leadership Course', '41 min', 'Session 5: Teaching with Clarity', 'Kareem', '2026-06-18', '{45,70,35,80,50,60,30,75,40,65,55,25}', 'published'),
  ('growing-rooted-in-the-word', 'Growing in Faith', '18 min', 'Day 12: Rooted in the Word', 'OBS Faculty', '2026-07-14', '{30,55,70,40,60,35,80,45,65,50,30,20}', 'published');

-- ---------------------------------------------------------------------------
-- events (lib/data/events.ts)
-- ---------------------------------------------------------------------------

insert into events (slug, title, starts_at, location, register_url, status)
values
  ('leadership-course-cohort-5', 'OBS Leadership Course — Cohort 5 Begins', '2026-08-04 18:00:00+01', 'Ibadan & Online', '#', 'published'),
  ('bible-study-reading-hebrews-together', 'Bible Study Session: Reading Hebrews Together', '2026-08-18 19:00:00+01', 'Online', '#', 'published'),
  ('obs-annual-conference-2026', 'OBS Annual Conference: Scripture & the Local Church', '2026-09-05 09:00:00+01', 'Ibadan', '#', 'published'),
  ('workshop-teaching-the-text-well', 'Workshop: Teaching the Text Well', '2026-09-20 10:00:00+01', 'Online', '#', 'published');

-- ---------------------------------------------------------------------------
-- courses / course_modules / lessons — the staff onboarding flow
-- (lib/data/staff.ts). Only Module 3's lessons were fleshed out in the
-- original prototype; the other modules are seeded as structural
-- placeholders (title + duration only) pending real content from OBS.
-- ---------------------------------------------------------------------------

with new_course as (
  insert into courses (slug, title, description)
  values ('staff-onboarding', 'OBS Staff Onboarding Course', 'Five short modules covering our mission, our doctrine, and how we work.')
  returning id
),
modules as (
  insert into course_modules (course_id, module_number, title, meta_label, sort_order)
  select id, m.module_number, m.title, m.meta_label, m.module_number
  from new_course, (
    values
      (1, 'Welcome & Our Mission', '4 lessons · 18 min'),
      (2, 'Statement of Faith', '3 lessons · 22 min'),
      (3, 'Hermeneutics Basics', '5 lessons · 31 min'),
      (4, 'Content & Brand Guidelines', '3 lessons · 15 min'),
      (5, 'Ministry Operations', '4 lessons · 20 min')
  ) as m(module_number, title, meta_label)
  returning id, module_number
)
insert into lessons (module_id, lesson_number, title, body, sort_order)
select modules.id, l.lesson_number, l.title, l.body::jsonb, l.lesson_number
from modules, (
  values
    (1, 'What is hermeneutics?', '[]'),
    (2, 'Reading in context', '[]'),
    (3, 'Genre matters', '[
      {"type":"p","text":"Scripture is not one kind of writing — it is poetry, narrative, law, prophecy, letter, and apocalyptic vision, often within the same book. Reading a psalm the way you would read a legal code, or a parable the way you would read a genealogy, is where most misreading starts."},
      {"type":"p","text":"Before you interpret a passage, ask what kind of writing it is. That single question reshapes how you read everything that follows — and it is the habit this lesson is built to give you."}
    ]'),
    (4, 'Cross-referencing well', '[]'),
    (5, 'Module quiz', '[]')
) as l(lesson_number, title, body)
where modules.module_number = 3;

-- Media (/media) is pulled live from Spotify + Substack — see
-- lib/queries/public-media.ts — so there's no podcast_episodes table or seed
-- data to maintain here anymore.
