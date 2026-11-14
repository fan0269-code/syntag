"use client";
import Link from "next/link";
import { AdScreenProvider } from "@/components/common/AdScreenProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <AdScreenProvider screen="error">
      <Header />
      <main className="route-error">
        <h1>Data temporarily unavailable</h1>
        <p>Please try again shortly. If the issue persists, return to the homepage or read about Syrtag. This notice is an availability state. It is not a published article.</p>
        <p><Link href="/">Return to the homepage</Link> · <Link href="/theories">Theories</Link> · <Link href="/about">About Syrtag</Link></p>
        <button type="button" onClick={reset}>Try again</button>
      </main>
      <Footer />
    </AdScreenProvider>
  );
}
