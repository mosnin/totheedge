import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Edging Hard - AI Chat Companion",
  description: "Experience engaging AI conversations with your personal chat companion. 100% free, anonymous, and private. No sign up required.",
  keywords: ["AI chat", "chat companion", "free AI", "anonymous chat", "private chat"],
  authors: [{ name: "Edging Hard" }],
  openGraph: {
    title: "Edging Hard - AI Chat Companion",
    description: "Experience engaging AI conversations with your personal chat companion. 100% free and anonymous.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Edging Hard - AI Chat Companion",
    description: "Experience engaging AI conversations with your personal chat companion. 100% free and anonymous.",
  },
  icons: {
    icon: "/icon.svg",
  },
  other: {
    "6a97888e-site-verification": "6d2c2c302f93c461bd91b205199de46c",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://quge5.com/88/tag.min.js"
          data-zone="206851"
          strategy="afterInteractive"
          data-cfasync="false"
        />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
