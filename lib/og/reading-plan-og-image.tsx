import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

// Collapses to single-line-flowing text (excerpts are often typed as
// multiple \r\n-separated paragraphs, which satori doesn't fold into
// spaces on its own — left as-is, "paragraph one.\r\n\r\nParagraph two"
// renders as "paragraph one.Paragraph two") then trims to a max length on
// a word boundary, since satori has no CSS line-clamp/text-overflow to
// fall back on.
function truncate(text: string, max: number): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  return flat.slice(0, flat.lastIndexOf(" ", max)).trimEnd() + "…";
}

let logoDataUrl: string | null = null;
async function getLogoDataUrl(): Promise<string> {
  if (!logoDataUrl) {
    const buffer = await readFile(join(process.cwd(), "public/logo.jpg"));
    logoDataUrl = `data:image/jpeg;base64,${buffer.toString("base64")}`;
  }
  return logoDataUrl;
}

export async function renderReadingPlanOgImage(plan: {
  title: string;
  excerpt: string;
  imageUrl: string | null;
  category: string;
  planType: "reading_plan" | "commentary";
  status: "draft" | "in_review" | "published";
}) {
  const logo = await getLogoDataUrl();
  const isPublished = plan.status === "published";
  const kindLabel = plan.planType === "commentary" ? "Commentary" : "Reading Plan";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#2B2420",
          fontFamily: "sans-serif",
        }}
      >
        {/* Cover photo when the plan has one — plain brand-dark ground
            otherwise (no image is used as a "watermark": the source JPEG
            has no alpha channel, so faded-down it just reads as a washed-out
            rectangle rather than a subtle mark). */}
        {plan.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={plan.imageUrl}
            alt=""
            width={OG_IMAGE_SIZE.width}
            height={OG_IMAGE_SIZE.height}
            style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
          />
        )}

        {/* Legibility scrim over the cover image (or plain dark ground) —
            explicit top/left/right/bottom, not the `inset` shorthand: satori
            doesn't support `inset`, so a shorthand-only absolutely
            positioned div (no width/height of its own) silently collapses
            to zero size and never paints. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            background:
              "linear-gradient(to top, rgba(20,15,10,0.95) 0%, rgba(20,15,10,0.88) 40%, rgba(20,15,10,0.4) 72%, rgba(20,15,10,0.05) 100%)",
          }}
        />

        {/* Status badge */}
        <div
          style={{
            position: "absolute",
            top: 44,
            right: 48,
            display: "flex",
            alignItems: "center",
            padding: "12px 24px",
            borderRadius: 999,
            background: isPublished ? "#FEBE52" : "#D9C7A0",
            color: "#2B2420",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {isPublished ? "Published" : "Preview"}
        </div>

        {/* Wordmark, top-left */}
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 56,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" width={48} height={48} style={{ borderRadius: 10 }} />
          <div style={{ display: "flex", fontSize: 24, fontWeight: 700, color: "#F9ECC9" }}>
            Open Bible School
          </div>
        </div>

        {/* Title + excerpt block */}
        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            bottom: 56,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              color: "#FEBE52",
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 18,
            }}
          >
            {kindLabel} · {plan.category}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 700,
              color: "#FBF4E4",
              lineHeight: 1.15,
            }}
          >
            {truncate(plan.title, 90)}
          </div>
          {plan.excerpt && (
            <div
              style={{
                display: "flex",
                fontSize: 27,
                fontWeight: 400,
                color: "rgba(251,244,228,0.82)",
                marginTop: 20,
                lineHeight: 1.4,
              }}
            >
              {truncate(plan.excerpt, 140)}
            </div>
          )}
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE },
  );
}
