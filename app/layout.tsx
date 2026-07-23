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
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${lora.variable} ${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
