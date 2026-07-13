import type { Metadata } from "next";
import "./globals.css";
import { generateHomeMeta } from "@/lib/seo";

export const metadata: Metadata = {
  ...generateHomeMeta(),
  metadataBase: new URL("https://syntag.app"),
  openGraph: { ...generateHomeMeta().openGraph, siteName: "Syntag" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
