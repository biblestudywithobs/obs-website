import sanitizeHtml from "sanitize-html";

// Allowlist matches exactly what the Tiptap editor (RichTextEditor.tsx) can
// produce: paragraphs, h1-3, blockquote, bold/italic, lists, links, images.
// No jsdom involved (unlike isomorphic-dompurify) — that dependency chain
// broke Netlify's serverless bundling via a CJS/ESM interop bug in
// html-encoding-sniffer.
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "h1",
      "h2",
      "h3",
      "blockquote",
      "strong",
      "em",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "br",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}

// Tiptap's "empty" document isn't an empty string — it's `<p></p>` (or a
// few blank paragraphs/whitespace). Treating that as real content means an
// untouched editor silently overwrites a null/"nothing written yet" state
// with a blank paragraph every time the surrounding form is saved.
export function isBlankHtml(html: string | null | undefined): boolean {
  if (!html) return true;
  return html.replace(/<[^>]*>/g, "").trim() === "";
}
