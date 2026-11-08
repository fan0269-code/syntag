import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { entityMetadata } from "@/lib/seo";
export const metadata = entityMetadata({ title: "Scholars", description: "Browse scholar profiles that currently have published status.", path: "/scholars", type: "website" });
export default async function ScholarsIndexPage() { const items = await loadDataPage(() => getPublishedIndex("scholar")); return <PageFrame>{items === DATA_UNAVAILABLE ? <DataUnavailableState /> : <EntityIndexPage type="scholar" title="Scholars" description="Browse scholar profiles that currently have published status. An empty list means none are published yet." items={items} />}</PageFrame>; }
