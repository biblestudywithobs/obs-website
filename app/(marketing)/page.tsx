import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Sparkle } from "@/components/ui/Sparkle";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { SessionCard } from "@/components/cards/SessionCard";
import { LatestFromOBS } from "@/components/sections/LatestFromOBS";
import { SubstackIcon, MediumIcon, YouTubeIcon, SpotifyIcon } from "@/components/ui/BrandIcons";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { listFeaturedResources } from "@/lib/queries/public-resources";
import { getLatestByTab } from "@/lib/queries/homepage-latest";
import { listRecentSessions } from "@/lib/queries/public-sessions";

// Inline arrow used by "view all" style links.
function ArrowRight() {
  return (
    <svg className="h-[14px] w-[14px]" viewBox="0 0 14 14" fill="none">
      <path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ViewAll({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={
        "inline-flex items-center gap-1.5 text-[14px] font-semibold whitespace-nowrap " +
        (className ?? "")
      }
    >
      {children} <ArrowRight />
    </Link>
  );
}

export default async function Home() {
  const [featuredResources, latestByTab, recentSessions] = await Promise.all([
    listFeaturedResources(),
    getLatestByTab(),
    listRecentSessions(),
  ]);

  return (
    <>
      <main className="flex-1">
        {/* ===================== HERO ===================== */}
        <section className="relative overflow-hidden pt-[88px] pb-[110px] max-[620px]:pt-14 max-[620px]:pb-16">
          <div className="wrap grid grid-cols-[1fr_0.92fr] items-center gap-16 max-[980px]:grid-cols-1">
            <div>
              <Eyebrow>A ministry of the Word</Eyebrow>
              <h1 className="text-hero mt-5 mb-[22px]">
                Understand the Scriptures.
                <br />
                Grow in <em className="text-gold-deep font-medium italic">Christ.</em>
                <br />
                Serve His Church.
              </h1>
              <p className="font-reading text-ink-muted mb-[34px] max-w-[46ch] text-[19px] leading-[1.65]">
                We help people understand the Scriptures in a simple, clear, and faithful way —
                through reading plans, teaching, and a community that studies the Word together.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button href="/resources">Explore Resources</Button>
                <Button href="/about" variant="secondary">
                  About OBS
                </Button>
              </div>
              <div className="text-ink-muted mt-14 flex flex-wrap items-center gap-4 text-[13px]">
                <span>Also find us on</span>
                <a
                  href="https://biblestudywithobs.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Substack"
                  className="border-line bg-paper flex h-8 w-8 items-center justify-center rounded-full border transition-transform hover:-translate-y-0.5"
                >
                  <SubstackIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://medium.com/@biblestudywithobs"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Medium"
                  className="border-line bg-paper flex h-8 w-8 items-center justify-center rounded-full border transition-transform hover:-translate-y-0.5"
                >
                  <MediumIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://www.youtube.com/@studywithOBS"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="border-line bg-paper flex h-8 w-8 items-center justify-center rounded-full border transition-transform hover:-translate-y-0.5"
                >
                  <YouTubeIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://open.spotify.com/show/0G6DSKiA0fA6UYcxpEOcCl"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Spotify"
                  className="border-line bg-paper flex h-8 w-8 items-center justify-center rounded-full border transition-transform hover:-translate-y-0.5"
                >
                  <SpotifyIcon className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="relative flex aspect-square items-center justify-center max-[980px]:order-first max-[980px]:mx-auto max-[980px]:max-w-[340px]">
              <svg
                viewBox="0 0 480 480"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
                aria-hidden="true"
              >
                <g>
                  <path
                    d="M240 130 C 190 108, 120 100, 68 112 L 68 372 C 120 358, 190 366, 240 388 Z"
                    fill="#F9ECC9"
                    stroke="#2B2420"
                    strokeWidth="2"
                  />
                  <path
                    d="M240 130 C 290 108, 360 100, 412 112 L 412 372 C 360 358, 290 366, 240 388 Z"
                    fill="#F4E9D6"
                    stroke="#2B2420"
                    strokeWidth="2"
                  />
                  <path d="M240 130 L240 388" stroke="#2B2420" strokeWidth="2" />
                  <path
                    d="M240 130 C 190 108, 120 100, 68 112"
                    stroke="#D89A2E"
                    strokeWidth="4"
                    fill="none"
                    opacity="0.6"
                  />
                  <path
                    d="M240 130 C 290 108, 360 100, 412 112"
                    stroke="#D89A2E"
                    strokeWidth="4"
                    fill="none"
                    opacity="0.6"
                  />
                  <g stroke="#2B2420" strokeWidth="2" strokeLinecap="round" opacity="0.55">
                    <line x1="92" y1="152" x2="210" y2="140" />
                    <line x1="90" y1="172" x2="214" y2="162" />
                    <line x1="88" y1="192" x2="212" y2="184" />
                    <line x1="88" y1="212" x2="208" y2="206" />
                    <line x1="90" y1="232" x2="212" y2="228" />
                    <line x1="92" y1="252" x2="206" y2="250" />
                  </g>
                  <rect
                    x="86"
                    y="265"
                    width="128"
                    height="12"
                    rx="6"
                    fill="#FEBE52"
                    opacity="0.9"
                  />
                  <g stroke="#2B2420" strokeWidth="2" strokeLinecap="round" opacity="0.55">
                    <line x1="88" y1="296" x2="210" y2="296" />
                    <line x1="90" y1="316" x2="206" y2="318" />
                    <line x1="92" y1="336" x2="200" y2="338" />
                  </g>
                  <g stroke="#2B2420" strokeWidth="2" strokeLinecap="round" opacity="0.4">
                    <line x1="270" y1="140" x2="388" y2="152" />
                    <line x1="266" y1="162" x2="390" y2="172" />
                    <line x1="268" y1="184" x2="392" y2="192" />
                    <line x1="272" y1="206" x2="388" y2="212" />
                    <line x1="268" y1="228" x2="390" y2="232" />
                    <line x1="270" y1="250" x2="384" y2="252" />
                    <line x1="268" y1="272" x2="388" y2="276" />
                    <line x1="270" y1="294" x2="386" y2="296" />
                    <line x1="272" y1="316" x2="390" y2="316" />
                    <line x1="270" y1="338" x2="384" y2="338" />
                  </g>
                  <path d="M256 106 L256 200 L240 186 L224 200 L224 108" fill="#D89A2E" />
                </g>

                <g className="glint" transform="translate(110,90)">
                  <svg className="sparkle" width="20" height="20" viewBox="0 0 24 24">
                    <path
                      d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z"
                      fill="#D89A2E"
                    />
                  </svg>
                </g>
                <g className="glint" transform="translate(388,80)">
                  <svg className="sparkle" width="16" height="16" viewBox="0 0 24 24">
                    <path
                      d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z"
                      fill="#D89A2E"
                    />
                  </svg>
                </g>
                <g className="glint" transform="translate(60,340)">
                  <svg className="sparkle" width="14" height="14" viewBox="0 0 24 24">
                    <path
                      d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z"
                      fill="#D89A2E"
                    />
                  </svg>
                </g>
              </svg>
            </div>
          </div>
        </section>

        {/* ================= FEATURED RESOURCES ================= */}
        <section id="resources" className="section-pad">
          <div className="wrap">
            <div className="mb-[46px] flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow sparkle={false}>Featured resources</Eyebrow>
                <h2 className="text-h2 mt-3">
                  Start where you are, go deeper
                  <br />
                  than you thought you could.
                </h2>
              </div>
              <ViewAll href="/resources">Browse the library</ViewAll>
            </div>

            <div className="grid grid-cols-[1.15fr_1fr_1fr] grid-rows-[auto_auto] gap-[22px] max-[980px]:grid-cols-2 max-[620px]:grid-cols-1">
              {featuredResources.map((resource) => (
                <ResourceCard key={resource.slug} resource={resource} />
              ))}
            </div>
          </div>
        </section>

        {/* ================= CLASS SESSIONS ================= */}
        <section id="sessions" className="section-pad bg-cream">
          <div className="wrap">
            <div className="mb-[46px] flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow sparkle={false}>Recorded live</Eyebrow>
                <h2 className="text-h2 mt-3">
                  Missed a class? Listen back
                  <br />
                  whenever you&apos;re ready.
                </h2>
                <p className="font-reading text-ink-muted mt-2.5 max-w-[42ch]">
                  Every OBS class is recorded and split into sessions, so you can catch up at your
                  own pace or revisit a teaching that stayed with you.
                </p>
              </div>
              <ViewAll href="/sessions">Browse all sessions</ViewAll>
            </div>

            <div className="-mx-10 flex snap-x snap-proximity gap-[18px] overflow-x-auto px-10 pb-2 max-[620px]:-mx-5 max-[620px]:px-5">
              {recentSessions.map((session) => (
                <SessionCard
                  key={session.slug}
                  session={session}
                  className="flex-[0_0_290px] snap-start"
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================= MISSION / MARGINALIA ================= */}
        <section id="about" className="section-pad bg-ink text-cream">
          <div className="wrap grid grid-cols-[130px_1fr] gap-10 max-[980px]:grid-cols-1">
            <div className="border-cream/[0.18] max-[980px]:border-b-cream/[0.18] border-r max-[980px]:flex max-[980px]:gap-[18px] max-[980px]:overflow-x-auto max-[980px]:border-r-0 max-[980px]:border-b max-[980px]:pb-[14px]">
              {["Mission", "Vision", "Values", "Community"].map((label, i) => (
                <div
                  key={label}
                  className="font-ui text-cream/55 flex items-center gap-2 py-1.5 text-[12px] tracking-[0.04em]"
                >
                  <b className="text-gold font-semibold">{String(i + 1).padStart(2, "0")}</b>{" "}
                  {label}
                </div>
              ))}
            </div>

            <div>
              <Eyebrow sparkle={false} onDark>
                Why OBS exists
              </Eyebrow>
              <blockquote className="text-verse relative mt-5 max-w-[20ch]">
                We help people{" "}
                <span className="relative inline">
                  understand the Scriptures
                  <svg
                    className="absolute -bottom-1.5 left-0 h-[14px] w-full overflow-visible"
                    viewBox="0 0 300 14"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 8 C 60 2, 120 12, 150 7 C 200 2, 250 12, 298 6"
                      stroke="#FEBE52"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                in a simple, clear, and faithful way — leading them to know Christ and serve His
                Church.
              </blockquote>
              <div className="font-ui text-cream/65 mt-[34px] flex items-center gap-2.5 text-[13.5px]">
                <Sparkle onDark />
                OBS Mission Statement
              </div>
              <div className="border-cream/[0.18] bg-cream/[0.07] font-reading text-cream/[0.82] mt-11 inline-flex max-w-[46ch] items-start gap-2.5 rounded-[14px] border px-[18px] py-4 text-[14.5px] leading-[1.6]">
                Margin note — this is the thread that runs through every OBS course, article, and
                reading plan: Scripture made clear enough to live by.
              </div>
              <div className="mt-[22px]">
                <ViewAll href="/about" className="text-gold">
                  Read our full story
                </ViewAll>
              </div>
            </div>
          </div>
        </section>

        {/* ================= LATEST CONTENT ================= */}
        <section id="media" className="section-pad">
          <div className="wrap">
            <div className="mb-[46px]">
              <Eyebrow sparkle={false}>Latest from OBS</Eyebrow>
              <h2 className="text-h2 mt-3">Fresh off the desk</h2>
            </div>

            <LatestFromOBS itemsByTab={latestByTab} />
          </div>
        </section>

        {/* ================= NEWSLETTER ================= */}
        <section id="join" className="section-pad bg-gold relative overflow-hidden">
          <div className="wrap flex flex-wrap items-center justify-between gap-10 max-[980px]:flex-col max-[980px]:items-start">
            <div>
              <h2 className="font-display max-w-[14ch] text-[clamp(28px,3.2vw,38px)] leading-[1.15] font-semibold">
                Join thousands growing daily in God&apos;s Word.
              </h2>
              <p className="font-reading mt-2.5 max-w-[38ch] text-[rgba(26,26,26,0.72)]">
                One short reading and reflection in your inbox, every morning.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </section>

        {/* ================= METRICS =================
      Commented out for now — these were placeholder numbers, not real
      figures. Uncomment (and swap `metrics` for real data) when there's
      something real to show here.
      <section className="section-pad">
        <div className="wrap grid grid-cols-4 max-[980px]:grid-cols-2 max-[980px]:gap-y-8">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={
                "px-7 " +
                (i === 0
                  ? "border-l-0 pl-0"
                  : "border-l border-line ") +
                (i === 2 ? " max-[980px]:border-l-0 max-[980px]:pl-0" : "")
              }
            >
              <div className="flex items-center gap-2 font-display text-[44px] font-semibold tracking-[-0.01em]">
                {m.num}
                {m.sparkle && <Sparkle className="h-5 w-5" />}
              </div>
              <div className="mt-2 text-[13.5px] font-medium text-ink-muted">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </section>
      */}
      </main>
      <SiteFooter />
    </>
  );
}
