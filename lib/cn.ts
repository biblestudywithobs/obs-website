/** Tiny classname joiner — filters out falsy values, joins the rest. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
