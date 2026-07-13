import { notFound } from "next/navigation";
import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityArticle } from "@/components/content/EntityArticle";
import { getFieldBySlug } from "@/lib/entities/disciplines";
import { generateFieldMeta } from "@/lib/seo";
import { publishedSlugs } from "@/lib/static-params";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
export const revalidate = 3600;
export const dynamicParams = false;
export async function generateStaticParams() { return publishedSlugs("field"); }
export async function generateMetadata({ params }: PageProps<"/fields/[slug]">) { const slug = (await params).slug; const item = await loadDataPage(() => getFieldBySlug(slug)); return item && item !== DATA_UNAVAILABLE ? generateFieldMeta(item) : {}; }
export default async function FieldPage({ params }: PageProps<"/fields/[slug]">) { const slug = (await params).slug; const item = await loadDataPage(() => getFieldBySlug(slug)); if (item === DATA_UNAVAILABLE) return <PageFrame><DataUnavailableState /></PageFrame>; if (!item) notFound(); return <PageFrame><EntityArticle kind="Research field" title={item.titleEn} summary={item.descriptionEn} overview={item.descriptionEn} breadcrumb={[{ label: item.discipline.titleEn, href: `/disciplines/${item.discipline.slug}` }]} links={item.theories.map(({ theory }) => ({ label: theory.titleEn, href: `/theories/${theory.slug}`, description: theory.summaryEn }))} /></PageFrame>; }
