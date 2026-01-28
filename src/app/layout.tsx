import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "To The Edge - AI Chat",
  description: "Free and anonymous AI chat experience. No sign up required.",
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
