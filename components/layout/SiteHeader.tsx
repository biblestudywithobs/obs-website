"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { primaryNav } from "@/lib/site-nav";
import { Brandmark } from "@/components/ui/Brandmark";
import { Button } from "@/components/ui/Button";

// Sticky public-site header with the primary nav and a mobile drawer.
// Ports the vanilla-JS drawer behaviour (open/close, body scroll lock,
// close-on-link, Escape to close) from index.html into React state.
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  // Lock body scroll while the drawer is open (was `body.drawer-open`).
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape closes the drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="border-ink sticky top-0 z-[100] border-b-[3px] border-double bg-[rgba(244,233,214,0.94)] backdrop-blur-[2px]">
        <div className="wrap flex h-[76px] items-center justify-between">
          <Brandmark />

          <nav aria-label="Primary" className="max-[1180px]:hidden">
            <ul className="flex flex-nowrap gap-[24px] text-[14px] font-medium whitespace-nowrap">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="after:bg-gold-deep relative py-1.5 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:transition-transform after:duration-[250ms] after:content-[''] hover:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-[22px]">
            <Link
              href="/resources"
              className="text-[14.5px] font-medium whitespace-nowrap max-[1180px]:hidden"
            >
              Explore Resources
            </Link>
            <Button
              type="button"
              onClick={() => setJoinOpen(true)}
              className="max-[1180px]:hidden"
            >
              Join OBS
            </Button>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobileDrawer"
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "border-line hidden h-[38px] w-[38px] items-center justify-center rounded-[8px] border transition-colors max-[1180px]:flex",
                open && "border-ink",
              )}
            >
              {open ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 1L15 15M15 1L1 15" stroke="#2B2420" strokeWidth="1.6" />
                </svg>
              ) : (
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                  <path d="M0 1H18M0 7H18M0 13H18" stroke="#2B2420" strokeWidth="1.6" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Scrim */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-[190] bg-[rgba(26,26,26,0.45)] transition-opacity duration-[250ms]",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Drawer */}
      <nav
        id="mobileDrawer"
        aria-label="Mobile navigation"
        className={cn(
          "border-line bg-paper fixed top-0 right-0 z-[200] flex h-full w-[min(320px,82vw)] flex-col border-l px-8 pt-[100px] pb-8 transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <ul className="flex flex-col gap-1">
          {primaryNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-line font-display block border-b py-3 text-[21px] font-medium"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3">
          <Button
            href="/resources"
            variant="secondary"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            Explore Resources
          </Button>
          <Button
            type="button"
            className="w-full"
            onClick={() => {
              setOpen(false);
              setJoinOpen(true);
            }}
          >
            Join OBS
          </Button>
        </div>
      </nav>

      {/* "Join OBS" chooser — subscribe to the newsletter, or head to the
          community page. Works from any page, not just the homepage. */}
      {joinOpen && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-[rgba(26,26,26,0.45)] p-6"
          onClick={() => setJoinOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="border-line bg-paper w-full max-w-[380px] rounded-[18px] border p-7"
          >
            <h4 className="font-display mb-1.5 text-[19px] leading-[1.3] font-semibold">
              Join OBS
            </h4>
            <p className="text-ink-muted mb-6 text-[13.5px]">How would you like to get started?</p>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/#join"
                onClick={() => setJoinOpen(false)}
                className="bg-gold text-ink hover:bg-gold-deep rounded-full px-5 py-3 text-center text-[14px] font-semibold transition-colors"
              >
                Subscribe to the newsletter
              </Link>
              <Link
                href="/community"
                onClick={() => setJoinOpen(false)}
                className="border-ink text-ink hover:bg-ink hover:text-cream rounded-full border px-5 py-3 text-center text-[14px] font-semibold transition-colors"
              >
                Join our community
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setJoinOpen(false)}
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
