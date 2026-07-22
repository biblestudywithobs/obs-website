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
