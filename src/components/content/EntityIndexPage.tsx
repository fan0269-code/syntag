import Link from "next/link";
import { EntityCard } from "@/components/common/EntityCard";
import { entityDetailHref, type EntityType } from "@/lib/entity-routes";
import type { EntityIndexItem } from "@/lib/entities/indexes";

export function EntityIndexPage({ type, title, description, items }: { type: EntityType; title: string; description: string; items: EntityIndexItem[] }) {
  return (
    <section className="content-layout entity-index">
      <header className="entity-page__hero">
        <span>Browse</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <p>Syrtag lists a record here only when its status is published. The intended scope is education and sociology. Draft, archived, and local demo records are omitted and are not published scholarship.</p>
      </header>
      {items.length ? (
        <div className="entity-card-grid">{items.map((item) => <EntityCard key={item.slug} title={item.title} summary={item.summary} tags={item.tags} readingTime="Explore" href={entityDetailHref(type, item.slug)} />)}</div>
      ) : (
        <section className="catalog-empty">
          <h2>No published {title.toLowerCase()} yet.</h2>
          <p>Indexes list only published records. Return later, or read how publication status works on About. Draft, archived, and local demo records are not published scholarship.</p>
          <p><Link href="/about">About this boundary</Link> · <Link href="/editorial-policy">Editorial policy</Link></p>
        </section>
      )}
    </section>
  );
}
