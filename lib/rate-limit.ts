// Minimal in-memory rate limiter for public form endpoints. Deliberately
// simple: resets on server restart and isn't shared across serverless
// instances, so it's a basic deterrent, not a hard guarantee. If this site
// ever sees real abuse or runs on multiple instances, swap this for a shared
// store (e.g. Upstash Redis) — the call site (`isRateLimited`) stays the same.
const hits = new Map<string, number[]>();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return false;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}
