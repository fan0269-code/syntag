import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { entityMetadata } from "@/lib/seo";
export const metadata = entityMetadata({ title: "Disciplines", description: "Browse published research disciplines and their connected fields.", path: "/disciplines", type: "website" });
export default async function DisciplinesIndexPage() { const items = await loadDataPage(() => getPublishedIndex("discipline")); return <PageFrame>{items === DATA_UNAVAILABLE ? <DataUnavailableState /> : <EntityIndexPage type="discipline" title="Disciplines" description="Browse published research disciplines and their connected fields." items={items} />}</PageFrame>; }
