import { describe, expect, it } from "vitest";
import { formatDuration, stripHtml, titleSimilarity, isSameEpisode } from "./media-utils";

describe("formatDuration", () => {
  it("formats under an hour as m:ss", () => {
    expect(formatDuration(1257339)).toBe("20:57");
  });

  it("pads seconds under 10", () => {
    expect(formatDuration(65_000)).toBe("1:05");
  });

  it("formats an hour or more as h:mm:ss", () => {
    expect(formatDuration(24_815_744)).toBe("6:53:36");
  });
});

describe("stripHtml", () => {
  it("removes tags and collapses whitespace", () => {
    expect(stripHtml("<p>Hello   <b>world</b></p>\n\n")).toBe("Hello world");
  });

  it("returns an empty string for empty input", () => {
    expect(stripHtml("")).toBe("");
  });
});

describe("titleSimilarity", () => {
  // Real title pairs from the actual OBS Substack/Spotify feeds — this is
  // exactly the case the dedup matching exists to handle: the same episode,
  // titled slightly differently on each platform.
  it("scores near-identical titles (differing only by roman numeral vs digit) as a full match", () => {
    expect(
      titleSimilarity("You Asked. We Answered—Part 2", "You asked. We Answered - Part II"),
    ).toBe(1);
  });

  it("scores identical titles as a full match", () => {
    expect(
      titleSimilarity("What really happens when you pray?", "What really happens when you pray?"),
    ).toBe(1);
  });

  it("scores unrelated titles far below the match threshold", () => {
    const score = titleSimilarity(
      "Is the Bible Really True? A Defence for Scripture",
      "Burn with the Zeal of God 🔥",
    );
    expect(score).toBeLessThan(0.6);
  });

  it("ignores emoji and punctuation differences", () => {
    expect(titleSimilarity("Adventures in Prayer I🔥🔥", "Adventures in Prayer I")).toBe(1);
  });
});

describe("isSameEpisode", () => {
  it("matches same-day episodes with a similar title", () => {
    expect(
      isSameEpisode(
        "2026-06-09",
        "You Asked. We Answered—Part 2",
        "2026-06-09T06:02:11.000Z",
        "You asked. We Answered - Part II",
      ),
    ).toBe(true);
  });

  it("matches episodes published a day apart", () => {
    expect(
      isSameEpisode("2026-04-13", "Streams of Joy Part 2", "2026-04-14", "Streams of Joy Part 2"),
    ).toBe(true);
  });

  it("does not match episodes more than a day apart even with an identical title", () => {
    expect(isSameEpisode("2026-04-13", "Streams of Joy", "2026-04-20", "Streams of Joy")).toBe(
      false,
    );
  });

  it("does not match same-day episodes with unrelated titles", () => {
    expect(
      isSameEpisode("2026-05-08", "Word of the Week - Servant", "2026-05-08", "Session 2"),
    ).toBe(false);
  });
});
