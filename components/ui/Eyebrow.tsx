import { cn } from "@/lib/cn";
import { Sparkle } from "./Sparkle";

// Uppercase section label ("A ministry of the Word", "Featured resources").
// Oxblood on light surfaces, gold on dark. Optionally leads with a sparkle.
export function Eyebrow({
  children,
  className,
  sparkle = true,
  onDark = false,
}: {
  children: React.ReactNode;
  className?: string;
  sparkle?: boolean;
  onDark?: boolean;
}) {
  return (
    <span
      className={cn(
        "text-eyebrow inline-flex items-center gap-2",
        onDark ? "text-gold" : "text-oxblood",
        className,
      )}
    >
      {sparkle && <Sparkle onDark={onDark} />}
      {children}
    </span>
  );
}
