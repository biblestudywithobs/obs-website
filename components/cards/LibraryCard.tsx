import Link from "next/link";
import type { LibraryResource } from "@/types/content";

// Resource-library card: a whole-card link with a gold thumbnail (or a real
// cover image, for Substack pieces), tag badge, title, excerpt, and a meta
// row (author/length + Read/Download call-to-action).
export function LibraryCard({ resource }: { resource: LibraryResource }) {
  const { tag, title, excerpt, meta, cta, href, imageUrl } = resource;
  const external = href.startsWith("http");

  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="border-line bg-cream hover:shadow-card-hover flex flex-col overflow-hidden rounded-[16px] border transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px]"
    >
      <div className="bg-gold relative flex aspect-[16/10] items-end p-4">
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <span className="bg-paper text-ink relative rounded-full px-[11px] py-[5px] text-[11px] font-bold tracking-[0.05em] uppercase">
          {tag}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-[22px] pt-5 pb-6">
        <h3 className="font-display text-[17.5px] leading-[1.3] font-semibold">{title}</h3>
        <p className="font-reading text-ink-muted flex-1 text-[13.5px] leading-[1.55]">{excerpt}</p>
        <div className="text-ink-muted mt-1 flex items-center justify-between text-[12px]">
          <span>{meta}</span>
          <span className="text-ink flex items-center gap-[5px] font-semibold">{cta}</span>
        </div>
      </div>
    </Link>
  );
}
