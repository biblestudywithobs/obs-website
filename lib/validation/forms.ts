import { z } from "zod";

// `website` is a honeypot: a field real visitors never see or fill (hidden
// via CSS), but form-filling bots typically populate every input. Deliberately
// accepts any value here (rather than rejecting non-empty ones) — the route
// handlers check it explicitly and fake a success response for bot traffic,
// which only works if validation lets the value through in the first place.
const honeypot = z.string().max(200).optional().or(z.literal(""));

export const newsletterSchema = z.object({
  email: z.string().trim().email().max(320),
  website: honeypot,
});

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(1).max(5000),
  website: honeypot,
});

export const applicationAreas = [
  "volunteer",
  "bible_study_partner",
  "internship",
  "community_group",
  "team",
] as const;

export const communitySchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  // Loose on purpose — permits international formats, spaces, and
  // separators rather than enforcing a single strict pattern.
  phone: z
    .string()
    .trim()
    .min(7)
    .max(30)
    .regex(/^[0-9+\-().\s]+$/, "Enter a valid phone number"),
  area: z.enum(applicationAreas),
  // The specific team/role (Volunteer, Internships) chosen within an area.
  roleDetail: z.string().trim().max(200).optional().or(z.literal("")),
  // Free-text location (Community Groups only).
  location: z.string().trim().max(200).optional().or(z.literal("")),
  // Volunteer-only.
  gender: z.string().trim().max(50).optional().or(z.literal("")),
  hoursPerWeek: z.string().trim().max(50).optional().or(z.literal("")),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  website: honeypot,
});
