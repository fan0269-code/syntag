import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { publishedIndexIntro } from "@/lib/published-index-intro";
import { entityMetadata } from "@/lib/seo";
const description = "Lists only published records and may be empty. Education and sociology theories appear after publication.";
export const metadata = entityMetadata({ title: "Theories", description, path: "/theories", type: "website" });
export default async function TheoriesIndexPage() { const items = await loadDataPage(() => getPublishedIndex("theory")); const intro = items === DATA_UNAVAILABLE ? description : publishedIndexIntro("theories", items, description); return <PageFrame>{items === DATA_UNAVAILABLE ? <DataUnavailableState /> : <EntityIndexPage type="theory" title="Theories" description={intro} items={items} />}</PageFrame>; }
