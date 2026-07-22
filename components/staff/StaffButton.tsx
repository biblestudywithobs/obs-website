import Link from "next/link";
import { cn } from "@/lib/cn";

// Button styles scoped to the staff portal: slightly larger padding than the
// marketing site's Button, plus a `gold` variant and a real `disabled` state
// (used by locked onboarding modules) — ported verbatim from staff/index.html.
type Variant = "primary" | "secondary" | "gold";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-ui text-[14.5px] font-medium transition-[background-color,transform] duration-200";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-cream hover:-translate-y-px hover:bg-black",
  secondary: "border border-line bg-cream text-ink hover:bg-line",
  gold: "bg-gold text-ink hover:-translate-y-px hover:bg-gold-deep",
};

type CommonProps = { variant?: Variant; className?: string; children: React.ReactNode };

export function StaffButton(
  props: CommonProps &
    (
      | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className">)
      | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">)
    ),
) {
  const { variant = "primary", className, children } = props;
  const classes = cn(
    base,
    variants[variant],
    "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
    className,
  );

  if (props.href !== undefined) {
    const { href, variant: _v, className: _c, children: _ch, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, className: _c, children: _ch, ...rest } = props;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
