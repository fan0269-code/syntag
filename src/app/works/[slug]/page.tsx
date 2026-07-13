import { notFound } from "next/navigation";
import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityArticle } from "@/components/content/EntityArticle";
import { englishContent, text } from "@/lib/content";
import { getWorkBySlug } from "@/lib/entities/works";
import { generateWorkMeta } from "@/lib/seo";
import { publishedSlugs } from "@/lib/static-params";
import { JsonLdBook } from "@/components/seo/JsonLdBook";
import { getInternalLinks } from "@/lib/internal-links";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
export const revalidate = 3600;
export const dynamicParams = false;
export async function generateStaticParams() { return publishedSlugs("work"); }
export async function generateMetadata({ params }: PageProps<"/works/[slug]">) { const slug = (await params).slug; const item = await loadDataPage(() => getWorkBySlug(slug)); return item && item !== DATA_UNAVAILABLE ? generateWorkMeta(item) : {}; }
export default async function WorkPage({ params }: PageProps<"/works/[slug]">) { const state = await loadDataPage(async () => { const item = await getWorkBySlug((await params).slug); return item ? { item, internalLinks: await getInternalLinks("work", item.slug) } : null; }); if (state === DATA_UNAVAILABLE) return <PageFrame><DataUnavailableState /></PageFrame>; if (!state) notFound(); const { item, internalLinks } = state; const content = englishContent(item.contentJsonb); const citation = [item.year, item.publisher, item.doi].filter(Boolean).join(" · "); const authors = Array.isArray(item.authors) ? item.authors.flatMap((author) => typeof author === "object" && author && "name" in author && typeof author.name === "string" ? [author.name] : []) : []; return <><JsonLdBook name={item.title} path={`/works/${item.slug}`} authors={authors} isbn={item.isbn} publisher={item.publisher} /><PageFrame><EntityArticle kind="Foundational work" title={item.title} summary={citation} overview={text(content.overview, `Reading guidance for ${item.title} is being prepared.`)} breadcrumb={[{ label: "Works", href: "/search?q=work" }]} links={internalLinks.map(({ label, href, reason }) => ({ label, href, description: reason }))} /></PageFrame></>; }
