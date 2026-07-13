import { EntityCard } from "@/components/common/EntityCard";
import { entityDetailHref, type EntityType } from "@/lib/entity-routes";
import type { EntityIndexItem } from "@/lib/entities/indexes";

export function EntityIndexPage({ type, title, description, items }: { type: EntityType; title: string; description: string; items: EntityIndexItem[] }) {
  return <section className="content-layout entity-index"><header className="entity-page__hero"><span>Browse</span><h1>{title}</h1><p>{description}</p></header>{items.length ? <div className="entity-card-grid">{items.map((item) => <EntityCard key={item.slug} title={item.title} summary={item.summary} tags={item.tags} readingTime="Explore" href={entityDetailHref(type, item.slug)} />)}</div> : <section className="empty-state"><h2>No published {title.toLowerCase()} yet.</h2><p>Please return later or explore another part of the knowledge graph.</p></section>}</section>;
}
