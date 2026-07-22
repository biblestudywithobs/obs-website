# Open Bible School

Marketing site + staff portal for Open Bible School (biblestudywithobs.com) — public pages (resources, reading plans, class sessions, media, events, community, contact), a staff onboarding portal, and an admin dashboard for managing all of it, backed by a real database rather than hardcoded content.

## Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **Tailwind CSS v4** — design tokens live in `app/globals.css`'s `@theme` block
- **Supabase** — Postgres, Auth, Storage, Row Level Security (the real access-control boundary, not just the app-level role checks)
- **Resend** + **React Email** — transactional email (contact/community-application notifications, staff invites, confirmation emails), branded to match the site
- **PostHog** — analytics
- **Cloudflare R2** — file storage for admin-uploaded class session audio and resource PDFs
- **Spotify Web API** + **Substack RSS** — the Media page and the Resources library's "Substack" tab pull live from both platforms rather than needing manual re-entry
- **Tiptap** — the CMS's rich-text article editor

## Project structure

```
app/
  (marketing)/     public site — home, about, resources, reading-plans, sessions,
                    media, events, community/*, contact, articles/[slug]
  (staff)/          staff portal — login, onboarding dashboard, lessons, certificates
  (protected)/      admin dashboard + CMS — gated by role, RLS-enforced underneath
  api/              route handlers — newsletter/contact/community forms, file uploads
components/
  ui/, layout/, cards/, sections/, admin/, staff/
lib/
  supabase/         server/browser/admin Supabase clients
  queries/          read-side data access (public-*.ts for the marketing site,
                    admin-*.ts for the dashboard)
  actions/          Server Actions — all writes go through these
  auth.ts           requireProfile()/requireRole() page-level guards
  spotify.ts, substack.ts, r2.ts, resend.ts, storage.ts
                    external integrations
emails/             React Email templates
supabase/
  migrations/       schema + RLS, applied in order
  seed.sql          starter content matching a fresh install
```

## Local setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables** — copy `.env.example` to `.env.local` and fill in real values:

   | Variable                                                                                        | Where to get it                                                                                                                                                                             |
   | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API                                                                                                                                                           |
   | `SUPABASE_ACCESS_TOKEN`                                                                         | Supabase account → Access Tokens (CLI only — `db push`/`gen types`, not read by the app)                                                                                                    |
   | `RESEND_API_KEY`                                                                                | Resend dashboard → API Keys (needs a verified sending domain for real delivery)                                                                                                             |
   | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`                                           | PostHog project settings                                                                                                                                                                    |
   | `POSTHOG_PERSONAL_API_KEY`, `POSTHOG_PROJECT_ID`                                                | PostHog → personal API keys (separate from the public key above — used server-side by the admin Analytics page)                                                                             |
   | `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`                                                    | [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) → Create app. The account that creates the app needs an active Premium subscription, or the episodes API returns 403 |
   | `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`                                       | Cloudflare dashboard → R2 → Manage R2 API Tokens                                                                                                                                            |
   | `R2_PUBLIC_BASE_URL`                                                                            | The bucket's `pub-xxxx.r2.dev` URL, from R2 → your bucket → Settings → Public access → Allow Access (this is a dashboard-only toggle — not reachable via the API token above)               |

3. **Database** — link the Supabase CLI to your project, then apply migrations and seed data:

   ```bash
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   npx supabase db query --linked "$(cat supabase/seed.sql)"
   ```

   After any schema change, regenerate types the same way the rest of this project does — **to a temp file first**, not directly to `types/database.ts`. The Supabase CLI occasionally appends an internal telemetry error to stdout, which silently corrupts the file if piped straight in:

   ```bash
   npx supabase gen types typescript --linked > /tmp/database-types-new.ts
   tail -c 200 /tmp/database-types-new.ts   # confirm it ends cleanly with `} as const`
   cp /tmp/database-types-new.ts types/database.ts
   ```

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command                | What it does                        |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Start the dev server (Turbopack)    |
| `npm run build`        | Production build                    |
| `npm run start`        | Serve a production build            |
| `npm run typecheck`    | `tsc --noEmit`                      |
| `npm run lint`         | ESLint                              |
| `npm run format`       | Prettier, writes changes            |
| `npm run format:check` | Prettier, check only (what CI runs) |
| `npm run test`         | Vitest, runs once and exits         |

## Testing

Unit tests only, for the pure business logic that's actually worth locking in with a regression test — form validation (`lib/validation/forms.test.ts`), slug generation (`lib/slugify.test.ts`), the Spotify/Substack duplicate-episode matching (`lib/media-utils.test.ts`), and which email a community applicant gets (`emails/CommunityApplicationConfirmation.test.ts`). No component or end-to-end tests yet — those are a separate, bigger investment (a real browser, a test database) that can be layered on later without touching this setup.

Anything that's pure logic but currently lives inside a file that imports `next/headers` or another server-only module (most `lib/queries/*.ts` files) isn't unit-testable as-is; the pattern going forward is to keep that kind of logic in its own plain module (like `lib/media-utils.ts`) and have the Supabase-dependent query function import it, rather than inlining it.

## CI

`.github/workflows/ci.yml` runs typecheck → lint → format check → test → build on every push/PR to `main`. The build step uses placeholder values for the Supabase/Resend env vars rather than real secrets — nothing at build time makes an authenticated call with them (the only external fetch during the build is the public Substack RSS feed, which needs no credentials). Add the real values as repository secrets instead if you want CI to double as a deploy-readiness check against the actual Supabase project.

## Deployment

Deployed on **Netlify**, connected directly to this GitHub repo — every push to `main` deploys to production, every PR gets a preview URL. Netlify's Next.js Runtime (`netlify.toml`) packages the app into its own serverless functions; the real environment variables (same list as `.env.example`, minus `SUPABASE_ACCESS_TOKEN`, which is CLI-only) live in Netlify's Project Settings → Environment Variables, not in a committed file.

A `Dockerfile` is also in the repo as a self-hosting option, but isn't part of this deployment path — Netlify's adapter expects the standard `.next` build output, which is why `next.config.ts` deliberately does _not_ set `output: "standalone"` (that flag is only for the Docker route; re-add it there first if the Dockerfile ever gets used for real).

## Notes

- **RLS is the real access boundary.** Every page-level `requireRole()`/`requireProfile()` check is a UX convenience — the Postgres Row Level Security policies in `supabase/migrations/0002_rls.sql` (and later migrations) are what actually enforce who can read or write what, independent of the app.
- **Spotify/Substack content is cached for 1 hour** (`lib/spotify.ts`, `lib/substack.ts`) before it reflects on the site — publish something on either platform and it shows up here automatically, just not instantly.
- **Cloudflare R2 buckets need public access enabled per-bucket via the dashboard**, not the API — see the `R2_PUBLIC_BASE_URL` row above.
