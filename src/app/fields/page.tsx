import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { entityMetadata } from "@/lib/seo";
const description = "Lists only published records and may be empty. Education and sociology fields appear after publication.";
export const metadata = entityMetadata({ title: "Fields", description, path: "/fields", type: "website" });
export default async function FieldsIndexPage() { const items = await loadDataPage(() => getPublishedIndex("field")); return <PageFrame>{items === DATA_UNAVAILABLE ? <DataUnavailableState /> : <EntityIndexPage type="field" title="Fields" description={description} items={items} />}</PageFrame>; }
