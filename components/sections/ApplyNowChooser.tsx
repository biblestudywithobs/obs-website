"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// "Apply Now" on the community page's bottom CTA — asks which path fits
// before sending them on, rather than guessing for them.
export function ApplyNowChooser() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Apply Now
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-[rgba(26,26,26,0.45)] p-6"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="border-line bg-paper w-full max-w-[380px] rounded-[18px] border p-7 text-left"
          >
            <h4 className="font-display text-ink mb-1.5 text-[19px] leading-[1.3] font-semibold">
              Apply Now
            </h4>
            <p className="text-ink-muted mb-6 text-[13.5px]">Which would you like to apply for?</p>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/community/volunteer"
                onClick={() => setOpen(false)}
                className="bg-gold text-ink hover:bg-gold-deep rounded-full px-5 py-3 text-center text-[14px] font-semibold transition-colors"
              >
                Volunteer
              </Link>
              <Link
                href="/community/internships"
                onClick={() => setOpen(false)}
                className="border-ink text-ink hover:bg-ink hover:text-cream rounded-full border px-5 py-3 text-center text-[14px] font-semibold transition-colors"
              >
                Internships
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-ink-muted hover:text-ink mt-5 w-full text-center text-[12.5px] font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
