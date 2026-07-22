"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

// Single-open FAQ accordion (opening one closes the rest), ported from the
// vanilla toggle in OBS-Contact.html. First item open by default.
export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="border-line border-b">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="font-display flex w-full items-center justify-between gap-4 py-5 text-left text-[16.5px] font-semibold"
            >
              {item.q}
              <span
                className={cn(
                  "text-gold-deep shrink-0 text-[20px] font-normal transition-transform duration-200",
                  isOpen && "rotate-45",
                )}
              >
                +
              </span>
            </button>
            <div
              className={cn(
                "overflow-hidden transition-[max-height] duration-[250ms]",
                isOpen ? "max-h-[200px]" : "max-h-0",
              )}
            >
              <p className="font-reading text-ink-muted max-w-[64ch] pb-5 text-[14.5px] leading-[1.65]">
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
