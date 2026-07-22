import { getSpotifyEpisodes, type SpotifyEpisode } from "@/lib/spotify";
import { getSubstackEpisodes, type SubstackEpisode } from "@/lib/substack";
import { formatDuration, stripHtml, isSameEpisode } from "@/lib/media-utils";

export type MediaItem = {
  title: string;
  subtitle: string;
  duration: string;
  imageUrl: string | null;
  publishedAt: string;
  /** "both" means the same episode is on Spotify and Substack — the card
   * asks the visitor which one to open rather than picking for them. */
  source: "spotify" | "substack" | "both";
  spotifyUrl: string | null;
  substackUrl: string | null;
};

// Live feed from the two places OBS actually publishes audio — no admin
// entry involved, so there's nothing here that can drift out of date. The
// same episode usually goes out on both platforms within a day of itself,
// so those get merged into one "both" card instead of showing twice.
export async function listMediaItems(): Promise<MediaItem[]> {
  const [spotifyEpisodes, substackEpisodes] = await Promise.all([
    getSpotifyEpisodes(),
    getSubstackEpisodes(),
  ]);

  const unmatchedSpotify = [...spotifyEpisodes];
  const unmatchedSubstack = [...substackEpisodes];
  const merged: MediaItem[] = [];

  for (const sp of [...spotifyEpisodes]) {
    const matchIndex = unmatchedSubstack.findIndex((ss) =>
      isSameEpisode(sp.releaseDate, sp.title, ss.publishedAt, ss.title),
    );
    if (matchIndex === -1) continue;

    const ss = unmatchedSubstack[matchIndex];
    unmatchedSubstack.splice(matchIndex, 1);
    unmatchedSpotify.splice(unmatchedSpotify.indexOf(sp), 1);

    merged.push({
      title: sp.title,
      subtitle: stripHtml(sp.description).slice(0, 90),
      duration: formatDuration(sp.durationMs),
      imageUrl: sp.imageUrl ?? ss.imageUrl,
      publishedAt: sp.releaseDate,
      source: "both",
      spotifyUrl: sp.url,
      substackUrl: ss.url,
    });
  }

  const spotifyOnly: MediaItem[] = unmatchedSpotify.map((ep: SpotifyEpisode) => ({
    title: ep.title,
    subtitle: stripHtml(ep.description).slice(0, 90),
    duration: formatDuration(ep.durationMs),
    imageUrl: ep.imageUrl,
    publishedAt: ep.releaseDate,
    source: "spotify",
    spotifyUrl: ep.url,
    substackUrl: null,
  }));

  const substackOnly: MediaItem[] = unmatchedSubstack.map((ep: SubstackEpisode) => ({
    title: ep.title,
    subtitle: stripHtml(ep.description).slice(0, 90),
    duration: "",
    imageUrl: ep.imageUrl,
    publishedAt: ep.publishedAt,
    source: "substack",
    spotifyUrl: null,
    substackUrl: ep.url,
  }));

  return [...merged, ...spotifyOnly, ...substackOnly].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}
