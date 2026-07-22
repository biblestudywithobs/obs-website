"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "submitting" | "done" | "error";

// Contact form, submitting to /api/contact.
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
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
      <div className="border-line bg-cream text-ink rounded-[10px] border px-3.5 py-3 text-[13.5px]">
        Thanks — your message is on its way. We read everything and will get back to you soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Honeypot: hidden from real visitors, bots that autofill every field will trip it. */}
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
          Something went wrong sending your message. Please try again.
        </div>
      )}

      <div className="mb-[18px]">
        <label htmlFor="name" className="mb-[7px] block text-[12.5px] font-semibold">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Your full name"
          required
          className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        />
      </div>
      <div className="mb-[18px]">
        <label htmlFor="cemail" className="mb-[7px] block text-[12.5px] font-semibold">
          Email
        </label>
        <input
          type="email"
          id="cemail"
          name="email"
          placeholder="you@example.com"
          required
          className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        />
      </div>
      <div className="mb-[18px]">
        <label htmlFor="message" className="mb-[7px] block text-[12.5px] font-semibold">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="How can we help?"
          required
          className="border-line bg-paper font-ui focus:border-gold-deep min-h-[140px] w-full resize-y rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        />
      </div>
      <Button type="submit" disabled={status === "submitting"} className="mt-1.5">
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
