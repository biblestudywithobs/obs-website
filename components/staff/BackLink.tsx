import Link from "next/link";

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-ink-muted hover:text-ink flex items-center gap-1.5 text-[13px] font-semibold"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M9 2L3 7l6 5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {children}
    </Link>
  );
}
