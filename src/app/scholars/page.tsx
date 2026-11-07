import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { entityMetadata } from "@/lib/seo";
const description = "Published scholar profiles in the education and sociology scope. Draft profiles stay off this list.";
export const metadata = entityMetadata({ title: "Scholars", description, path: "/scholars", type: "website" });
export default async function ScholarsIndexPage() { const items = await loadDataPage(() => getPublishedIndex("scholar")); return <PageFrame>{items === DATA_UNAVAILABLE ? <DataUnavailableState /> : <EntityIndexPage type="scholar" title="Scholars" description={description} items={items} />}</PageFrame>; }
