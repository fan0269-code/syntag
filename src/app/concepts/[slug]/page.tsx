import { notFound } from "next/navigation";
import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityArticle } from "@/components/content/EntityArticle";
import { RelatedLinks } from "@/components/content/ContentBlocks";
import { englishContent } from "@/lib/content";
import { getConceptBySlug } from "@/lib/entities/concepts";
import { sourceItemsForEntity } from "@/lib/knowledge-entity-presentation";
import { isConceptContent } from "@/data/templates/knowledge-entity-template";
import { entityMetadata } from "@/lib/seo";
import { publishedSlugs } from "@/lib/static-params";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
export const revalidate = 3600;
export const dynamicParams = false;
export async function generateStaticParams() { return publishedSlugs("concept"); }
export async function generateMetadata({ params }: PageProps<"/concepts/[slug]">) { const slug = (await params).slug; const item = await loadDataPage(() => getConceptBySlug(slug)); return item && item !== DATA_UNAVAILABLE ? entityMetadata({ title: item.termEn, description: item.definitionEn, path: `/concepts/${item.slug}` }) : {}; }
export default async function ConceptPage({ params }: PageProps<"/concepts/[slug]">) { const slug = (await params).slug; const item = await loadDataPage(() => getConceptBySlug(slug)); if (item === DATA_UNAVAILABLE) return <PageFrame><DataUnavailableState /></PageFrame>; if (!item) notFound(); const content = englishContent(item.contentJsonb); if (!isConceptContent(content)) notFound(); const theoryBySlug = new Map(item.theories.map(({ theory }) => [theory.slug, theory])); return <PageFrame><EntityArticle kind="Concept" title={item.termEn} summary={item.definitionEn} overview={content.overview} breadcrumb={[{ label: "Concepts", href: "/concepts" }]} links={item.theories.map(({ theory }) => ({ label: theory.titleEn, href: `/theories/${theory.slug}`, description: theory.summaryEn }))} sources={sourceItemsForEntity(content)}><section className="prose-section"><h2>Meanings Across Theories</h2><div className="responsive-table">{content.theory_variations.map((entry) => { const theory = theoryBySlug.get(entry.theory_slug); return <article key={entry.theory_slug}><strong>{theory ? <a href={`/theories/${theory.slug}`}>{theory.titleEn}</a> : entry.theory_slug.replaceAll("-", " ")}</strong><span>{entry.relationship}: {entry.meaning}</span></article>; })}</div></section><section className="prose-section"><h2>Observable Research Manifestations</h2><ul>{content.observable_manifestations.map((entry) => <li key={entry}>{entry}</li>)}</ul></section><section className="prose-section"><h2>Common Misuse</h2><ul>{content.misuse_risks.map((entry) => <li key={entry}>{entry}</li>)}</ul></section><RelatedLinks heading="Related works" links={content.related_works.map((entry) => ({ label: entry.title, href: `/works/${entry.work_slug}`, description: `${entry.relationship}: ${entry.relevance}` }))} /><section className="prose-section"><h2>Related scholars</h2><ul>{content.related_scholars.map((entry) => <li key={entry.name}>{entry.scholar_slug ? <a href={`/scholars/${entry.scholar_slug}`}>{entry.name}</a> : entry.name} — {entry.relevance}</li>)}</ul></section></EntityArticle></PageFrame>; }
