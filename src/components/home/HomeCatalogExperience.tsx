import { HomePublishedLists } from "@/components/home/HomePublishedLists";
import { SiteReadingGuide } from "@/components/content/SiteReadingGuide";
import { SearchBox } from "@/components/search/SearchBox";
import { catalogIntro, type HomeCatalogLists } from "@/lib/home-catalog";

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
            label="Search for a theory, scholar, concept, or research topic"
            placeholder="Try a theory, scholar, concept, or research topic"
          />
        </div>
      </article>
      <HomePublishedLists catalog={catalog} />
      <div className="home-reading">
        <SiteReadingGuide mode="catalog" />
      </div>
    </div>
  );
}
