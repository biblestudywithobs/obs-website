import { XMLParser } from "fast-xml-parser";

const FEED_URL = "https://biblestudywithobs.substack.com/feed";

export type SubstackEpisode = {
  title: string;
  description: string;
  url: string;
  audioUrl: string;
  imageUrl: string | null;
  publishedAt: string;
};

export type SubstackArticle = {
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
};

type RssItem = {
  title?: string;
  description?: string;
  link?: string;
  pubDate?: string;
  enclosure?: { "@_url"?: string; "@_type"?: string };
  "content:encoded"?: string;
};

// Substack doesn't put per-episode cover art in <itunes:image> (only the
// show-level logo lives at the channel level) — the real cover is just the
// first inline image in the post body, so pull it out of content:encoded.
function firstImageUrl(html: string | undefined): string | null {
  if (!html) return null;
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
}

async function fetchFeedItems(): Promise<RssItem[]> {
  const res = await fetch(FEED_URL, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];

  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);

  const items: RssItem[] = parsed?.rss?.channel?.item ?? [];
  return Array.isArray(items) ? items : [items];
}

// Substack tags every real episode with an audio enclosure and every
// plain-text post with an image (cover) enclosure instead — filtering on
// enclosure type is how we separate the two without any manual curation.
export async function getSubstackEpisodes(): Promise<SubstackEpisode[]> {
  const list = await fetchFeedItems();

  return list
    .filter((item) => item.enclosure?.["@_type"]?.startsWith("audio/"))
    .map((item) => ({
      title: item.title ?? "",
      description: item.description ?? "",
      url: item.link ?? "",
      audioUrl: item.enclosure?.["@_url"] ?? "",
      imageUrl: firstImageUrl(item["content:encoded"]),
      publishedAt: item.pubDate ?? "",
    }));
}

// The written articles (everything that isn't a podcast episode) — shown
// alongside the CMS's own Articles on /resources under their own tab.
export async function getSubstackArticles(): Promise<SubstackArticle[]> {
  const list = await fetchFeedItems();

  return list
    .filter((item) => !item.enclosure?.["@_type"]?.startsWith("audio/"))
    .map((item) => ({
      title: item.title ?? "",
      description: item.description ?? "",
      url: item.link ?? "",
      imageUrl: item.enclosure?.["@_url"] ?? firstImageUrl(item["content:encoded"]),
      publishedAt: item.pubDate ?? "",
    }));
}
