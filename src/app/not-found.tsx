import Link from "next/link";
import { PageFrame } from "@/components/common/PageFrame";

export default function NotFound() { return <PageFrame><section className="route-error"><h1>That entry is not available.</h1><p>It may not be published yet, or the link may be outdated. An unavailable entry is not a published article.</p><p><Link href="/">Return to the homepage</Link> · <Link href="/theories">Browse theories</Link> · <Link href="/disciplines">Browse disciplines</Link></p></section></PageFrame>; }
