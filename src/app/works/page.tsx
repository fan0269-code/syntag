import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { IndexChoiceGuide } from "@/components/content/IndexChoiceGuide";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { publishedIndexIntro } from "@/lib/published-index-intro";
import { WORK_READING_ROUTES } from "@/lib/published-reading-routes";
import { entityMetadata } from "@/lib/seo";

const description = "Choose among published research works by version, document type, and what a legal record actually supports. The list names only the records returned for this render. An index may be empty.";
export const metadata = entityMetadata({ title: "Works", description, path: "/works", type: "website" });

export default async function WorksIndexPage() {
  const items = await loadDataPage(() => getPublishedIndex("work"));
  const intro = items === DATA_UNAVAILABLE ? description : publishedIndexIntro("works", items, description);
  return (
    <PageFrame adScreen="navigation">
      {items === DATA_UNAVAILABLE ? <DataUnavailableState /> : (
        <EntityIndexPage
          type="work"
          title="Works"
          description={intro}
          items={items}
          choice={(
            <IndexChoiceGuide
              routes={WORK_READING_ROUTES}
              items={items}
              hrefForSlug={(slug) => `/works/${slug}`}
              title="Choose by version and what you can legally read"
              intro="A publisher name is not a reason to choose a book. Use the note to see which dated layer is verified, which question the record can support, and where the legal access page stops."
            />
          )}
        />
      )}
    </PageFrame>
  );
}
