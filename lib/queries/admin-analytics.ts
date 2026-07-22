import { runHogQLQuery } from "@/lib/posthog-query";

export type AnalyticsOverview = {
  totalPageviews: number;
  trend: { direction: "up" | "down"; percent: number } | null;
  uniqueVisitors: number;
  topPages: { path: string; views: number }[];
  dailyCounts: { day: string; views: number }[];
  available: boolean;
};

function toNumber(v: unknown): number {
  return typeof v === "number" ? v : Number(v ?? 0);
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  const [thisPeriod, lastPeriod, visitors, topPages, daily] = await Promise.all([
    runHogQLQuery(
      `SELECT count() FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY`,
    ),
    runHogQLQuery(
      `SELECT count() FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 60 DAY AND timestamp < now() - INTERVAL 30 DAY`,
    ),
    runHogQLQuery(
      `SELECT count(DISTINCT person_id) FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY`,
    ),
    runHogQLQuery(
      `SELECT properties.$pathname AS path, count() AS views FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY GROUP BY path ORDER BY views DESC LIMIT 8`,
    ),
    runHogQLQuery(
      `SELECT toDate(timestamp) AS day, count() AS views FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 14 DAY GROUP BY day ORDER BY day`,
    ),
  ]);

  // An empty array from every query (rather than [[0]]) means the request
  // itself failed (missing/invalid credentials, network issue) — surface
  // that distinctly from "zero traffic so far".
  const available = [thisPeriod, lastPeriod, visitors].every((r) => r.length > 0);

  const total = toNumber(thisPeriod[0]?.[0]);
  const previous = toNumber(lastPeriod[0]?.[0]);

  let trend: AnalyticsOverview["trend"] = null;
  if (available && (total > 0 || previous > 0)) {
    const direction = total >= previous ? "up" : "down";
    const percent =
      previous === 0 ? 100 : Math.round((Math.abs(total - previous) / previous) * 100);
    trend = { direction, percent };
  }

  return {
    totalPageviews: total,
    trend,
    uniqueVisitors: toNumber(visitors[0]?.[0]),
    topPages: topPages
      .map((row) => ({ path: String(row[0] ?? "(unknown)"), views: toNumber(row[1]) }))
      .filter((p) => p.path !== "null"),
    dailyCounts: daily.map((row) => ({ day: String(row[0]), views: toNumber(row[1]) })),
    available,
  };
}
