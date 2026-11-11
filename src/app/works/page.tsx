import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { publishedIndexIntro } from "@/lib/published-index-intro";
import { entityMetadata } from "@/lib/seo";
const description = "Lists only published research works and may be empty. Draft and archived works stay off this list.";
export const metadata = entityMetadata({ title: "Works", description, path: "/works", type: "website" });
export default async function WorksIndexPage() { const items = await loadDataPage(() => getPublishedIndex("work")); const intro = items === DATA_UNAVAILABLE ? description : publishedIndexIntro("works", items, description); return <PageFrame>{items === DATA_UNAVAILABLE ? <DataUnavailableState /> : <EntityIndexPage type="work" title="Works" description={intro} items={items} />}</PageFrame>; }
