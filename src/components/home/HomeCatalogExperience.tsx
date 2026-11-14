import { HomePublishedLists } from "@/components/home/HomePublishedLists";
import { SiteReadingGuide } from "@/components/content/SiteReadingGuide";
import { IndexChoiceGuide } from "@/components/content/IndexChoiceGuide";
import { SearchBox } from "@/components/search/SearchBox";
import { catalogIntro, type HomeCatalogLists } from "@/lib/home-catalog";
import { THEORY_READING_ROUTES } from "@/lib/published-reading-routes";

export function HomeCatalogExperience({ catalog }: { catalog: HomeCatalogLists }) {
  const intro = catalogIntro(catalog);

  return (
    <div className="home-catalog-page">
      <article className="home-reading">
        <header className="home-reading__header">
          <span className="eyebrow">{intro.eyebrow}</span>
          <h1>{intro.title}</h1>
          <p className="lead">{intro.lead}</p>
        </header>
        <div className="home-hero__search">
          <SearchBox
            mode="inline"
            label="Search published theories, scholars, and works"
            placeholder="Try a theory, scholar, or work"
          />
        </div>
        <IndexChoiceGuide
          routes={THEORY_READING_ROUTES}
          items={catalog.theories}
          hrefForSlug={(slug) => `/theories/${slug}`}
          title="Start from the question, not from an empty index"
          intro="Four questions cover the published theories: classroom identity, participation in a practice, a life trajectory, and a policy agenda. Each link is an existing theory page. None of them is a new entity."
        />
      </article>
      <HomePublishedLists catalog={catalog} />
      <div className="home-reading">
        <SiteReadingGuide mode="catalog" />
      </div>
    </div>
  );
}
