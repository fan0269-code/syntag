import Link from "next/link";
import { SourceBlock } from "@/components/common/SourceBlock";
import { Disclaimer } from "@/components/common/Disclaimer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { isTheoryDepth } from "@/data/templates/theory-template";
import { readingTime, type ContentRecord } from "@/lib/content";
import type { InternalLink } from "@/lib/internal-links";
import { buildTheoryPresentation } from "@/lib/theory-presentation";
import { ContentAd, ProseSection, RelatedLinks } from "./ContentBlocks";
import { TheoryGenealogyMap } from "./TheoryGenealogyMap";

type TheoryArticleData = {
  titleEn: string;
  subtitleEn: string | null;
  summaryEn: string | null;
  slug: string;
  depth: string;
  content: ContentRecord;
  fields: Array<{ field: { slug: string; titleEn: string; discipline: { slug: string; titleEn: string } | null } }>;
  concepts: Array<{ concept: { slug: string; termEn: string; definitionEn: string | null } }>;
  works: Array<{ work: { slug: string; title: string } }>;
  scholars: Array<{ scholar: { slug: string; name: string } }>;
  topics: Array<{ topic: { slug: string; questionEn: string } }>;
  sourceRelations: Array<{ targetTheory: { slug: string; titleEn: string } }>;
  targetRelations: Array<{ sourceTheory: { slug: string; titleEn: string } }>;
};

export function TheoryArticle({ theory, internalLinks = [] }: { theory: TheoryArticleData; internalLinks?: InternalLink[] }) {
  const depth = isTheoryDepth(theory.depth) ? theory.depth : "D1";
  const presentation = buildTheoryPresentation(theory.content, depth);
  const field = theory.fields[0]?.field;
  const relationshipLinks = [
    ...theory.sourceRelations.map(({ targetTheory }) => targetTheory),
    ...theory.targetRelations.map(({ sourceTheory }) => sourceTheory),
  ];
  const hasResearchDesign = presentation.sectionKeys.includes("analysis_dimensions");
  const hasD2Design = presentation.sectionKeys.includes("explanatory_mechanisms");
  const hasDepthCoverage = presentation.sectionKeys.includes("depth_coverage");
  const hasD3Details = presentation.sectionKeys.includes("historical_development");
  const readingPathNumber = hasResearchDesign ? 11 : 7;

  return <article className="entity-page content-layout">
    <Breadcrumbs path={[
      { label: "Home", href: "/" },
      ...(field ? [
        { label: field.discipline?.titleEn ?? "Discipline", href: `/disciplines/${field.discipline?.slug}` },
        { label: field.titleEn, href: `/fields/${field.slug}` },
      ] : []),
      { label: theory.titleEn },
    ]} />
    <header className="entity-page__hero">
      <h1>{theory.titleEn}</h1>
      {theory.subtitleEn && <p>{theory.subtitleEn}</p>}
      <div className="entity-page__meta">
        <span>{readingTime(theory.summaryEn, presentation.summary)}</span>
        <span>{presentation.depthLabel}</span>
        <span>{presentation.verificationSummary}</span>
      </div>
      <Link className="text-link" href={`/?discipline=${field?.discipline?.slug ?? "education"}&mode=genealogy&focus=${theory.slug}`}>View in graph →</Link>
    </header>

    <ProseSection title="Quick Summary" id="summary">{presentation.summary || theory.summaryEn || ""}</ProseSection>
    <ContentAd placement="in-article" />
    <ProseSection title="1. Origins & Intellectual History">{presentation.origins}</ProseSection>

    {presentation.theoryNature && <section className="prose-section">
      <h2>D1 Page Scope &amp; Status</h2>
      <div className="responsive-table"><article>
        <strong>{presentation.theoryNature.label}</strong>
        <span>{presentation.theoryNature.explanation}</span>
        <EvidenceLinks sources={presentation.theoryNature.sources} />
      </article></div>
    </section>}

    {hasD2Design && <>
      <section className="prose-section">
        <h2>D2 Explanatory Mechanisms</h2>
        <div className="responsive-table">
          {presentation.explanatoryMechanisms.map((item) => <article key={item.mechanism}>
            <strong>{item.mechanism}</strong>
            <span><b>Process</b>{item.process}</span>
            <span><b>Evidence focus</b>{item.evidenceFocus}</span>
            <EvidenceLinks sources={item.sources} />
          </article>)}
        </div>
      </section>
      <ProseSection title="D2 Analysis Unit">{presentation.analysisUnit}</ProseSection>
      <section className="prose-section">
        <h2>D2 Candidate and Alternative Theory Comparison</h2>
        <div className="responsive-table">
          {presentation.theoryComparisons.map((item) => <article key={`${item.role}-${item.theory}`}>
            <strong>{item.theory}</strong>
            <span><b>Role</b>{item.role === "main_candidate" ? "Main candidate" : "Alternative"}</span>
            <span><b>Shared focus</b>{item.sharedFocus}</span>
            <span><b>Important difference</b>{item.difference}</span>
            <span><b>Prefer it when</b>{item.whenPrefer}</span>
            <EvidenceLinks sources={item.sources} />
          </article>)}
        </div>
      </section>
      <section className="prose-section">
        <h2>D2 Boundary Conditions</h2>
        <div className="responsive-table">
          {presentation.boundaryConditions.map((item) => <article key={item.condition}>
            <strong>{item.condition}</strong>
            <span><b>Implication</b>{item.implication}</span>
            <EvidenceLinks sources={item.sources} />
          </article>)}
        </div>
      </section>
    </>}

    {hasD3Details && <>
      <ProseSection title="D3 Core Question">{presentation.coreQuestion}</ProseSection>
      <section className="prose-section">
        <h2>Historical Development</h2>
        <div className="responsive-table">
          {presentation.historicalDevelopment.map((item) => <article key={item.period}>
            <strong>{item.period}</strong>
            <span>{item.development}</span>
            <span><b>Why it matters</b>{item.significance}</span>
            <EvidenceLinks sources={item.sources} />
          </article>)}
        </div>
      </section>
      <section className="prose-section">
        <h2>Key Scholars & Representative Works</h2>
        <div className="responsive-table">
          {presentation.keyScholars.map((item) => <article key={item.name}>
            <strong>{item.name}</strong>
            <span>{item.contribution}</span>
            <span><b>Representative work</b>{item.representativeWork}</span>
            <EvidenceLinks sources={item.sources} />
          </article>)}
        </div>
      </section>
    </>}

    <section className="prose-section">
      <h2>2. Core Concepts</h2>
      <dl className="concept-list">
        {presentation.coreConcepts.map((concept) => <div key={concept.name}>
          <dt>{concept.name}</dt>
          <dd>{concept.definition} {concept.relevance}</dd>
        </div>)}
      </dl>
    </section>

    <section className="prose-section">
      <h2>3. Theoretical Genealogy</h2>
      <div className="responsive-table">
        {presentation.genealogy.map((entry) => <article key={`${entry.relatedTheory}-${entry.relationship}`}>
          <strong><Link href={`/theories/${entry.relatedTheory}`}>{entry.relatedTheory.replaceAll("-", " ")}</Link></strong>
          <span><b>Relationship</b>{entry.relationship.replaceAll("_", " ")}</span>
          <span>{entry.description}</span>
          <EvidenceLinks sources={entry.sources} />
        </article>)}
      </div>
      <TheoryGenealogyMap theory={{ slug: theory.slug, titleEn: theory.titleEn }} related={relationshipLinks} />
    </section>

    {hasD3Details && <section className="prose-section">
      <h2>Adjacent Theories & Important Differences</h2>
      <div className="responsive-table">
        {presentation.adjacentTheories.map((item) => <article key={item.theory}>
          <strong>{item.theory}</strong>
          <span><b>Shared focus</b>{item.sharedFocus}</span>
          <span><b>Important difference</b>{item.difference}</span>
          <EvidenceLinks sources={item.sources} />
        </article>)}
      </div>
    </section>}

    {relationshipLinks.length > 0 && <section className="prose-section">
      <h2>Connected theories</h2>
      <p className="relation-card__intro">Each relation is sourced when source-level data is available. Open a theory to trace its pathway.</p>
      <div className="relation-card-list">
        {relationshipLinks.map((item) => <Link key={item.slug} className="rel-card" href={`/theories/${item.slug}`}>
          <span className="rel-type rel-type--connected">connected</span>
          <div><strong className="rel-card__title">{item.titleEn}</strong><span className="rel-card__desc">Explore this theoretical relationship</span></div>
          <span className="rel-card__arrow" aria-hidden="true">→</span>
        </Link>)}
      </div>
    </section>}

    <RelatedLinks heading="Explore connected research" links={internalLinks.map(({ label, href, reason }) => ({ label, href, description: reason }))} />

    <SuitabilitySection title="4. Suitable Research Topics" entries={presentation.applicableTopics} />
    <SuitabilitySection title="5. When NOT to Use This Theory" entries={presentation.inapplicableTopics} />
    <StringListSection title="6. Common Misapplications" items={presentation.misuseRisks} />

    {hasD3Details && <section className="prose-section">
      <h2>Criticisms & Theoretical Boundaries</h2>
      <div className="responsive-table">
        {presentation.criticisms.map((item) => <article key={item.criticism}>
          <strong>{item.criticism}</strong>
          <span><b>Boundary for use</b>{item.boundary}</span>
          <EvidenceLinks sources={item.sources} />
        </article>)}
      </div>
    </section>}

    {hasResearchDesign && <>
      <ContentAd placement="in-article" />
      <StringListSection title="7. Translating to Analysis Dimensions" items={presentation.analysisDimensions} />
      <section className="prose-section">
        <h2>8. Data Collection Guidance</h2>
        <div className="responsive-table">
          {presentation.dataCollection.map((item) => <article key={item.dimension}>
            <strong>{item.dimension}</strong>
            <span><b>Indicators</b>{item.indicators.join(" · ")}</span>
            <span><b>Collection prompt</b>{item.collectionPrompt}</span>
          </article>)}
        </div>
      </section>
      <section className="prose-section">
        <h2>9. Suggested Chapter Structure</h2>
        <div className="responsive-table">
          {presentation.chapterStructure.map((item) => <article key={item.chapter}>
            <strong>{item.chapter}</strong>
            <span><b>Purpose</b>{item.purpose}</span>
            <span><b>Theory use</b>{item.theoryUse}</span>
          </article>)}
        </div>
      </section>
      <StringListSection title="10. Writing the Theoretical Fit Section" items={presentation.fitWriting} />
    </>}

    {hasDepthCoverage && <StringListSection title="D3 depth coverage" items={presentation.depthCoverage} />}

    <section className="prose-section">
      <h2>{readingPathNumber}. Reading Path</h2>
      <div className="responsive-table">
        {presentation.readingPath.map((item) => <article key={`${item.order}-${item.title}`}>
          <strong>{item.order}. {item.title}</strong>
          {item.level && <span><b>Level</b>{item.level}</span>}
          <span>{item.purpose}</span>
          {item.source && <a href={item.source.url} target="_blank" rel="noreferrer">Open authoritative record ↗</a>}
        </article>)}
      </div>
    </section>

    <RelatedLinks heading="Related theories" links={relationshipLinks.map((item) => ({ label: item.titleEn, href: `/theories/${item.slug}` }))} />
    <ContentAd placement="bottom" />
    <SourceBlock sources={presentation.sourceItems} />
    <RelatedLinks heading="Related scholars" links={theory.scholars.map(({ scholar }) => ({ label: scholar.name, href: `/scholars/${scholar.slug}` }))} />
    <RelatedLinks heading="Related works" links={theory.works.map(({ work }) => ({ label: work.title, href: `/works/${work.slug}` }))} />
    <RelatedLinks heading="Related concepts" links={theory.concepts.map(({ concept }) => ({ label: concept.termEn, href: `/concepts/${concept.slug}` }))} />
    <RelatedLinks heading="Related research topics" links={theory.topics.map(({ topic }) => ({ label: topic.questionEn, href: `/topics/${topic.slug}` }))} />
    <Disclaimer />
  </article>;
}

function EvidenceLinks({ sources }: { sources: Array<{ id: string; citation: string; url: string }> }) {
  if (sources.length === 0) return null;
  return <span><b>Evidence</b>{sources.map((source, index) => <span key={source.id}>
    {index > 0 ? " · " : ""}<a href={source.url} target="_blank" rel="noreferrer">{source.citation}</a>
  </span>)}</span>;
}

function SuitabilitySection({ title, entries }: { title: string; entries: Array<{ topic: string; rationale: string }> }) {
  return <section className="prose-section">
    <h2>{title}</h2>
    <div className="responsive-table">
      {entries.map((entry) => <article key={entry.topic}><strong>{entry.topic}</strong><span>{entry.rationale}</span></article>)}
    </div>
  </section>;
}

function StringListSection({ title, items }: { title: string; items: string[] }) {
  return <section className="prose-section"><h2>{title}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
}
