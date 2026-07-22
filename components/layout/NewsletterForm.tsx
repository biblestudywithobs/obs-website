"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "done" | "error";

// Newsletter signup pill, submitting to /api/newsletter.
export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const website = (form.elements.namedItem("website") as HTMLInputElement).value;

    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = await res.json();
      setStatus(data.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-paper flex min-w-[380px] gap-[10px] rounded-full p-[6px] max-[980px]:w-full max-[980px]:min-w-0"
    >
      {/* Honeypot: hidden from real visitors, bots that autofill every field will trip it. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute h-0 w-0 opacity-0"
        aria-hidden="true"
      />
      <input
        type="email"
        name="email"
        required
        placeholder="you@example.com"
        aria-label="Email address"
        className="text-ink placeholder:text-ink-muted flex-1 bg-transparent px-4 py-[10px] text-[14.5px] focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-ink text-cream rounded-full px-[22px] py-[11px] text-[14.5px] font-medium whitespace-nowrap transition-colors hover:bg-black disabled:opacity-70"
      >
        {status === "done" ? "Subscribed ✓" : status === "error" ? "Try again" : "Subscribe"}
      </button>
    </form>
  );
}
