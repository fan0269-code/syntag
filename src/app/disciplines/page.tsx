import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { entityMetadata } from "@/lib/seo";
const description = "Lists only published records and may be empty. Coverage is education and sociology, not every discipline.";
export const metadata = entityMetadata({ title: "Disciplines", description, path: "/disciplines", type: "website" });
export default async function DisciplinesIndexPage() { const items = await loadDataPage(() => getPublishedIndex("discipline")); return <PageFrame>{items === DATA_UNAVAILABLE ? <DataUnavailableState /> : <EntityIndexPage type="discipline" title="Disciplines" description={description} items={items} />}</PageFrame>; }
