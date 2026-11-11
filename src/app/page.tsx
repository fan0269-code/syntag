import { KnowledgeGraphExperience, type GraphData } from "@/components/graph/KnowledgeGraphExperience";
import { HomeCatalogExperience } from "@/components/home/HomeCatalogExperience";
import { HomePublishedLists } from "@/components/home/HomePublishedLists";
import { PageFrame } from "@/components/common/PageFrame";
import Link from "next/link";
import { getGraphData } from "@/lib/graph-data";
import { sampleGraph } from "@/lib/graph-sample";
import { getPublishedIndex } from "@/lib/entities/indexes";
import { catalogJsonLdDescriptionFor, catalogSections } from "@/lib/home-catalog";
import { loadHomePageState } from "@/lib/home-page-state";
import { entityDetailHref, isEntityType } from "@/lib/entity-routes";
import { JsonLdGraph } from "@/components/seo/JsonLdGraph";
import { SearchBox } from "@/components/search/SearchBox";
import { SiteReadingGuide } from "@/components/content/SiteReadingGuide";
import { generateHomeMeta } from "@/lib/seo";

function ReadNext() {
  return (
    <nav className="home-catalog-links" aria-label="Read next">
      <Link href="/about">About</Link>
      <Link href="/editorial-policy">Editorial policy</Link>
      <Link href="/privacy">Privacy</Link>
      <Link href="/corrections">Contact and corrections</Link>
      <Link href="/pricing">Pricing</Link>
    </nav>
  );
}

export const revalidate = 600;
export const metadata = generateHomeMeta();

export default async function Home() {
  const surface = await loadHomePageState({
    loadGraph: async () => (await getGraphData("education", "genealogy")) as GraphData | null,
    loadTheories: () => getPublishedIndex("theory"),
    loadScholars: () => getPublishedIndex("scholar"),
    loadWorks: () => getPublishedIndex("work"),
    sampleGraph: sampleGraph as GraphData,
    allowDemo: process.env.NODE_ENV === "development",
  });

  if (surface.kind === "unavailable" || surface.kind === "empty") {
    const title = surface.kind === "empty"
      ? "The knowledge graph is not published yet"
      : "Data temporarily unavailable";
    const lead = surface.kind === "empty"
      ? "Syrtag is a source-aware map for doctoral research in education and sociology. It is not a journal or a writing service."
      : "The catalog could not be loaded. This is an availability state, not a published finding.";
    return (
      <PageFrame mainClassName="home-main">
        <article className="home-reading">
          <header className="home-reading__header" role="status">
            <span className="eyebrow">Education and sociology</span>
            <h1>{title}</h1>
            <p className="lead">{lead}</p>
          </header>
          {surface.kind === "empty" && (
            <section>
              <h2>Current publication status</h2>
              <p>No published graph is available yet. Syrtag only shows records with status published after source-backed human review.</p>
              <p>An empty catalog means drafts, archived seed, and local demo data are withheld. It does not mean the literature does not exist.</p>
              <p>While the public graph is empty, read <Link href="/about">About</Link> and <Link href="/editorial-policy">Editorial policy</Link> for the education and sociology scope and the sourcing rules.</p>
              <p>Search and the catalog indexes use that same rule. Each index lists only published records and may be empty.</p>
            </section>
          )}
          <div className="home-hero__search">
            <SearchBox
              mode="inline"
              label="Search for a theory, scholar, concept, or research topic"
              placeholder="Try a theory, scholar, concept, or research topic"
            />
          </div>
          <h2>Read next</h2>
          <ReadNext />
          <SiteReadingGuide mode={surface.kind} />
        </article>
      </PageFrame>
    );
  }

  if (surface.kind === "catalog") {
    return (
      <PageFrame mainClassName="home-main">
        <JsonLdGraph
          description={catalogJsonLdDescriptionFor(surface.catalog)}
          items={catalogSections(surface.catalog).flatMap((section) => section.items.map((item) => ({
            name: item.title,
            href: item.href,
            description: item.summary,
          })))}
        />
        <HomeCatalogExperience catalog={surface.catalog} />
      </PageFrame>
    );
  }

  const isDemo = surface.kind === "demo";
  const graph = surface.graph;

  return (
    <PageFrame mainClassName="home-main">
      {isDemo && <p className="route-error" role="status">Demo graph: local development sample data only. It is not published content.</p>}
      {!isDemo && <JsonLdGraph items={graph.nodes.map((node) => ({ name: node.label, href: node.data?.articleHref ?? (node.data?.slug && isEntityType(node.type) ? entityDetailHref(node.type, node.data.slug) : undefined), description: node.data?.summary }))} />}
      <section className="home-hero" aria-label="Syrtag theory pathways">
        <header className="home-hero__intro">
          <div>
            <span className="eyebrow">Research theory pathways</span>
            <h1>Explore theory choices with source-aware guidance.</h1>
            <p className="lead">Start with a research question, explore connected theories, and follow the sources behind each pathway.</p>
            <div className="home-hero__search">
              <SearchBox
                mode="inline"
                label="Search for a theory, scholar, concept, or research topic"
                placeholder="Try a theory, scholar, concept, or research topic"
              />
            </div>
            <div className="home-hero__actions">
              <Link className="btn btn-primary" href="/topics">Start with a research question</Link>
              <Link className="btn" href="#graph">Explore the theory graph</Link>
            </div>
          </div>
          <div className="home-hero__meta" aria-label="Graph summary">
            <div><strong>{graph.meta.availableDisciplines?.length ?? "—"}</strong><span>Discipline entrances</span></div>
            <div><strong>Two-way</strong><span>Trace topics and theories in both directions</span></div>
            <div><strong>Sources</strong><span>Follow the evidence behind each pathway</span></div>
          </div>
        </header>
        <section id="graph" tabIndex={-1} aria-label="Interactive theory graph" className="home-graph-shell">
          <div className="home-graph-card__toolbar">
            <div>
              <h2>Explore the theory graph</h2>
              <p>Choose a discipline and explore relationships among research topics, theories, scholars, works, and concepts.</p>
            </div>
            <div className="home-graph-card__status">{graph.meta.nodeCount} nodes · {graph.meta.edgeCount} relationships</div>
          </div>
          <KnowledgeGraphExperience initialGraph={graph} />
        </section>
      </section>
      {surface.kind === "graph" && <HomePublishedLists catalog={surface.catalog} />}
      <SiteReadingGuide mode={isDemo ? "demo" : "published"} />
    </PageFrame>
  );
}
