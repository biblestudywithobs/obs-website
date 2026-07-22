import Link from "next/link";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "dark";
export type ButtonSize = "md" | "sm";

// Shared button styles, extracted verbatim from the shipped `.btn-*` rules.
const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium leading-[1.2] transition-[background-color,color,transform,border-color] duration-200";

const sizes: Record<ButtonSize, string> = {
  md: "px-[22px] py-[11px] text-[14.5px]",
  sm: "px-[18px] py-[9px] text-[13.5px]",
};

const variants: Record<ButtonVariant, string> = {
  // Ink fill + paper text + hard gold-deep offset shadow + uppercase.
  // Hover lifts 2px up-left and grows the shadow to 5px.
  primary:
    "border border-ink bg-ink uppercase tracking-[0.06em] text-paper shadow-[3px_3px_0_var(--color-gold-deep)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-gold-deep)]",
  // Transparent + 1.4px ink border; hover fills ink with cream text.
  secondary: "border-[1.4px] border-ink text-ink hover:bg-ink hover:text-cream",
  // Ink fill + cream text (used on gold backgrounds); hover near-black.
  dark: "bg-ink text-cream hover:bg-black",
};

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

type AnchorProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type NativeButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

/**
 * Polymorphic button. Renders a Next.js `Link` when `href` is provided,
 * otherwise a native `<button>`.
 */
export function Button(props: AnchorProps | NativeButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, sizes[size], variants[variant], className);

  if (props.href !== undefined) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
