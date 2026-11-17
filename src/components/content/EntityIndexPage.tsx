import Link from "next/link";
import { EntityCard } from "@/components/common/EntityCard";
import { entityDetailHref, type EntityType } from "@/lib/entity-routes";
import type { EntityIndexItem } from "@/lib/entities/indexes";

const EMPTY_DISCOVERY_TYPES = new Set<EntityType>(["topic", "concept", "discipline", "field"]);

export function EntityIndexPage({
  type,
  title,
  description,
  items,
  choice,
}: {
  type: EntityType;
  title: string;
  description: string;
  items: EntityIndexItem[];
  choice?: React.ReactNode;
}) {
  return (
    <section className="content-layout entity-index">
      <header className="entity-page__hero">
        <span>Published index</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <p>Syrtag lists a record here only when its status is published. The intended scope is education and sociology. Draft, archived, and local demo records are omitted and are not published scholarship.</p>
      </header>
      {items.length ? (
        <>
          {choice}
          <div className="entity-card-grid">{items.map((item) => <EntityCard key={item.slug} title={item.title} summary={item.summary} tags={item.tags} readingTime="Explore" href={entityDetailHref(type, item.slug)} />)}</div>
        </>
      ) : (
        <section className="catalog-empty">
          <h2>No published {title.toLowerCase()} yet.</h2>
          <p>Indexes list only published records and may be empty. An empty list means nothing of this type is published. It does not mean the literature lacks the subject. Draft, archived, and local demo records are not published scholarship.</p>
          {EMPTY_DISCOVERY_TYPES.has(type) ? (
            <>
              <p>The published catalog is the theory, scholar, and work indexes. This page does not add a graph node to fill the gap.</p>
              <p><Link href="/theories">Theories</Link> · <Link href="/scholars">Scholars</Link> · <Link href="/works">Works</Link></p>
            </>
          ) : (
            <p><Link href="/about">About</Link> · <Link href="/editorial-policy">Editorial policy</Link></p>
          )}
        </section>
      )}
    </section>
  );
}

