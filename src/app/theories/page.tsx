import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { entityMetadata } from "@/lib/seo";
export const metadata = entityMetadata({ title: "Theories", description: "Browse published theoretical frameworks in the knowledge graph.", path: "/theories", type: "website" });
export default async function TheoriesIndexPage() { const items = await loadDataPage(() => getPublishedIndex("theory")); return <PageFrame>{items === DATA_UNAVAILABLE ? <DataUnavailableState /> : <EntityIndexPage type="theory" title="Theories" description="Browse published theoretical frameworks in the knowledge graph." items={items} />}</PageFrame>; }
