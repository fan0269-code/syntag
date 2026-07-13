import { notFound } from "next/navigation";
import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityArticle } from "@/components/content/EntityArticle";
import { getDisciplineBySlug } from "@/lib/entities/disciplines";
import { generateDisciplineMeta } from "@/lib/seo";
import { publishedSlugs } from "@/lib/static-params";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
export const revalidate = 3600;
export const dynamicParams = false;
export async function generateStaticParams() { return publishedSlugs("discipline"); }
export async function generateMetadata({ params }: PageProps<"/disciplines/[slug]">) { const slug = (await params).slug; const item = await loadDataPage(() => getDisciplineBySlug(slug)); return item && item !== DATA_UNAVAILABLE ? generateDisciplineMeta(item) : {}; }
export default async function DisciplinePage({ params }: PageProps<"/disciplines/[slug]">) { const slug = (await params).slug; const item = await loadDataPage(() => getDisciplineBySlug(slug)); if (item === DATA_UNAVAILABLE) return <PageFrame><DataUnavailableState /></PageFrame>; if (!item) notFound(); return <PageFrame><EntityArticle kind="Discipline" title={item.titleEn} summary={item.descriptionEn} overview={item.overviewEn || item.descriptionEn} breadcrumb={[{ label: "Disciplines", href: "/" }]} links={[...item.fields.map((field) => ({ label: field.titleEn, href: `/fields/${field.slug}`, description: field.descriptionEn })), ...item.theories.map(({ theory }) => ({ label: theory.titleEn, href: `/theories/${theory.slug}`, description: theory.summaryEn }))]} /></PageFrame>; }
