import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { entityMetadata } from "@/lib/seo";
export const metadata = entityMetadata({ title: "Scholars", description: "Browse published scholar profiles and theoretical contributions.", path: "/scholars", type: "website" });
export default async function ScholarsIndexPage() { const items = await loadDataPage(() => getPublishedIndex("scholar")); return <PageFrame>{items === DATA_UNAVAILABLE ? <DataUnavailableState /> : <EntityIndexPage type="scholar" title="Scholars" description="Browse published scholar profiles and theoretical contributions." items={items} />}</PageFrame>; }
