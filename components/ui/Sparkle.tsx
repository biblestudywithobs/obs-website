import { cn } from "@/lib/cn";

// The 4-point diamond "sparkle" from the logo O — a recurring illumination
// accent. Fill is driven by the `.sparkle` / `.sparkle.on-dark` rules in
// globals.css (gold-deep on light, gold on dark).
export function Sparkle({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <svg
      className={cn("sparkle", onDark && "on-dark", className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" />
    </svg>
  );
}
