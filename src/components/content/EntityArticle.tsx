import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/common/Disclaimer";
import { SourceBlock } from "@/components/common/SourceBlock";
import { ContentAd, ProseSection, RelatedLinks } from "./ContentBlocks";

export function EntityArticle({ kind, title, summary, breadcrumb, overview, links, children }: { kind: string; title: string; summary?: string | null; breadcrumb: Array<{ label: string; href?: string }>; overview?: string | null; links?: Array<{ label: string; href: string; description?: string | null }>; children?: React.ReactNode }) {
  return <article className="entity-page content-layout"><Breadcrumbs path={[{ label: "Home", href: "/" }, ...breadcrumb, { label: title }]} /><header className="entity-page__hero"><span>{kind}</span><h1>{title}</h1>{summary && <p>{summary}</p>}</header><ProseSection title="Overview">{overview || summary || "Editorial content for this entry is being prepared."}</ProseSection>{children}<ContentAd placement="in-article" /><RelatedLinks heading={`Related ${kind.toLowerCase()} entries`} links={links || []} /><ContentAd placement="bottom" /><SourceBlock sources={[{ text: "Source-level editorial verification is pending for this entry.", level: "L3_pending" }]} /><Disclaimer /></article>;
}
