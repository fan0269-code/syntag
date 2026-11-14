import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { IndexChoiceGuide } from "@/components/content/IndexChoiceGuide";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { publishedIndexIntro } from "@/lib/published-index-intro";
import { SCHOLAR_READING_ROUTES } from "@/lib/published-reading-routes";
import { entityMetadata } from "@/lib/seo";

const description = "Choose a published author record by what it can attribute. The list names only the records returned for this render. An index may be empty.";
export const metadata = entityMetadata({ title: "Scholars", description, path: "/scholars", type: "website" });

export default async function ScholarsIndexPage() {
  const items = await loadDataPage(() => getPublishedIndex("scholar"));
  const intro = items === DATA_UNAVAILABLE ? description : publishedIndexIntro("scholars", items, description);
  return (
    <PageFrame adScreen="navigation">
      {items === DATA_UNAVAILABLE ? <DataUnavailableState /> : (
        <EntityIndexPage
          type="scholar"
          title="Scholars"
          description={intro}
          items={items}
          choice={(
            <IndexChoiceGuide
              routes={SCHOLAR_READING_ROUTES}
              items={items}
              hrefForSlug={(slug) => `/scholars/${slug}`}
              title="Choose by the attribution you need"
              intro="A scholar page attributes a published work or appointment. It is not a curriculum vitae, and it is not the theory page."
            />
          )}
        />
      )}
    </PageFrame>
  );
}
