import { DATA_UNAVAILABLE, loadDataPage } from "./data-page.ts";
import { type HomeCatalogItem, type HomeCatalogLists, type HomeSurface, selectHomeSurface } from "./home-catalog.ts";
import { resolveHomeGraph } from "./home-graph.ts";

export async function loadHomePageState<T>(deps: {
  loadGraph: () => Promise<T | null>;
  loadTheories: () => Promise<HomeCatalogItem[]>;
  loadScholars: () => Promise<HomeCatalogItem[]>;
  loadWorks: () => Promise<HomeCatalogItem[]>;
  sampleGraph: T;
  allowDemo: boolean;
}): Promise<HomeSurface<T>> {
  const [graph, theories, scholars, works] = await Promise.all([
    resolveHomeGraph(deps.loadGraph, deps.sampleGraph, deps.allowDemo),
    loadDataPage(deps.loadTheories),
    loadDataPage(deps.loadScholars),
    loadDataPage(deps.loadWorks),
  ]);
  const catalogLoad = theories === DATA_UNAVAILABLE || scholars === DATA_UNAVAILABLE || works === DATA_UNAVAILABLE
    ? { status: "unavailable" as const }
    : { status: "ready" as const, catalog: { theories, scholars, works } satisfies HomeCatalogLists };

  return selectHomeSurface(graph, catalogLoad);
}
