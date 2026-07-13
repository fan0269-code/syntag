import { notFound } from "next/navigation";
import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityArticle } from "@/components/content/EntityArticle";
import { englishContent, text } from "@/lib/content";
import { getConceptBySlug } from "@/lib/entities/concepts";
import { entityMetadata } from "@/lib/seo";
import { publishedSlugs } from "@/lib/static-params";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
export const revalidate = 3600;
export const dynamicParams = false;
export async function generateStaticParams() { return publishedSlugs("concept"); }
export async function generateMetadata({ params }: PageProps<"/concepts/[slug]">) { const slug = (await params).slug; const item = await loadDataPage(() => getConceptBySlug(slug)); return item && item !== DATA_UNAVAILABLE ? entityMetadata({ title: item.termEn, description: item.definitionEn, path: `/concepts/${item.slug}` }) : {}; }
export default async function ConceptPage({ params }: PageProps<"/concepts/[slug]">) { const slug = (await params).slug; const item = await loadDataPage(() => getConceptBySlug(slug)); if (item === DATA_UNAVAILABLE) return <PageFrame><DataUnavailableState /></PageFrame>; if (!item) notFound(); const content = englishContent(item.contentJsonb); return <PageFrame><EntityArticle kind="Concept" title={item.termEn} summary={item.definitionEn} overview={text(content.overview, item.definitionEn || undefined)} breadcrumb={[{ label: "Concepts", href: "/search?q=concept" }]} links={item.theories.map(({ theory }) => ({ label: theory.titleEn, href: `/theories/${theory.slug}`, description: theory.summaryEn }))} /></PageFrame>; }
