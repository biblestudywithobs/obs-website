import { SiteHeader } from "@/components/layout/SiteHeader";

// Shared header for every public page. Each page renders its own <main> and
// footer (the homepage uses the full footer; interior pages use the minimal
// one), so the footer stays pinned to the bottom on short pages.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
