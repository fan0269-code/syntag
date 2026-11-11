import { EntityCard } from "@/components/common/EntityCard";
import { catalogSections, type HomeCatalogLists } from "@/lib/home-catalog";
import Link from "next/link";

export function HomePublishedLists({ catalog }: { catalog: HomeCatalogLists }) {
  const sections = catalogSections(catalog);
  if (!sections.length) return null;

  return (
    <div className="home-catalog">
      {sections.map((section) => (
        <section key={section.type} aria-labelledby={`home-${section.type}`}>
          <div className="home-catalog__section-head">
            <h2 id={`home-${section.type}`}>{section.title}</h2>
            <Link className="home-catalog__index-link" href={section.indexHref}>{section.indexLabel}</Link>
          </div>
          <div className="entity-card-grid">
            {section.items.map((item) => (
              <EntityCard
                key={item.href}
                title={item.title}
                summary={item.summary}
                tags={item.tags}
                readingTime="Explore"
                href={item.href}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
