import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { entityMetadata } from "@/lib/seo";
const description = "Lists only published records and may be empty. Education and sociology scholar profiles appear after publication.";
export const metadata = entityMetadata({ title: "Scholars", description, path: "/scholars", type: "website" });
export default async function ScholarsIndexPage() { const items = await loadDataPage(() => getPublishedIndex("scholar")); return <PageFrame>{items === DATA_UNAVAILABLE ? <DataUnavailableState /> : <EntityIndexPage type="scholar" title="Scholars" description={description} items={items} />}</PageFrame>; }
