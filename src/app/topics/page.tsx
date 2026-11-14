import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { entityMetadata } from "@/lib/seo";
const description = "No topics are published. This index may be empty. It is not a catalog entry. Theories, scholars, and works are the published records.";
export const metadata = entityMetadata({ title: "Topics", description, path: "/topics", type: "website", noindex: true });
export default async function TopicsIndexPage() { const items = await loadDataPage(() => getPublishedIndex("topic")); return <PageFrame adScreen="empty-type">{items === DATA_UNAVAILABLE ? <DataUnavailableState /> : <EntityIndexPage type="topic" title="Topics" description={description} items={items} />}</PageFrame>; }
