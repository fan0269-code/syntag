import { notFound } from "next/navigation";
import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityArticle } from "@/components/content/EntityArticle";
import { englishContent, text } from "@/lib/content";
import { getScholarBySlug } from "@/lib/entities/scholars";
import { generateScholarMeta } from "@/lib/seo";
import { publishedSlugs } from "@/lib/static-params";
import { JsonLdPerson } from "@/components/seo/JsonLdPerson";
import { getInternalLinks } from "@/lib/internal-links";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
export const revalidate = 3600;
export const dynamicParams = false;
export async function generateStaticParams() { return publishedSlugs("scholar"); }
export async function generateMetadata({ params }: PageProps<"/scholars/[slug]">) { const slug = (await params).slug; const item = await loadDataPage(() => getScholarBySlug(slug)); return item && item !== DATA_UNAVAILABLE ? generateScholarMeta(item) : {}; }
export default async function ScholarPage({ params }: PageProps<"/scholars/[slug]">) { const state = await loadDataPage(async () => { const item = await getScholarBySlug((await params).slug); return item ? { item, internalLinks: await getInternalLinks("scholar", item.slug) } : null; }); if (state === DATA_UNAVAILABLE) return <PageFrame><DataUnavailableState /></PageFrame>; if (!state) notFound(); const { item, internalLinks } = state; const content = englishContent(item.contentJsonb); return <><JsonLdPerson name={item.name} description={item.bioEn || "Scholar profile and theoretical contributions."} path={`/scholars/${item.slug}`} /><PageFrame><EntityArticle kind="Scholar" title={item.name} summary={item.bioEn} overview={text(content.overview, item.bioEn || undefined)} breadcrumb={[{ label: "Scholars", href: "/search?q=scholar" }]} links={internalLinks.map(({ label, href, reason }) => ({ label, href, description: reason }))} /></PageFrame></>; }
