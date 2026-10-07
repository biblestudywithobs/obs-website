import type { Metadata } from "next";
import { Fraunces, Lora, Inter } from "next/font/google";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import "./globals.css";

// Three type families from the design system, loaded as variable fonts.
// Fraunces = display/headline, Lora = long-form reading, Inter = UI.
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteTitle = "Open Bible School — Understand the Scriptures. Grow in Christ.";
const siteDescription =
  "Open Bible School — free reading plans, class sessions, resources and community to help you understand the Scriptures and grow in Christ.";

export const metadata: Metadata = {
  metadataBase: new URL("https://biblestudywithobs.com"),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "BibleStudyWithOBS",
    images: [{ url: "/logo.jpg", width: 1500, height: 1500, alt: "Open Bible School" }],
    locale: "en_US",
    type: "website",
  },
  // Set GOOGLE_SITE_VERIFICATION to the token from Google Search Console
  // (Settings → Ownership verification → HTML tag) to verify the domain.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/logo.jpg"],
  },
};

// Structured data so Google understands who OBS is and can show the site
// name, logo and social profiles in search results.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://biblestudywithobs.com/#organization",
      name: "Open Bible School",
      alternateName: "BibleStudyWithOBS",
      url: "https://biblestudywithobs.com",
      logo: "https://biblestudywithobs.com/logo.jpg",
      description: siteDescription,
      sameAs: [
        "https://www.instagram.com/openbibleschool/",
        "https://www.youtube.com/@studywithOBS",
        "https://open.spotify.com/show/0G6DSKiA0fA6UYcxpEOcCl",
        "https://biblestudywithobs.substack.com",
        "https://medium.com/@biblestudywithobs",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://biblestudywithobs.com/#website",
      name: "Open Bible School",
      url: "https://biblestudywithobs.com",
      publisher: { "@id": "https://biblestudywithobs.com/#organization" },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${lora.variable} ${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
