import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

// Stacked section heading used across interior pages: eyebrow above an H2,
// with an optional description. `onDark` switches to gold eyebrow + cream H2
// (used on dark sections like the Statement of Faith).
export function SectionHead({
  eyebrow,
  title,
  description,
  onDark = false,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mb-11 max-w-[60ch]", className)}>
      <Eyebrow sparkle={false} onDark={onDark}>
        {eyebrow}
      </Eyebrow>
      <h2
        className={cn(
          "font-display mt-3 text-[clamp(28px,3vw,36px)] leading-[1.1] font-semibold tracking-[-0.01em]",
          onDark && "text-cream",
        )}
      >
        {title}
      </h2>
      {description && <p className="font-reading text-ink-muted mt-2.5">{description}</p>}
    </div>
  );
}
