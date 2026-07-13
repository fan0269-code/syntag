import { notFound } from "next/navigation";

import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityArticle } from "@/components/content/EntityArticle";
import { PathwayContentSections } from "@/components/content/PathwayContentSections";
import { JsonLdArticle } from "@/components/seo/JsonLdArticle";
import { pathwayContentFromPayload } from "@/data/templates/pathway-template";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getInternalLinks } from "@/lib/internal-links";
import { sourceItemsForEntity } from "@/lib/knowledge-entity-presentation";
import { getTheoryComparison, getTopicBySlug } from "@/lib/entities/topics";
import { generateTopicMeta } from "@/lib/seo";
import { publishedSlugs } from "@/lib/static-params";

export const revalidate = 3600;
export const dynamicParams = false;

export async function generateStaticParams() {
  return publishedSlugs("topic");
}

export async function generateMetadata({ params }: PageProps<"/topics/[slug]">) {
  const slug = (await params).slug;
  const item = await loadDataPage(() => getTopicBySlug(slug));
  return item && item !== DATA_UNAVAILABLE ? generateTopicMeta(item) : {};
}

export default async function TopicPage({ params }: PageProps<"/topics/[slug]">) {
  const state = await loadDataPage(async () => {
    const item = await getTopicBySlug((await params).slug);
    if (!item) return null;
    const [comparison, internalLinks] = await Promise.all([getTheoryComparison(item.slug), getInternalLinks("topic", item.slug)]);
    return { item, comparison, internalLinks };
  });
  if (state === DATA_UNAVAILABLE) return <PageFrame><DataUnavailableState /></PageFrame>;
  const content = state ? pathwayContentFromPayload(state.item.contentJsonb) : null;
  if (!state || !content) notFound();

  const { item, comparison, internalLinks } = state;
  return <><JsonLdArticle headline={item.questionEn} description="Compare theory pathways for this doctoral research topic." path={`/topics/${item.slug}`} datePublished={item.publishedAt} dateModified={item.updatedAt} /><PageFrame><EntityArticle kind="Research topic" title={item.questionEn} summary="Compare theory pathways for this research question." overview={content.overview} breadcrumb={[{ label: "Topics", href: "/topics" }]} sources={sourceItemsForEntity(content)} links={internalLinks.map(({ label, href, reason }) => ({ label, href, description: reason }))}><PathwayContentSections content={content} /><section className="prose-section theory-comparison"><h2>Published topic-theory relations</h2><div className="responsive-table">{comparison.map((relation) => <article key={relation.theoryId}><strong>{relation.theory.titleEn}</strong><span><b>Fit</b>{relation.suitability}</span><span><b>Recommendation</b>{relation.recommendation?.replaceAll("_", " ")}</span><span><b>Why this route</b>{relation.suitabilityNotesEn}</span><span><b>Core scholars</b>{relation.theory.scholars.map(({ scholar }) => scholar.name).join(", ") || "—"}</span></article>)}</div></section></EntityArticle></PageFrame></>;
}
