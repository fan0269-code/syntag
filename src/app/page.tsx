import { KnowledgeGraphExperience, type GraphData } from "@/components/graph/KnowledgeGraphExperience";
import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { PageFrame } from "@/components/common/PageFrame";
import { Header } from "@/components/layout/Header";
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
    return <PageFrame><DataUnavailableState title="The knowledge graph is not published yet" description="Published graph data is not available yet. Please return later or read about Syntag." /></PageFrame>;
  }

  const isDemo = state.kind === "demo";
  const graph = state.graph;

  return (
    <>
      <Header />
      <main>{isDemo && <p className="route-error" role="status">Demo graph: local development sample data only. It is not published content.</p>}{!isDemo && <JsonLdGraph items={graph.nodes.map((node) => ({ name: node.label, href: node.data?.articleHref ?? (node.data?.slug && isEntityType(node.type) ? entityDetailHref(node.type, node.data.slug) : undefined), description: node.data?.summary }))} />}<KnowledgeGraphExperience initialGraph={graph} /></main>
    </>
  );
}
