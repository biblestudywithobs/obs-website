# Not currently used for deployment (deploying to Netlify instead) — kept
# as a self-hosting option for later. Requires `output: "standalone"` back
# in next.config.ts (currently removed, since Netlify's adapter needs the
# standard build output instead) or the builder stage below won't produce
# a .next/standalone directory to copy from.
#
# Multi-stage build — the final image only contains the standalone output,
# not the full node_modules or source tree, so it stays small.

FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Real Supabase/Resend values aren't needed here — same reasoning as CI:
# nothing at build time makes an authenticated call with them.
ENV NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=placeholder
ENV SUPABASE_SERVICE_ROLE_KEY=placeholder
ENV RESEND_API_KEY=placeholder
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
