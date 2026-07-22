import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "OBS Design System — Style Guide",
};

const brandColors: { name: string; token: string; hex: string }[] = [
  { name: "Gold", token: "bg-gold", hex: "#FEBE52" },
  { name: "Gold Deep", token: "bg-gold-deep", hex: "#D89A2E" },
  { name: "Cream", token: "bg-cream", hex: "#F9ECC9" },
  { name: "Paper", token: "bg-paper", hex: "#F4E9D6" },
  { name: "Ink", token: "bg-ink", hex: "#2B2420" },
  { name: "Ink Muted", token: "bg-ink-muted", hex: "#5C4F3E" },
  { name: "Line", token: "bg-line", hex: "#D9C7A0" },
  { name: "Oxblood", token: "bg-oxblood", hex: "#7A2E24" },
  { name: "Oxblood Deep", token: "bg-oxblood-deep", hex: "#5E211A" },
  { name: "Positive", token: "bg-positive", hex: "#3F7D4F" },
  { name: "Negative", token: "bg-negative", hex: "#B4472F" },
];

const radii = [
  { name: "xs", cls: "rounded-xs" },
  { name: "sm", cls: "rounded-sm" },
  { name: "md", cls: "rounded-md" },
  { name: "lg", cls: "rounded-lg" },
  { name: "full", cls: "rounded-full" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-line border-t py-14 first:border-t-0">
      <h2 className="text-eyebrow text-oxblood mb-8">{title}</h2>
      {children}
    </section>
  );
}

export default function StyleGuide() {
  return (
    <>
      <SiteHeader />
      <main className="wrap py-16">
        <header className="mb-6">
          <Eyebrow>Phase A + B checkpoint</Eyebrow>
          <h1 className="text-hero mt-3">OBS Design System</h1>
          <p className="text-body-reading text-ink-muted mt-4 max-w-[60ch]">
            Single source of truth extracted from the shipped HTML. Every value below comes from{" "}
            <code>app/globals.css</code> — no page defines its own colors. The header above and
            footer below are the real shared components.
          </p>
        </header>

        <Section title="Color / Brand + Semantic">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {brandColors.map((c) => (
              <div key={c.name} className="border-line overflow-hidden rounded-md border">
                <div className={`h-20 ${c.token}`} />
                <div className="bg-cream px-3 py-2">
                  <p className="text-[13px] font-semibold">{c.name}</p>
                  <p className="text-ink-muted text-[12px]">{c.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Type scale">
          <div className="space-y-5">
            <p className="text-hero">Display / Hero — Fraunces 600</p>
            <p className="text-h2">Display / H2 — Section headings</p>
            <p className="text-h3-card">Display / H3 Card — Resource titles</p>
            <p className="text-verse">Display / Verse Italic — pull quote</p>
            <p className="text-metric">44 — Metric number</p>
            <p className="text-body-reading max-w-[60ch]">
              Reading / Body — Lora. Long-form article and lesson copy sits in this style, tuned for
              comfortable reading at length.
            </p>
            <p className="text-nav">UI / Nav Label — Inter 500</p>
            <p className="text-eyebrow text-oxblood">UI / Eyebrow label</p>
          </div>
        </Section>

        <Section title="Corner radius">
          <div className="flex flex-wrap gap-6">
            {radii.map((r) => (
              <div key={r.name} className="text-center">
                <div className={`border-line bg-cream h-20 w-20 border ${r.cls}`} />
                <p className="text-ink-muted mt-2 text-[12px]">radius/{r.name}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Buttons (Button component)">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="dark">Dark</Button>
          </div>
        </Section>

        <Section title="Effects">
          <div className="flex flex-wrap gap-8">
            <div className="border-line bg-paper shadow-card-hover rounded-md border px-6 py-8">
              <p className="text-[13px] font-semibold">Shadow / Card Hover</p>
              <p className="text-ink-muted text-[12px]">shadow-card-hover</p>
            </div>
            <div className="border-line bg-paper rounded-md border px-6 py-8">
              <p className="text-[13px] font-semibold">Border / Hairline</p>
              <p className="text-ink-muted text-[12px]">border border-line</p>
            </div>
          </div>
        </Section>

        <Section title="Newsletter form (real component)">
          <div className="bg-gold flex flex-wrap items-center gap-6 rounded-lg p-8">
            <div>
              <h2 className="text-h2 max-w-[14ch]">
                Join thousands growing daily in God&apos;s Word.
              </h2>
              <p className="font-reading text-ink/70 mt-2 max-w-[38ch]">
                One short reading and reflection in your inbox, every morning.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
