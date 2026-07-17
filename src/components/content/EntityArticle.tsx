import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/common/Disclaimer";
import { SourceBlock } from "@/components/common/SourceBlock";
import type { Source } from "@/components/common/SourceBlock";
import { ContentAd, ProseSection, RelatedLinks } from "./ContentBlocks";
import { ArticleToc } from "./ArticleToc";
import { VerificationBadge } from "@/components/common/VerificationBadge";

function initialsForTitle(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const pageSourceSummary = "Sources listed · editorial synthesis · claim-level review pending";
const pageSourceNote = "This page lists registered sources and editorial synthesis; claim-level review remains pending unless a source entry states otherwise.";

export function EntityArticle({ kind, title, summary, breadcrumb, overview, links, sources, children }: { kind: string; title: string; summary?: string | null; breadcrumb: Array<{ label: string; href?: string }>; overview?: string | null; links?: Array<{ label: string; href: string; description?: string | null }>; sources?: Source[]; children?: React.ReactNode }) {
  const isScholar = kind.toLowerCase() === "scholar";
  const sourceItems = sources || [{ text: "Source-level editorial verification is pending for this entry.", level: "L3_pending" as const }];
  const sourceSummary = <><span>{pageSourceSummary}</span><VerificationBadge level="L3_pending" scope="page" /></>;
  return <article className="entity-page content-layout"><Breadcrumbs path={[{ label: "Home", href: "/" }, ...breadcrumb, { label: title }]} /><header className="entity-page__hero">{isScholar ? <div className="entity-page__identity"><div className="monogram" aria-label={`${title} monogram`}>{initialsForTitle(title)}</div><div><span>{kind}</span><h1>{title}</h1>{summary && <p>{summary}</p>}<div className="entity-page__meta">{sourceSummary}</div><p className="page-level-source-note">{pageSourceNote}</p></div></div> : <><span>{kind}</span><h1>{title}</h1>{summary && <p>{summary}</p>}<div className="entity-page__meta">{sourceSummary}</div><p className="page-level-source-note">{pageSourceNote}</p></>}</header><ArticleToc /><ProseSection title="Overview">{overview || summary || "No overview text is available for this entry."}</ProseSection>{children}<ContentAd placement="in-article" /><RelatedLinks heading={`Related ${kind.toLowerCase()} entries`} links={links || []} /><ContentAd placement="bottom" /><SourceBlock sources={sourceItems} /><Disclaimer /></article>;
}
