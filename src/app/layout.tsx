import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "To The Edge - AI Chat Companion",
  description: "Experience engaging AI conversations with your personal chat companion. 100% free, anonymous, and private. No sign up required.",
  keywords: ["AI chat", "chat companion", "free AI", "anonymous chat", "private chat"],
  authors: [{ name: "To The Edge" }],
  openGraph: {
    title: "To The Edge - AI Chat Companion",
    description: "Experience engaging AI conversations with your personal chat companion. 100% free and anonymous.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "To The Edge - AI Chat Companion",
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
      </body>
    </html>
  );
}
