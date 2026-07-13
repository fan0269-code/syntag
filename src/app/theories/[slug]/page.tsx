import { notFound } from "next/navigation";
import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { TheoryArticle } from "@/components/content/TheoryArticle";
import { englishContent } from "@/lib/content";
import { getTheoryBySlug } from "@/lib/entities/theories";
import { generateTheoryMeta } from "@/lib/seo";
import { publishedSlugs } from "@/lib/static-params";
import { JsonLdArticle } from "@/components/seo/JsonLdArticle";
import { getInternalLinks } from "@/lib/internal-links";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";

export const revalidate = 3600;
export const dynamicParams = false;
export async function generateStaticParams() { return publishedSlugs("theory"); }
export async function generateMetadata({ params }: PageProps<"/theories/[slug]">) { const slug = (await params).slug; const theory = await loadDataPage(() => getTheoryBySlug(slug)); return theory && theory !== DATA_UNAVAILABLE ? generateTheoryMeta(theory) : {}; }
export default async function TheoryPage({ params }: PageProps<"/theories/[slug]">) { const state = await loadDataPage(async () => { const theory = await getTheoryBySlug((await params).slug); return theory ? { theory, internalLinks: await getInternalLinks("theory", theory.slug) } : null; }); if (state === DATA_UNAVAILABLE) return <PageFrame><DataUnavailableState /></PageFrame>; if (!state) notFound(); const { theory, internalLinks } = state; return <><JsonLdArticle headline={theory.titleEn} description={theory.summaryEn || "A source-aware theoretical framework guide."} path={`/theories/${theory.slug}`} datePublished={theory.publishedAt} dateModified={theory.updatedAt} /><PageFrame><TheoryArticle theory={{ ...theory, content: englishContent(theory.contentJsonb) }} internalLinks={internalLinks} /></PageFrame></>; }
