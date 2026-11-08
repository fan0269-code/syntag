import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { entityMetadata } from "@/lib/seo";
const description = "Lists only published records and may be empty. Education and sociology topics appear after publication.";
export const metadata = entityMetadata({ title: "Topics", description, path: "/topics", type: "website" });
export default async function TopicsIndexPage() { const items = await loadDataPage(() => getPublishedIndex("topic")); return <PageFrame>{items === DATA_UNAVAILABLE ? <DataUnavailableState /> : <EntityIndexPage type="topic" title="Topics" description={description} items={items} />}</PageFrame>; }
