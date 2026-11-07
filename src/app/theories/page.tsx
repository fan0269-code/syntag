import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { entityMetadata } from "@/lib/seo";
const description = "Published education and sociology theories. Draft and archived records are left off this list.";
export const metadata = entityMetadata({ title: "Theories", description, path: "/theories", type: "website" });
export default async function TheoriesIndexPage() { const items = await loadDataPage(() => getPublishedIndex("theory")); return <PageFrame>{items === DATA_UNAVAILABLE ? <DataUnavailableState /> : <EntityIndexPage type="theory" title="Theories" description={description} items={items} />}</PageFrame>; }
