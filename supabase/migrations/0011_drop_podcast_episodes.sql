-- Media is now pulled live from Spotify + Substack (lib/queries/public-media.ts)
-- rather than admin-entered rows, per the "replace entirely" decision — so
-- this table (and its RLS policies, dropped automatically with it) is no
-- longer read or written anywhere in the app.
drop table podcast_episodes;
