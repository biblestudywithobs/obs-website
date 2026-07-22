// Server-only: runs HogQL queries against PostHog's Query API using the
// personal API key (read scope). Never import this from client code — the
// key must not reach the browser, unlike the public NEXT_PUBLIC_POSTHOG_KEY
// used for event capture.
export async function runHogQLQuery(query: string): Promise<unknown[][]> {
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;

  if (!host || !projectId || !apiKey) return [];

  const res = await fetch(`${host}/api/projects/${projectId}/query/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
    cache: "no-store",
  });

  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data.results) ? data.results : [];
}
