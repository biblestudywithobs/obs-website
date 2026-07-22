"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

// Underlined tab strip. Tracks the active tab and (optionally) reports changes.
// On the homepage it is purely cosmetic — matching the prototype, where the
// tab click only moved the underline and did not swap content.
export function Tabs({
  labels,
  initial = 0,
  onChange,
  className,
}: {
  labels: string[];
  initial?: number;
  onChange?: (index: number) => void;
  className?: string;
}) {
  const [active, setActive] = useState(initial);

  return (
    <div className={cn("border-line flex gap-2 border-b", className)}>
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => {
            setActive(i);
            onChange?.(i);
          }}
          className={cn(
            "font-ui relative mr-[26px] px-1 py-3 text-[14.5px] font-semibold transition-colors",
            i === active
              ? "text-ink after:bg-gold-deep after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:content-['']"
              : "text-ink-muted",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
