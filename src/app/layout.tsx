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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
        <Script
          id="vignette-ad"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='10530491',s.src='https://gizokraijaw.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
          }}
        />
      </body>
    </html>
  );
}
