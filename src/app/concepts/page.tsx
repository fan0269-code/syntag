import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { entityMetadata } from "@/lib/seo";
export const metadata = entityMetadata({ title: "Concepts", description: "Browse published concepts used across theoretical frameworks.", path: "/concepts", type: "website" });
export default async function ConceptsIndexPage() { const items = await loadDataPage(() => getPublishedIndex("concept")); return <PageFrame>{items === DATA_UNAVAILABLE ? <DataUnavailableState /> : <EntityIndexPage type="concept" title="Concepts" description="Browse published concepts used across theoretical frameworks." items={items} />}</PageFrame>; }
