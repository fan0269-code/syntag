import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { entityMetadata } from "@/lib/seo";
const description = "Syrtag lists published research works in education and sociology. Draft and archived works are omitted.";
export const metadata = entityMetadata({ title: "Works", description, path: "/works", type: "website" });
export default async function WorksIndexPage() { const items = await loadDataPage(() => getPublishedIndex("work")); return <PageFrame>{items === DATA_UNAVAILABLE ? <DataUnavailableState /> : <EntityIndexPage type="work" title="Works" description={description} items={items} />}</PageFrame>; }
