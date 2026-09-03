// OBS's own Spotify show: https://open.spotify.com/show/0G6DSKiA0fA6UYcxpEOcCl
const SHOW_ID = "0G6DSKiA0fA6UYcxpEOcCl";

export type SpotifyEpisode = {
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  durationMs: number;
  releaseDate: string;
};

// Client Credentials flow — this only ever reads public show/episode data,
// no user auth involved, so a single app-level token (reused until close to
// expiry) is all that's needed. Cached via Next's fetch Data Cache rather
// than a module-level variable: on serverless (Netlify Functions), each
// cold invocation gets a fresh module scope, so an in-memory cache is a
// no-op most of the time and this endpoint was being re-hit on every cold
// start — the Data Cache persists across invocations and actually saves
// the round trip.
async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
    // Spotify client-credentials tokens are valid for 3600s — cache just
    // under that so a fresh one is fetched before the old one expires.
    next: { revalidate: 3300 },
  });
  if (!res.ok) return null;

  const data = await res.json();
  return data.access_token as string;
}

// Returns [] (rather than throwing) if Spotify isn't configured yet or the
// API call fails — the Media page just shows whatever source is available.
export async function getSpotifyEpisodes(): Promise<SpotifyEpisode[]> {
  const token = await getAccessToken();
  if (!token) return [];

  const res = await fetch(
    `https://api.spotify.com/v1/shows/${SHOW_ID}/episodes?market=US&limit=50`,
    { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 3600 } },
  );
  if (!res.ok) return [];

  const data = await res.json();
  return (data.items ?? []).map(
    (ep: {
      name: string;
      description: string;
      external_urls: { spotify: string };
      images?: { url: string }[];
      duration_ms: number;
      release_date: string;
    }) => ({
      title: ep.name,
      description: ep.description,
      url: ep.external_urls.spotify,
      imageUrl: ep.images?.[0]?.url ?? null,
      durationMs: ep.duration_ms,
      releaseDate: ep.release_date,
    }),
  );
}
