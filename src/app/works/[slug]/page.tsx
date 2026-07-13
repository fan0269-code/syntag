import { notFound } from "next/navigation";
import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityArticle } from "@/components/content/EntityArticle";
import { ProseSection } from "@/components/content/ContentBlocks";
import { englishContent } from "@/lib/content";
import { getWorkBySlug } from "@/lib/entities/works";
import { sourceItemsForEntity } from "@/lib/knowledge-entity-presentation";
import { isWorkContent } from "@/data/templates/knowledge-entity-template";
import { generateWorkMeta } from "@/lib/seo";
import { publishedSlugs } from "@/lib/static-params";
import { JsonLdBook } from "@/components/seo/JsonLdBook";
import { getInternalLinks } from "@/lib/internal-links";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
export const revalidate = 3600;
export const dynamicParams = false;
export async function generateStaticParams() { return publishedSlugs("work"); }
export async function generateMetadata({ params }: PageProps<"/works/[slug]">) { const slug = (await params).slug; const item = await loadDataPage(() => getWorkBySlug(slug)); return item && item !== DATA_UNAVAILABLE ? generateWorkMeta(item) : {}; }
export default async function WorkPage({ params }: PageProps<"/works/[slug]">) { const state = await loadDataPage(async () => { const item = await getWorkBySlug((await params).slug); return item ? { item, internalLinks: await getInternalLinks("work", item.slug) } : null; }); if (state === DATA_UNAVAILABLE) return <PageFrame><DataUnavailableState /></PageFrame>; if (!state) notFound(); const { item, internalLinks } = state; const content = englishContent(item.contentJsonb); if (!isWorkContent(content)) notFound(); const citation = [item.year, item.publisher, item.doi].filter(Boolean).join(" · "); const authors = Array.isArray(item.authors) ? item.authors.flatMap((author) => typeof author === "object" && author && "name" in author && typeof author.name === "string" ? [author.name] : []) : []; const sourceById = new Map(content.sources.map((source) => [source.id, source])); return <><JsonLdBook name={item.title} path={`/works/${item.slug}`} authors={authors} isbn={item.isbn} publisher={item.publisher} /><PageFrame><EntityArticle kind="Foundational work" title={item.title} summary={citation} overview={content.overview} breadcrumb={[{ label: "Works", href: "/works" }]} links={internalLinks.map(({ label, href, reason }) => ({ label, href, description: reason }))} sources={sourceItemsForEntity(content)}><ProseSection title="Core Question">{content.core_question}</ProseSection><ProseSection title="Central Argument">{content.central_argument}</ProseSection><ProseSection title="Theoretical Contribution">{content.theoretical_contribution}</ProseSection><section className="prose-section"><h2>Theory Relationships</h2><ul>{item.theories.map(({ theory, relationship }) => <li key={theory.slug}><a href={`/theories/${theory.slug}`}>{theory.titleEn}</a> — {relationship.replaceAll("_", " ")}</li>)}</ul></section><section className="prose-section"><h2>Reading Focus</h2><ul>{content.reading_focus.map((item) => <li key={item}>{item}</li>)}</ul></section><section className="prose-section"><h2>Legal Access Path</h2><ul>{content.legal_access.map((entry) => { const source = sourceById.get(entry.source_id); return <li key={entry.source_id}>{source ? <a href={source.url} target="_blank" rel="noreferrer">{entry.label}</a> : entry.label} — {entry.guidance}</li>; })}</ul></section></EntityArticle></PageFrame></>; }
