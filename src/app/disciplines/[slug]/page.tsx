import { notFound } from "next/navigation";

import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityArticle } from "@/components/content/EntityArticle";
import { PathwayContentSections } from "@/components/content/PathwayContentSections";
import { pathwayContentFromPayload } from "@/data/templates/pathway-template";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getDisciplineBySlug } from "@/lib/entities/disciplines";
import { sourceItemsForEntity } from "@/lib/knowledge-entity-presentation";
import { generateDisciplineMeta } from "@/lib/seo";
import { publishedSlugs } from "@/lib/static-params";

export const revalidate = 3600;
export const dynamicParams = false;

export async function generateStaticParams() {
  return publishedSlugs("discipline");
}

export async function generateMetadata({ params }: PageProps<"/disciplines/[slug]">) {
  const slug = (await params).slug;
  const item = await loadDataPage(() => getDisciplineBySlug(slug));
  return item && item !== DATA_UNAVAILABLE ? generateDisciplineMeta(item) : {};
}

export default async function DisciplinePage({ params }: PageProps<"/disciplines/[slug]">) {
  const slug = (await params).slug;
  const item = await loadDataPage(() => getDisciplineBySlug(slug));
  if (item === DATA_UNAVAILABLE) return <PageFrame><DataUnavailableState /></PageFrame>;
  const content = item ? pathwayContentFromPayload(item.contentJsonb) : null;
  if (!item || !content) notFound();

  return <PageFrame><EntityArticle kind="Discipline" title={item.titleEn} summary={item.descriptionEn} overview={content.overview} breadcrumb={[{ label: "Disciplines", href: "/disciplines" }]} sources={sourceItemsForEntity(content)} links={[...item.fields.map((field) => ({ label: field.titleEn, href: `/fields/${field.slug}`, description: field.descriptionEn })), ...item.theories.map(({ theory }) => ({ label: theory.titleEn, href: `/theories/${theory.slug}`, description: theory.summaryEn }))]}><PathwayContentSections content={content} /></EntityArticle></PageFrame>;
}
