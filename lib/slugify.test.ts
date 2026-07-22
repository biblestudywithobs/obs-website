import { describe, expect, it } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(slugify("How to Read and Understand Your Bible")).toBe(
      "how-to-read-and-understand-your-bible",
    );
  });

  it("strips punctuation", () => {
    expect(slugify("Q&A: What Is Salvation?")).toBe("q-a-what-is-salvation");
  });

  it("collapses repeated separators into a single hyphen", () => {
    expect(slugify("Session   3a  --  Transcript")).toBe("session-3a-transcript");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  -- Hello World -- ")).toBe("hello-world");
  });

  it("keeps existing numbers", () => {
    expect(slugify("Part 14")).toBe("part-14");
  });

  it("returns an empty string for input with no alphanumeric characters", () => {
    expect(slugify("???")).toBe("");
  });
});
