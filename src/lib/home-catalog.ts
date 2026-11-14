import { entityDetailHref, entityIndexHref, type EntityType } from "./entity-routes.ts";

export type HomeCatalogItem = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
};

export type HomeCatalogLists = {
  theories: HomeCatalogItem[];
  scholars: HomeCatalogItem[];
  works: HomeCatalogItem[];
};

export type HomeSurface<T> =
  | { kind: "unavailable" }
  | { kind: "empty" }
  | { kind: "demo"; graph: T }
  | { kind: "graph"; graph: T; catalog: HomeCatalogLists }
  | { kind: "catalog"; catalog: HomeCatalogLists };

type GraphState<T> =
  | { kind: "content"; graph: T }
  | { kind: "demo"; graph: T }
  | { kind: "empty" }
  | { kind: "unavailable" };

type CatalogLoad =
  | { status: "ready"; catalog: HomeCatalogLists }
  | { status: "unavailable" };

const emptyCatalog: HomeCatalogLists = { theories: [], scholars: [], works: [] };

export function homeCatalogCount(catalog: HomeCatalogLists) {
  return catalog.theories.length + catalog.scholars.length + catalog.works.length;
}

/**
 * A missing discipline graph is not an empty catalog.
 * Published theories, scholars, or works are listed even when disciplines,
 * fields, topics, and concepts have no published rows.
 * A real graph still wins when one is loaded. Demo data does not replace
 * published records.
 */
export function selectHomeSurface<T>(graph: GraphState<T>, catalogLoad: CatalogLoad): HomeSurface<T> {
  if (graph.kind === "content") {
    return {
      kind: "graph",
      graph: graph.graph,
      catalog: catalogLoad.status === "ready" ? catalogLoad.catalog : emptyCatalog,
    };
  }

  if (catalogLoad.status === "ready" && homeCatalogCount(catalogLoad.catalog) > 0) {
    return { kind: "catalog", catalog: catalogLoad.catalog };
  }

  if (graph.kind === "demo" && catalogLoad.status === "unavailable") {
    return { kind: "demo", graph: graph.graph };
  }

  if (graph.kind === "unavailable" || catalogLoad.status === "unavailable") {
    return { kind: "unavailable" };
  }

  if (graph.kind === "demo") return { kind: "demo", graph: graph.graph };
  return { kind: "empty" };
}

function englishList(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function publishedCatalogHeading(catalog: HomeCatalogLists) {
  const kinds = [
    catalog.theories.length ? "theories" : "",
    catalog.scholars.length ? "scholars" : "",
    catalog.works.length ? "works" : "",
  ].filter((kind) => kind.length > 0);
  return `Published ${englishList(kinds)}`;
}

export const catalogEyebrow = "Education and sociology";

export const catalogLead = "Syrtag is a source-aware map for doctoral research in education and sociology. It is not a journal or a writing service. The records below are published. Choose a research question, then open the theory that matches the evidence you can collect.";

export function catalogIntro(catalog: HomeCatalogLists) {
  return {
    eyebrow: catalogEyebrow,
    title: publishedCatalogHeading(catalog),
    lead: catalogLead,
  };
}

export type HomeCatalogSection = {
  type: EntityType;
  title: string;
  indexHref: string;
  indexLabel: string;
  items: Array<HomeCatalogItem & { href: string }>;
};

const sectionDefs = [
  { type: "theory" as const, title: "Theories", items: (catalog: HomeCatalogLists) => catalog.theories },
  { type: "scholar" as const, title: "Scholars", items: (catalog: HomeCatalogLists) => catalog.scholars },
  { type: "work" as const, title: "Works", items: (catalog: HomeCatalogLists) => catalog.works },
];

export function catalogSections(catalog: HomeCatalogLists): HomeCatalogSection[] {
  return sectionDefs.flatMap((section) => {
    const items = section.items(catalog);
    if (!items.length) return [];
    return [{
      type: section.type,
      title: section.title,
      indexHref: entityIndexHref(section.type),
      indexLabel: `All ${section.title.toLowerCase()}`,
      items: items.map((item) => ({ ...item, href: entityDetailHref(section.type, item.slug) })),
    }];
  });
}

export const catalogReadingNote = "The lists below are the published theories, scholars, and works returned for this render. Open a page for its summary, its limits, and its sources. Topic, concept, discipline, and field indexes are not part of this catalog. The lists are a way to open those pages. They are not themselves a scholarly article.";

export const publishedCatalogBoundary = "Public routes list only records whose status is published. Draft, archived, and local demo records are omitted and are not published scholarship.";

export function catalogJsonLdDescriptionFor(catalog: HomeCatalogLists) {
  return `${publishedCatalogHeading(catalog)} in education and sociology. Each listed record is published. This list is not itself a scholarly article.`;
}

export function catalogVisibleCopy(catalog: HomeCatalogLists) {
  const intro = catalogIntro(catalog);
  const sections = catalogSections(catalog);
  return [
    intro.eyebrow,
    intro.title,
    intro.lead,
    catalogReadingNote,
    publishedCatalogBoundary,
    catalogJsonLdDescriptionFor(catalog),
    ...sections.flatMap((section) => [
      section.title,
      section.indexLabel,
      section.indexHref,
      ...section.items.flatMap((item) => [item.title, item.summary, item.href, ...item.tags]),
    ]),
  ].join("\n");
}
