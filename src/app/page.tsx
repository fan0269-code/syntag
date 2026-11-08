import { KnowledgeGraphExperience, type GraphData } from "@/components/graph/KnowledgeGraphExperience";
import { PageFrame } from "@/components/common/PageFrame";
import Link from "next/link";
import { getGraphData } from "@/lib/graph-data";
import { sampleGraph } from "@/lib/graph-sample";
import { resolveHomeGraph } from "@/lib/home-graph";
import { entityDetailHref, isEntityType } from "@/lib/entity-routes";
import { JsonLdGraph } from "@/components/seo/JsonLdGraph";
import { SearchBox } from "@/components/search/SearchBox";
import { SiteReadingGuide } from "@/components/content/SiteReadingGuide";
import { generateHomeMeta } from "@/lib/seo";

export const revalidate = 600;
export const metadata = generateHomeMeta();

const searchLabel = "Search published theories, scholars, and topics";
const searchPlaceholder = "Theory, scholar, or topic";

export default async function Home() {
  const state = await resolveHomeGraph(
    async () => (await getGraphData("education", "genealogy")) as GraphData | null,
    sampleGraph as GraphData,
    process.env.NODE_ENV === "development",
  );

  if (state.kind === "unavailable" || state.kind === "empty") {
    const title = state.kind === "empty"
      ? "The knowledge graph is not published yet"
      : "Data temporarily unavailable";
    const lead = state.kind === "empty"
      ? "Syrtag is a source-aware map for doctoral research in education and sociology. It is not a journal or a writing service."
      : "The catalog could not be loaded. This is an availability state, not a published finding.";
    return (
      <PageFrame mainClassName="home-main">
        <article className="home-reading">
          <header className="home-reading__header" role="status">
            <span className="eyebrow">Publication status</span>
            <h1>{title}</h1>
            <p className="lead">{lead}</p>
          </header>
          {state.kind === "empty" && (
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
              label={searchLabel}
              placeholder={searchPlaceholder}
            />
          </div>
          <SiteReadingGuide mode={state.kind} />
        </article>
      </PageFrame>
    );
  }

  const isDemo = state.kind === "demo";
  const graph = state.graph;

  return (
    <PageFrame mainClassName="home-main">
      {isDemo && <p className="home-demo-note" role="status">Demo graph: local development sample data only. It is not published content.</p>}
      {!isDemo && <JsonLdGraph items={graph.nodes.map((node) => ({ name: node.label, href: node.data?.articleHref ?? (node.data?.slug && isEntityType(node.type) ? entityDetailHref(node.type, node.data.slug) : undefined), description: node.data?.summary }))} />}
      <section className="home-hero" aria-label="Syrtag theory pathways">
        <header className="home-hero__intro">
          <div>
            <span className="eyebrow">Research theory pathways</span>
            <h1>Map a doctoral theory choice in education and sociology.</h1>
            <p className="lead">Compare connected theories, then open the sources behind each path.</p>
            <div className="home-hero__search">
              <SearchBox
                mode="inline"
                label={searchLabel}
                placeholder={searchPlaceholder}
              />
            </div>
            <div className="home-hero__actions">
              <Link className="btn" href="#graph">Explore the theory graph</Link>
            </div>
          </div>
        </header>
        <section id="graph" tabIndex={-1} aria-label="Interactive theory graph" className="home-graph-shell">
          <div className="home-graph-card__toolbar">
            <div>
              <h2>Theory graph</h2>
              <p>Education genealogy from published or demo records. Open a node for its summary, then follow the linked page.</p>
            </div>
            <div className="home-graph-card__status">{graph.meta.nodeCount} nodes · {graph.meta.edgeCount} relationships</div>
          </div>
          <KnowledgeGraphExperience initialGraph={graph} />
        </section>
      </section>
      <SiteReadingGuide mode={isDemo ? "demo" : "published"} />
    </PageFrame>
  );
}
