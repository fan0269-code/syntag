"use client";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <><Header /><main className="route-error"><h1>Data temporarily unavailable</h1><p>Please try again shortly. If the issue persists, return to the knowledge graph or read about Syntag.</p><p><Link href="/">Return to the knowledge graph</Link> · <Link href="/about">About Syntag</Link></p><button type="button" onClick={reset}>Try again</button></main><Footer /></>; }
