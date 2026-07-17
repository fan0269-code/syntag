import { KnowledgeGraphExperience, type GraphData } from "@/components/graph/KnowledgeGraphExperience";
import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import Link from "next/link";
import { getGraphData } from "@/lib/graph-data";
import { sampleGraph } from "@/lib/graph-sample";
import { resolveHomeGraph } from "@/lib/home-graph";
import { entityDetailHref, isEntityType } from "@/lib/entity-routes";
import { JsonLdGraph } from "@/components/seo/JsonLdGraph";
import { generateHomeMeta } from "@/lib/seo";

export const revalidate = 600;
export const metadata = generateHomeMeta();

export default async function Home() {
  const state = await resolveHomeGraph(
    async () => (await getGraphData("education", "genealogy")) as GraphData | null,
    sampleGraph as GraphData,
    process.env.NODE_ENV === "development",
  );

  if (state.kind === "unavailable") {
    return <PageFrame><DataUnavailableState /></PageFrame>;
  }
  if (state.kind === "empty") {
    return <PageFrame><DataUnavailableState title="The knowledge graph is not published yet" description="Published graph data is not available yet. Please return later or read about Syrtag." /></PageFrame>;
  }

  const isDemo = state.kind === "demo";
  const graph = state.graph;

  return (
    <PageFrame mainClassName="home-main">
      {isDemo && <p className="route-error" role="status">Demo graph: local development sample data only. It is not published content.</p>}
      {!isDemo && <JsonLdGraph items={graph.nodes.map((node) => ({ name: node.label, href: node.data?.articleHref ?? (node.data?.slug && isEntityType(node.type) ? entityDetailHref(node.type, node.data.slug) : undefined), description: node.data?.summary }))} />}
      <section className="home-hero" aria-label="Syrtag theory pathways">
        <header className="home-hero__intro">
          <div>
            <span className="eyebrow">Research theory pathways</span>
            <h1>Make a defensible theory choice.</h1>
            <p className="lead">Start with a research question, explore connected theories, and follow the sources behind each pathway.</p>
            <div className="home-hero__actions">
              <Link className="btn btn-primary" href="/topics">Start with a research question</Link>
              <Link className="btn" href="#graph">Explore the theory graph</Link>
            </div>
          </div>
          <div className="home-hero__meta" aria-label="Graph summary">
            <div><strong>{graph.meta.availableDisciplines?.length ?? 2}</strong><span>Discipline entrances</span></div>
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
    </PageFrame>
  );
}
