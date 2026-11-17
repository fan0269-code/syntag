import type { Metadata } from "next";
import Link from "next/link";
import { PageFrame } from "@/components/common/PageFrame";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function NotFound() { return <PageFrame adScreen="error"><section className="route-error"><h1>That entry is not available.</h1><p>It may not be published yet, or the link may be outdated. An unavailable entry is not a published article.</p><p><Link href="/theories">Theories</Link> · <Link href="/scholars">Scholars</Link> · <Link href="/works">Works</Link></p></section></PageFrame>; }
