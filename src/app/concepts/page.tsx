import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { entityMetadata } from "@/lib/seo";
const description = "Lists only published records and may be empty. Education and sociology concepts appear after publication.";
export const metadata = entityMetadata({ title: "Concepts", description, path: "/concepts", type: "website" });
export default async function ConceptsIndexPage() { const items = await loadDataPage(() => getPublishedIndex("concept")); return <PageFrame>{items === DATA_UNAVAILABLE ? <DataUnavailableState /> : <EntityIndexPage type="concept" title="Concepts" description={description} items={items} />}</PageFrame>; }
