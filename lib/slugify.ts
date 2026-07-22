// Shared by every admin save action (events, reading plans, resources,
// class sessions) as the fallback when an editor leaves the slug field
// blank.
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
