"use client";

import { useState } from "react";

// Circular "share" icon button used on reading-plan cards and article pages.
// Uses the native Web Share sheet on mobile/supporting browsers; falls back
// to copying the current page URL to the clipboard everywhere else.
export function ShareButton({
  label = "Share",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled the share sheet — not an error.
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={handleShare}
      className={`border-line hover:border-gold-deep relative flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border transition-colors ${className}`}
    >
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
        <path
          d="M6 10a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM14 3a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM14 12a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"
          stroke="#2B2420"
          strokeWidth="1.3"
        />
        <path d="M8.2 11.4l5.6-3.4M8.2 13.6l5.6 3.4" stroke="#2B2420" strokeWidth="1.3" />
      </svg>
      {copied && (
        <span className="bg-ink text-cream absolute -top-9 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap">
          Link copied
        </span>
      )}
    </button>
  );
}
