import Link from "next/link";

// Compact footer used by every interior page (dark bar, copyright + a link
// back to the homepage). The homepage uses the full <SiteFooter> instead.
export function MinimalFooter() {
  return (
    <footer className="border-gold bg-ink text-cream border-t-[3px] border-double pt-12 pb-7">
      <div className="wrap text-cream/50 flex flex-wrap items-center justify-between gap-[14px] text-[12.5px]">
        <span>© 2026 Open Bible School. All rights reserved.</span>
        <Link href="/" className="text-cream/75 hover:text-gold transition-colors">
          Back to Homepage
        </Link>
      </div>
    </footer>
  );
}
