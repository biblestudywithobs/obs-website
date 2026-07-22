// Pure helpers behind the Media page's Spotify/Substack merge — split out
// from lib/queries/public-media.ts so this logic (especially the duplicate-
// episode matching) can be unit tested without needing the Spotify/Substack
// network calls or a Next.js runtime.

export function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0)
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function toDayCount(iso: string): number {
  return Math.floor(new Date(iso).getTime() / 86_400_000);
}

const ROMAN_NUMERALS: Record<string, string> = { i: "1", ii: "2", iii: "3", iv: "4", v: "5" };

// Loose word-overlap similarity — good enough to tell "You Asked. We
// Answered—Part 2" (Substack) and "You asked. We Answered - Part II"
// (Spotify) apart from two genuinely unrelated episodes, without needing a
// real fuzzy-matching library for a handful of titles a week.
export function titleSimilarity(a: string, b: string): number {
  const normalize = (title: string) =>
    new Set(
      title
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => ROMAN_NUMERALS[word] ?? word),
    );
  const wordsA = normalize(a);
  const wordsB = normalize(b);
  const intersection = [...wordsA].filter((w) => wordsB.has(w)).length;
  const union = new Set([...wordsA, ...wordsB]).size;
  return union === 0 ? 0 : intersection / union;
}

// Same-day-or-adjacent + high title similarity = the same episode
// published on both platforms.
export function isSameEpisode(
  dateA: string,
  titleA: string,
  dateB: string,
  titleB: string,
): boolean {
  return (
    Math.abs(toDayCount(dateA) - toDayCount(dateB)) <= 1 && titleSimilarity(titleA, titleB) >= 0.6
  );
}
