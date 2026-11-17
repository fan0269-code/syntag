import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/common/Disclaimer";
import { SourceBlock } from "@/components/common/SourceBlock";
import type { Source } from "@/components/common/SourceBlock";
import { ContentAd, ProseSection, RelatedLinks } from "./ContentBlocks";
import { ArticleToc } from "./ArticleToc";
import { VerificationBadge } from "@/components/common/VerificationBadge";
import { CLOSED_LEDGER_SUMMARY } from "@/lib/claim-ledger";

function initialsForTitle(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const pageSourceSummary = "Source records available · editorial synthesis · claim-level review pending";
const pageSourceNote = "A source link beside a claim is the locator for that claim. Editorial prompts are labeled as editorial. A source list is not a full-text reading.";

export function EntityArticle({ kind, title, summary, breadcrumb, overview, links, sources, children }: { kind: string; title: string; summary?: string | null; breadcrumb: Array<{ label: string; href?: string }>; overview?: string | null; links?: Array<{ label: string; href: string; description?: string | null }>; sources?: Source[]; children?: React.ReactNode }) {
  const isScholar = kind.toLowerCase() === "scholar";
  const sourceItems = sources || [{ text: "Source-level editorial verification is pending for this entry.", level: "L3_pending" as const }];
  const ledgerClosed = sourceItems.some((item) => item.level === "source_verified")
    && sourceItems.some((item) => item.level === "L3_guidance")
    && sourceItems.every((item) => item.level !== "L3_pending");
  const sourceSummary = <><span>{ledgerClosed ? CLOSED_LEDGER_SUMMARY : pageSourceSummary}</span><VerificationBadge level="L2_editorial" scope="page" /></>;
  return <article className="entity-page content-layout"><Breadcrumbs path={[{ label: "Home", href: "/" }, ...breadcrumb, { label: title }]} /><header className="entity-page__hero">{isScholar ? <div className="entity-page__identity"><div className="monogram" aria-label={`${title} monogram`}>{initialsForTitle(title)}</div><div><span>{kind}</span><h1>{title}</h1>{summary && <p>{summary}</p>}</div></div> : <><span>{kind}</span><h1>{title}</h1>{summary && <p>{summary}</p>}</>}</header><ArticleToc /><ProseSection title="Overview">{overview || summary || "No overview text is available for this entry."}</ProseSection><div className="entity-page__meta">{sourceSummary}</div><p className="page-level-source-note">{pageSourceNote}</p>{children}<ContentAd placement="in-article" /><RelatedLinks heading={`Related ${kind.toLowerCase()} entries`} links={links || []} /><ContentAd placement="bottom" /><SourceBlock sources={sourceItems} /><Disclaimer /></article>;
}
