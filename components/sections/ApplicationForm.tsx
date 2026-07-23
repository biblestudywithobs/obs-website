"use client";

import { useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import type { applicationAreas } from "@/lib/validation/forms";

type Area = (typeof applicationAreas)[number];

type DetailField =
  | { kind: "select"; label: string; options: string[] }
  | { kind: "text"; label: string; placeholder?: string };

type Status = "idle" | "submitting" | "done" | "error";

const GENDER_OPTIONS = ["Male", "Female"];
const YES_NO_OPTIONS = ["Yes", "No"];
const BIBLE_STUDY_RATING_OPTIONS = ["Excellent", "Good", "Average", "Needs Improvement"];

// Shared application form used by each dedicated /community/* page. Submits
// to /api/community; `detailField` renders either a team/role select
// (Volunteer, Internships) or a free-text location field (Community Groups),
// stored server-side as role_detail / location respectively. `askGender`/
// `hoursOptions` are Volunteer-only extras (stored as gender/hours_per_week).
export function ApplicationForm({
  area,
  detailField,
  askGender = false,
  askLocation = false,
  askChurch = false,
  askWorkforce = false,
  askBibleStudyRating = false,
  askReadArticles = false,
  hoursOptions,
  messageLabel = "Anything you'd like us to know? (optional)",
  messagePlaceholder = "Tell us a bit about yourself",
  submitLabel = "Submit Application",
}: {
  area: Area;
  detailField?: DetailField;
  askGender?: boolean;
  askLocation?: boolean;
  askChurch?: boolean;
  askWorkforce?: boolean;
  askBibleStudyRating?: boolean;
  askReadArticles?: boolean;
  hoursOptions?: string[];
  messageLabel?: string;
  messagePlaceholder?: string;
  submitLabel?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          area,
          roleDetail: detailField?.kind === "select" ? data.get("detail") : "",
          location: detailField?.kind === "text" ? data.get("detail") : "",
          gender: askGender ? data.get("gender") : "",
          hoursPerWeek: hoursOptions ? data.get("hoursPerWeek") : "",
          state: askLocation ? data.get("state") : "",
          country: askLocation ? data.get("country") : "",
          church: askChurch ? data.get("church") : "",
          workforce: askWorkforce ? data.get("workforce") : "",
          bibleStudyRating: askBibleStudyRating ? data.get("bibleStudyRating") : "",
          readArticles: askReadArticles ? data.get("readArticles") : "",
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      const result = await res.json();
      if (result.ok) {
        setStatus("done");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="border-line bg-paper text-ink rounded-[10px] border px-3.5 py-3 text-[13.5px]">
        Thanks for applying — we review every application personally and will be in touch soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      {status === "error" && (
        <div className="border-oxblood/30 bg-oxblood/10 text-oxblood mb-[18px] rounded-[10px] border px-3.5 py-3 text-[13px]">
          Something went wrong submitting your application. Please try again.
        </div>
      )}

      <div className="mb-[18px]">
        <label htmlFor="apply-name" className="mb-[7px] block text-[12.5px] font-semibold">
          Name
        </label>
        <input
          type="text"
          id="apply-name"
          name="name"
          required
          placeholder="Your full name"
          className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        />
      </div>
      <div className="mb-[18px]">
        <label htmlFor="apply-email" className="mb-[7px] block text-[12.5px] font-semibold">
          Email
        </label>
        <input
          type="email"
          id="apply-email"
          name="email"
          required
          placeholder="you@example.com"
          className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        />
      </div>
      <div className="mb-[18px]">
        <label htmlFor="apply-phone" className="mb-[7px] block text-[12.5px] font-semibold">
          Phone number
        </label>
        <input
          type="tel"
          id="apply-phone"
          name="phone"
          required
          placeholder="e.g. +234 801 234 5678"
          className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        />
        <p className="text-ink-muted mt-1.5 text-[12px]">
          So we can reach you if you miss our email.
        </p>
      </div>

      {detailField && (
        <div className="mb-[18px]">
          <label htmlFor="apply-detail" className="mb-[7px] block text-[12.5px] font-semibold">
            {detailField.label}
          </label>
          {detailField.kind === "select" ? (
            <select
              id="apply-detail"
              name="detail"
              required
              className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
            >
              {detailField.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              id="apply-detail"
              name="detail"
              placeholder={detailField.placeholder}
              className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
            />
          )}
        </div>
      )}

      {askGender && (
        <div className="mb-[18px]">
          <label htmlFor="apply-gender" className="mb-[7px] block text-[12.5px] font-semibold">
            Gender
          </label>
          <select
            id="apply-gender"
            name="gender"
            required
            className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
          >
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}

      {askLocation && (
        <div className="mb-[18px] flex gap-3">
          <div className="flex-1">
            <label htmlFor="apply-state" className="mb-[7px] block text-[12.5px] font-semibold">
              State / Region
            </label>
            <input
              type="text"
              id="apply-state"
              name="state"
              required
              placeholder="e.g. Lagos"
              className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="apply-country" className="mb-[7px] block text-[12.5px] font-semibold">
              Country
            </label>
            <input
              type="text"
              id="apply-country"
              name="country"
              required
              placeholder="e.g. Nigeria"
              className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
            />
          </div>
        </div>
      )}

      {askChurch && (
        <div className="mb-[18px]">
          <label htmlFor="apply-church" className="mb-[7px] block text-[12.5px] font-semibold">
            What church do you attend?
          </label>
          <input
            type="text"
            id="apply-church"
            name="church"
            required
            placeholder="Name of your church"
            className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
          />
        </div>
      )}

      {askWorkforce && (
        <div className="mb-[18px]">
          <label htmlFor="apply-workforce" className="mb-[7px] block text-[12.5px] font-semibold">
            Are you part of the workforce?
          </label>
          <select
            id="apply-workforce"
            name="workforce"
            required
            className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
          >
            {YES_NO_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}

      {askBibleStudyRating && (
        <div className="mb-[18px]">
          <label
            htmlFor="apply-bible-rating"
            className="mb-[7px] block text-[12.5px] font-semibold"
          >
            How would you rate your Bible study and prayer life?
          </label>
          <select
            id="apply-bible-rating"
            name="bibleStudyRating"
            required
            className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
          >
            {BIBLE_STUDY_RATING_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}

      {askReadArticles && (
        <div className="mb-[18px]">
          <label
            htmlFor="apply-read-articles"
            className="mb-[7px] block text-[12.5px] font-semibold"
          >
            Have you read any of our articles?
          </label>
          <select
            id="apply-read-articles"
            name="readArticles"
            required
            className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
          >
            {YES_NO_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}

      {hoursOptions && (
        <div className="mb-[18px]">
          <label htmlFor="apply-hours" className="mb-[7px] block text-[12.5px] font-semibold">
            How many hours per week can you dedicate?
          </label>
          <select
            id="apply-hours"
            name="hoursPerWeek"
            required
            className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
          >
            {hoursOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-[22px]">
        <label htmlFor="apply-message" className="mb-[7px] block text-[12.5px] font-semibold">
          {messageLabel}
        </label>
        <textarea
          id="apply-message"
          name="message"
          placeholder={messagePlaceholder}
          className="border-line bg-paper font-ui focus:border-gold-deep min-h-[110px] w-full resize-y rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        />
      </div>

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting…" : submitLabel}
      </Button>
    </form>
  );
}

export function ApplicationPageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-9 text-center">
      <Eyebrow sparkle={false}>{eyebrow}</Eyebrow>
      <h1 className="font-display mt-4 text-[clamp(30px,4vw,42px)] font-semibold tracking-[-0.01em]">
        {title}
      </h1>
      <p className="font-reading text-ink-muted mx-auto mt-3 max-w-[52ch] text-[16px] leading-[1.6]">
        {description}
      </p>
    </div>
  );
}
