import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

// Logo lockup. The 40x40 mark image contains the wordmark, matching the
// shipped header. `onGold` adds the gold backing used in the footer.
export function Brandmark({ className, onGold = false }: { className?: string; onGold?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Open Bible School — home"
      className={cn(
        "font-display inline-flex items-center gap-[10px] text-[22px] font-bold tracking-[-0.01em]",
        className,
      )}
    >
      <span
        className={cn(
          "block h-10 w-10 shrink-0 overflow-hidden rounded-[9px]",
          onGold && "bg-gold",
        )}
      >
        <Image
          src="/logo.jpg"
          alt="Open Bible School"
          width={40}
          height={40}
          className="h-full w-full object-cover"
          priority
        />
      </span>
    </Link>
  );
}
