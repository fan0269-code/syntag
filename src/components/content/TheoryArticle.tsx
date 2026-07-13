import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/common/Disclaimer";
import { SourceBlock } from "@/components/common/SourceBlock";
import { readingTime, records, text, type ContentRecord } from "@/lib/content";
import { ContentAd, ProseSection, RelatedLinks } from "./ContentBlocks";
import { TheoryGenealogyMap } from "./TheoryGenealogyMap";
import type { InternalLink } from "@/lib/internal-links";

type TheoryArticleData = {
  titleEn: string; subtitleEn: string | null; summaryEn: string | null; slug: string; content: ContentRecord;
  fields: Array<{ field: { slug: string; titleEn: string; discipline: { slug: string; titleEn: string } | null } }>;
  concepts: Array<{ concept: { slug: string; termEn: string; definitionEn: string | null } }>;
  works: Array<{ work: { slug: string; title: string } }>;
  scholars: Array<{ scholar: { slug: string; name: string } }>;
  topics: Array<{ topic: { slug: string; questionEn: string } }>;
  sourceRelations: Array<{ targetTheory: { slug: string; titleEn: string } }>;
  targetRelations: Array<{ sourceTheory: { slug: string; titleEn: string } }>;
};

export function TheoryArticle({ theory, internalLinks = [] }: { theory: TheoryArticleData; internalLinks?: InternalLink[] }) {
  const { content } = theory; const dimensions = records(content.analysis_dimensions); const field = theory.fields[0]?.field;
  const relationshipLinks = [...theory.sourceRelations.map(({ targetTheory }) => targetTheory), ...theory.targetRelations.map(({ sourceTheory }) => sourceTheory)];
  return <article className="entity-page content-layout">
    <Breadcrumbs path={[{ label: "Home", href: "/" }, ...(field ? [{ label: field.discipline?.titleEn ?? "Discipline", href: `/disciplines/${field.discipline?.slug}` }, { label: field.titleEn, href: `/fields/${field.slug}` }] : []), { label: theory.titleEn }]} />
    <header className="entity-page__hero"><h1>{theory.titleEn}</h1>{theory.subtitleEn && <p>{theory.subtitleEn}</p>}<div className="entity-page__meta"><span>{readingTime(theory.summaryEn, text(content.what_is_it, ""))}</span><span>{theory.slug.includes("theory") ? "Theory depth" : "Research framework"}</span><span>Verification pending</span></div><Link className="text-link" href={`/?discipline=${field?.discipline?.slug ?? "education"}&mode=genealogy&focus=${theory.slug}`}>View in graph →</Link></header>
    <ProseSection title="Quick Summary" id="summary">{text(content.what_is_it, theory.summaryEn || undefined)}</ProseSection>
    <ContentAd placement="in-article" />
    <ProseSection title="1. Origins & Intellectual History">{text(content.origins)}</ProseSection>
    <section className="prose-section"><h2>2. Core Concepts</h2>{theory.concepts.length ? <dl className="concept-list">{theory.concepts.map(({ concept }) => <div key={concept.slug}><dt><Link href={`/concepts/${concept.slug}`}>{concept.termEn}</Link></dt><dd>{concept.definitionEn || "Concept definition is being prepared."}</dd></div>)}</dl> : <p>{text(content.core_concepts)}</p>}</section>
    <section className="prose-section"><h2>3. Theoretical Genealogy</h2><p>{text(content.genealogy)}</p><TheoryGenealogyMap theory={{ slug: theory.slug, titleEn: theory.titleEn }} related={relationshipLinks} /></section>
    {relationshipLinks.length > 0 && <section className="prose-section"><h2>Connected theories</h2><p className="relation-card__intro">Each relation is sourced when source-level data is available. Open a theory to trace its pathway.</p><div className="relation-card-list">{relationshipLinks.map((item) => <Link key={item.slug} className="rel-card" href={`/theories/${item.slug}`}><span className="rel-type rel-type--connected">connected</span><div><strong className="rel-card__title">{item.titleEn}</strong><span className="rel-card__desc">Explore this theoretical relationship</span></div><span className="rel-card__arrow" aria-hidden="true">→</span></Link>)}</div></section>}
    <RelatedLinks heading="Explore connected research" links={internalLinks.map(({ label, href, reason }) => ({ label, href, description: reason }))} />
    <ProseSection title="4. Suitable Research Topics">{text(content.applicable_topics)}</ProseSection>
    <ProseSection title="5. When NOT to Use This Theory">{text(content.inapplicable_topics)}</ProseSection>
    <ProseSection title="6. Common Misapplications">{text(content.misuse_risks)}</ProseSection>
    <ContentAd placement="in-article" />
    <section className="prose-section"><h2>7. Translating to Analysis Dimensions</h2>{dimensions.length ? <div className="responsive-table">{dimensions.map((item, index) => <article key={index}><strong>{item.concept}</strong><span><b>Dimension</b>{item.dimension}</span><span><b>Indicator</b>{item.indicator}</span></article>)}</div> : <p>{text(content.analysis_dimensions)}</p>}</section>
    <ProseSection title="8. Data Collection Guidance">{text(content.data_collection)}</ProseSection>
    <ProseSection title="9. Suggested Chapter Structure">{text(content.chapter_structure)}</ProseSection>
    <ProseSection title="10. Writing the Theoretical Fit Section">{text(content.fit_writing)}</ProseSection>
    <RelatedLinks heading="11. Related theories" links={relationshipLinks.map((item) => ({ label: item.titleEn, href: `/theories/${item.slug}` }))} />
    <ContentAd placement="bottom" />
    <SourceBlock sources={[{ text: "Source-level editorial verification is pending for this entry.", level: "L3_pending" }]} />
    <RelatedLinks heading="Related scholars" links={theory.scholars.map(({ scholar }) => ({ label: scholar.name, href: `/scholars/${scholar.slug}` }))} />
    <RelatedLinks heading="Related works" links={theory.works.map(({ work }) => ({ label: work.title, href: `/works/${work.slug}` }))} />
    <RelatedLinks heading="Related research topics" links={theory.topics.map(({ topic }) => ({ label: topic.questionEn, href: `/topics/${topic.slug}` }))} />
    <Disclaimer />
  </article>;
}
