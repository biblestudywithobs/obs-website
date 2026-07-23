import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { ShareButton } from "@/components/ui/ShareButton";
import { getPublishedResourceBySlug } from "@/lib/queries/public-resources";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedResourceBySlug(slug);
  if (!article) return { title: "Open Bible School" };

  const title = `${article.title} — Open Bible School`;
  const description = article.excerpt || undefined;

  return {
    title,
    description,
    openGraph: { title, description, url: `/articles/${slug}`, type: "article" },
    twitter: { title, description },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedResourceBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <main className="flex-1">
        <div className="wrap">
          <div className="text-ink-muted flex items-center gap-2 py-[22px] text-[13px]">
            <Link href="/" className="text-ink hover:text-gold-deep font-semibold">
              Home
            </Link>
            /
            <Link href="/resources" className="text-ink hover:text-gold-deep font-semibold">
              Resources
            </Link>
            / {article.title}
          </div>
        </div>

        <div className="wrap">
          <div className="mx-auto max-w-[760px] px-0 pt-2 pb-[34px] text-center">
            <span className="bg-cream text-gold-deep inline-block rounded-full px-[14px] py-1.5 text-[11.5px] font-bold tracking-[0.06em] uppercase">
              {article.tag}
            </span>
            <h1 className="font-display my-5 text-[clamp(30px,4.6vw,48px)] leading-[1.12] font-semibold tracking-[-0.01em]">
              {article.title}
            </h1>
            <div className="text-ink-muted flex items-center justify-center gap-2.5 text-[13.5px]">
              <span className="bg-gold font-display flex h-[26px] w-[26px] items-center justify-center rounded-full text-[11px] font-semibold">
                {article.authorInitials}
              </span>
              <span>{article.author}</span>
              <span className="bg-ink-muted h-[3px] w-[3px] rounded-full" />
              <span>{article.readTime}</span>
              <span className="bg-ink-muted h-[3px] w-[3px] rounded-full" />
              <span>{article.updated}</span>
            </div>
          </div>

          <div className="relative mx-auto aspect-[21/9] max-w-[960px] overflow-hidden rounded-[20px]">
            <svg viewBox="0 0 960 411" fill="none" className="h-full w-full" aria-hidden="true">
              <rect width="960" height="411" fill="#F9ECC9" />
              <g transform="translate(380,50)" opacity="0.9">
                <path
                  d="M200 60 C 150 40, 90 34, 44 44 L 44 260 C 90 250, 150 256, 200 276 Z"
                  fill="#F4E9D6"
                  stroke="#2B2420"
                  strokeWidth="2"
                />
                <path
                  d="M200 60 C 250 40, 310 34, 356 44 L 356 260 C 310 250, 250 256, 200 276 Z"
                  fill="#FEBE52"
                  stroke="#2B2420"
                  strokeWidth="2"
                  opacity="0.85"
                />
                <path d="M200 60 L200 276" stroke="#2B2420" strokeWidth="2" />
                <g stroke="#2B2420" strokeWidth="1.6" strokeLinecap="round" opacity="0.4">
                  <line x1="64" y1="80" x2="180" y2="70" />
                  <line x1="62" y1="98" x2="182" y2="90" />
                  <line x1="60" y1="116" x2="178" y2="110" />
                  <line x1="62" y1="134" x2="180" y2="128" />
                  <line x1="64" y1="152" x2="176" y2="150" />
                </g>
              </g>
            </svg>
          </div>

          <div className="mx-auto max-w-[700px] pt-14 max-[620px]:pt-10">
            <div
              className="prose-editor font-reading text-ink-muted text-[17px] leading-[1.85] max-[620px]:text-[16px]"
              dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
            />

            <div className="border-line mt-[46px] flex flex-wrap items-center justify-between gap-4 border-t pt-[26px]">
              <div className="flex items-center gap-3.5">
                <span className="bg-gold font-display flex h-12 w-12 items-center justify-center rounded-full text-[17px] font-semibold">
                  {article.authorInitials}
                </span>
                <div>
                  <div className="text-[14.5px] font-semibold">{article.author}</div>
                  <div className="text-ink-muted text-[12.5px]">{article.authorRole}</div>
                </div>
              </div>
              <div className="flex gap-2.5">
                <ShareButton className="h-9 w-9" />
                <a
                  href="#"
                  aria-label="Bookmark"
                  className="border-line hover:border-gold-deep flex h-9 w-9 items-center justify-center rounded-full border"
                >
                  <svg className="h-[15px] w-[15px]" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 3h10v14l-5-3-5 3z"
                      stroke="#2B2420"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <section className="bg-cream mt-[70px] py-[90px] pb-[100px]">
          <div className="wrap">
            <div className="mb-8">
              <h2 className="font-display text-[26px] font-semibold">Keep reading</h2>
            </div>
            <div className="grid grid-cols-3 gap-5 max-[980px]:grid-cols-1">
              {article.related.map((r) => (
                <Link
                  key={r.title}
                  href={r.href}
                  className="border-line bg-paper hover:shadow-card-hover rounded-[14px] border p-5 transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px]"
                >
                  <span className="text-gold-deep text-[11px] font-bold tracking-[0.05em] uppercase">
                    {r.tag}
                  </span>
                  <h4 className="font-display mt-2 text-[16px] leading-[1.3] font-semibold">
                    {r.title}
                  </h4>
                  <span className="mt-3.5 inline-block text-[12.5px] font-semibold">{r.cta}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <MinimalFooter />
    </>
  );
}
