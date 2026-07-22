import Link from "next/link";
import { Brandmark } from "@/components/ui/Brandmark";
import { footerNav } from "@/lib/site-nav";

// Dark site footer: brand blurb + four link columns + bottom bar.
// Ink background, double gold top border, cream text at varying opacities.
export function SiteFooter() {
  return (
    <footer className="border-gold bg-ink text-cream border-t-[3px] border-double pt-20 pb-8">
      <div className="wrap">
        <div className="border-cream/15 grid grid-cols-[1.4fr_1fr_1fr_1fr_1.1fr] gap-10 border-b pb-[60px] max-[980px]:grid-cols-2 max-[560px]:grid-cols-1">
          <div>
            <Brandmark onGold className="text-cream" />
            <p className="font-reading text-cream/60 mt-4 max-w-[30ch] text-[14px] leading-[1.6]">
              A Bible teaching ministry helping people understand Scripture in a simple, clear, and
              faithful way.
            </p>
          </div>

          {footerNav.map((col) => (
            <div key={col.heading}>
              <h5 className="text-cream/50 mb-4 text-[12px] font-bold tracking-[0.07em] uppercase">
                {col.heading}
              </h5>
              <ul className="flex flex-col gap-[11px]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-cream/85 hover:text-gold text-[14px] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-cream/45 flex flex-wrap items-center justify-between gap-[14px] pt-7 text-[12.5px]">
          <span>© 2026 Open Bible School. All rights reserved.</span>
          <div className="flex gap-[18px]">
            <a
              href="https://www.instagram.com/openbibleschool/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.youtube.com/@studywithOBS"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              YouTube
            </a>
            <a
              href="https://open.spotify.com/show/0G6DSKiA0fA6UYcxpEOcCl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              Spotify
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
