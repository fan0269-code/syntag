import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { EntityIndexPage } from "@/components/content/EntityIndexPage";
import { IndexChoiceGuide } from "@/components/content/IndexChoiceGuide";
import { DATA_UNAVAILABLE, loadDataPage } from "@/lib/data-page";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { publishedIndexIntro } from "@/lib/published-index-intro";
import { THEORY_READING_ROUTES } from "@/lib/published-reading-routes";
import { entityMetadata } from "@/lib/seo";

const description = "Choose among published education and sociology theories. The list names only the records returned for this render. An index may be empty.";
export const metadata = entityMetadata({ title: "Theories", description, path: "/theories", type: "website" });

export default async function TheoriesIndexPage() {
  const items = await loadDataPage(() => getPublishedIndex("theory"));
  const intro = items === DATA_UNAVAILABLE ? description : publishedIndexIntro("theories", items, description);
  return (
    <PageFrame adScreen="navigation">
      {items === DATA_UNAVAILABLE ? <DataUnavailableState /> : (
        <EntityIndexPage
          type="theory"
          title="Theories"
          description={intro}
          items={items}
          choice={(
            <IndexChoiceGuide
              routes={THEORY_READING_ROUTES}
              items={items}
              hrefForSlug={(slug) => `/theories/${slug}`}
              title="Choose by the question you can actually evidence"
              intro="These routes point at published theory pages. They are editorial reading advice. They do not add a theory, and they do not claim that one page forbids another."
            />
          )}
        />
      )}
    </PageFrame>
  );
}
