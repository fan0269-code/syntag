import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { entityMetadata } from "@/lib/seo";
export const metadata = entityMetadata({ title: "Topics", description: "Browse research topics that currently have published status.", path: "/topics", type: "website" });
export default async function TopicsIndexPage() { const items = await loadDataPage(() => getPublishedIndex("topic")); return <PageFrame>{items === DATA_UNAVAILABLE ? <DataUnavailableState /> : <EntityIndexPage type="topic" title="Topics" description="Browse research topics that currently have published status. An empty list means none are published yet." items={items} />}</PageFrame>; }
