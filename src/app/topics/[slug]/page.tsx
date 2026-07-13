import { notFound } from "next/navigation";
import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityArticle } from "@/components/content/EntityArticle";
import { getTheoryComparison, getTopicBySlug } from "@/lib/entities/topics";
import { generateTopicMeta } from "@/lib/seo";
import { publishedSlugs } from "@/lib/static-params";
import { JsonLdArticle } from "@/components/seo/JsonLdArticle";
import { getInternalLinks } from "@/lib/internal-links";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
export const revalidate = 3600;
export const dynamicParams = false;
export async function generateStaticParams() { return publishedSlugs("topic"); }
export async function generateMetadata({ params }: PageProps<"/topics/[slug]">) { const slug = (await params).slug; const item = await loadDataPage(() => getTopicBySlug(slug)); return item && item !== DATA_UNAVAILABLE ? generateTopicMeta(item) : {}; }
export default async function TopicPage({ params }: PageProps<"/topics/[slug]">) { const state = await loadDataPage(async () => { const item = await getTopicBySlug((await params).slug); if (!item) return null; const [comparison, internalLinks] = await Promise.all([getTheoryComparison(item.slug), getInternalLinks("topic", item.slug)]); return { item, comparison, internalLinks }; }); if (state === DATA_UNAVAILABLE) return <PageFrame><DataUnavailableState /></PageFrame>; if (!state) notFound(); const { item, comparison, internalLinks } = state; return <><JsonLdArticle headline={item.questionEn} description="Compare research theory fit for this doctoral research topic." path={`/topics/${item.slug}`} datePublished={item.publishedAt} dateModified={item.updatedAt} /><PageFrame><EntityArticle kind="Research topic" title={item.questionEn} summary="Compare theory pathways for this research question." overview="This topic page makes theory selection explicit: compare each candidate theory, the fit it provides, and the limits to test before committing to a framework." breadcrumb={[{ label: "Topics", href: "/search?q=research" }]} links={internalLinks.map(({ label, href, reason }) => ({ label, href, description: reason }))}><section className="prose-section theory-comparison"><h2>Theory fit comparison</h2><div className="responsive-table">{comparison.map((relation) => <article key={relation.theoryId}><strong>{relation.theory.titleEn}</strong><span><b>Fit</b>{relation.suitability}</span><span><b>Why it fits</b>{relation.suitabilityNotesEn || "Editorial suitability notes are being prepared."}</span><span><b>Core scholars</b>{relation.theory.scholars.map(({ scholar }) => scholar.name).join(", ") || "—"}</span></article>)}</div></section></EntityArticle></PageFrame></>; }
