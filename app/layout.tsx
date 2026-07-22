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

export const metadata: Metadata = {
  title: "Open Bible School — Understand the Scriptures. Grow in Christ.",
  description:
    "Open Bible School — free reading plans, class sessions, resources and community to help you understand the Scriptures and grow in Christ.",
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
