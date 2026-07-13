import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/common/Disclaimer";
import { SourceBlock } from "@/components/common/SourceBlock";
import type { Source } from "@/components/common/SourceBlock";
import { ContentAd, ProseSection, RelatedLinks } from "./ContentBlocks";

function initialsForTitle(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function EntityArticle({ kind, title, summary, breadcrumb, overview, links, sources, children }: { kind: string; title: string; summary?: string | null; breadcrumb: Array<{ label: string; href?: string }>; overview?: string | null; links?: Array<{ label: string; href: string; description?: string | null }>; sources?: Source[]; children?: React.ReactNode }) {
  const isScholar = kind.toLowerCase() === "scholar";
  return <article className="entity-page content-layout"><Breadcrumbs path={[{ label: "Home", href: "/" }, ...breadcrumb, { label: title }]} /><header className="entity-page__hero">{isScholar ? <div className="entity-page__identity"><div className="monogram" aria-label={`${title} monogram`}>{initialsForTitle(title)}</div><div><span>{kind}</span><h1>{title}</h1>{summary && <p>{summary}</p>}</div></div> : <><span>{kind}</span><h1>{title}</h1>{summary && <p>{summary}</p>}</>}</header><ProseSection title="Overview">{overview || summary || "Editorial content for this entry is being prepared."}</ProseSection>{children}<ContentAd placement="in-article" /><RelatedLinks heading={`Related ${kind.toLowerCase()} entries`} links={links || []} /><ContentAd placement="bottom" /><SourceBlock sources={sources || [{ text: "Source-level editorial verification is pending for this entry.", level: "L3_pending" }]} /><Disclaimer /></article>;
}
