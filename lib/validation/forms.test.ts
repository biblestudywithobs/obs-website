import { describe, expect, it } from "vitest";
import { newsletterSchema, contactSchema, communitySchema } from "./forms";

describe("newsletterSchema", () => {
  it("accepts a valid email with an empty honeypot", () => {
    const result = newsletterSchema.safeParse({ email: "reader@example.com", website: "" });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = newsletterSchema.safeParse({ email: "not-an-email", website: "" });
    expect(result.success).toBe(false);
  });

  it("still passes validation when the honeypot is filled in (bots get a fake success later, not rejected here)", () => {
    const result = newsletterSchema.safeParse({
      email: "reader@example.com",
      website: "bot-filled-this",
    });
    expect(result.success).toBe(true);
  });
});

describe("contactSchema", () => {
  const base = { name: "Jane", email: "jane@example.com", message: "Hello", website: "" };

  it("accepts a fully filled-in form", () => {
    expect(contactSchema.safeParse(base).success).toBe(true);
  });

  it("rejects a blank name", () => {
    expect(contactSchema.safeParse({ ...base, name: "" }).success).toBe(false);
  });

  it("rejects a blank message", () => {
    expect(contactSchema.safeParse({ ...base, message: "" }).success).toBe(false);
  });

  it("rejects a message over 5000 characters", () => {
    expect(contactSchema.safeParse({ ...base, message: "a".repeat(5001) }).success).toBe(false);
  });
});

describe("communitySchema", () => {
  const base = {
    name: "Jane",
    email: "jane@example.com",
    phone: "+234 801 234 5678",
    area: "volunteer",
    website: "",
  };

  it("accepts the minimum required fields", () => {
    expect(communitySchema.safeParse(base).success).toBe(true);
  });

  it("accepts international phone formats with spaces and separators", () => {
    expect(communitySchema.safeParse({ ...base, phone: "(234) 801-234-5678" }).success).toBe(true);
  });

  it("rejects a phone number with letters", () => {
    expect(communitySchema.safeParse({ ...base, phone: "call me maybe" }).success).toBe(false);
  });

  it("rejects a phone number shorter than 7 characters", () => {
    expect(communitySchema.safeParse({ ...base, phone: "12345" }).success).toBe(false);
  });

  it("rejects an area outside the known list", () => {
    expect(communitySchema.safeParse({ ...base, area: "not_a_real_area" }).success).toBe(false);
  });

  it("accepts the volunteer-only gender and hoursPerWeek fields", () => {
    const result = communitySchema.safeParse({
      ...base,
      gender: "Female",
      hoursPerWeek: "4 hours/week",
    });
    expect(result.success).toBe(true);
  });

  it("accepts every area missing gender/hoursPerWeek/roleDetail/location (all optional)", () => {
    expect(communitySchema.safeParse(base).success).toBe(true);
  });
});
