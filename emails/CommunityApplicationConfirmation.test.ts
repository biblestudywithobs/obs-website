import { describe, expect, it } from "vitest";
import { communityConfirmationSubject } from "./CommunityApplicationConfirmation";

describe("communityConfirmationSubject", () => {
  it("returns the volunteer subject for area=volunteer", () => {
    expect(communityConfirmationSubject("volunteer")).toBe(
      "Thank you for applying to volunteer with OBS",
    );
  });

  it("reuses the volunteer letter for internship applicants (no dedicated copy yet)", () => {
    expect(communityConfirmationSubject("internship")).toBe(
      "Thank you for applying to volunteer with OBS",
    );
  });

  it("reuses the volunteer letter for team applicants (no dedicated copy yet)", () => {
    expect(communityConfirmationSubject("team")).toBe(
      "Thank you for applying to volunteer with OBS",
    );
  });

  it("returns the Bible Study Partner subject for area=bible_study_partner", () => {
    expect(communityConfirmationSubject("bible_study_partner")).toBe(
      "Thank you for applying to the Bible Accountability Partner programme",
    );
  });

  it("returns the Community Group subject for area=community_group", () => {
    expect(communityConfirmationSubject("community_group")).toBe(
      "Thank you for applying to join an OBS Community Group",
    );
  });

  it("falls back to the volunteer subject for an unrecognized area", () => {
    expect(communityConfirmationSubject("something_unexpected")).toBe(
      "Thank you for applying to volunteer with OBS",
    );
  });
});
