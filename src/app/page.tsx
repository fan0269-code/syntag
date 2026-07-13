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
    return <PageFrame><DataUnavailableState title="The knowledge graph is not published yet" description="Published graph data is not available yet. Please return later or read about Syrtag." /></PageFrame>;
  }

  const isDemo = state.kind === "demo";
  const graph = state.graph;

  return (
    <>
      <Header />
      <main className="home-main">
        {isDemo && <p className="route-error" role="status">Demo graph: local development sample data only. It is not published content.</p>}
        {!isDemo && <JsonLdGraph items={graph.nodes.map((node) => ({ name: node.label, href: node.data?.articleHref ?? (node.data?.slug && isEntityType(node.type) ? entityDetailHref(node.type, node.data.slug) : undefined), description: node.data?.summary }))} />}
        <section className="home-hero" aria-label="Syrtag 首页知识图谱">
          <header className="home-hero__intro">
            <div>
              <span className="eyebrow">Theory pathway</span>
              <h1>从研究主题进入理论知识图谱。</h1>
              <p className="lead">选择学科与图谱模式，查看主题、理论、学者、经典作品和概念之间的真实关系。</p>
            </div>
            <div className="home-hero__meta" aria-label="图谱摘要">
              <div><strong>{graph.meta.availableDisciplines?.length ?? 2}</strong><span>学科入口</span></div>
              <div><strong>双向</strong><span>主题与理论互相追溯</span></div>
              <div><strong>L1-L3</strong><span>保留编辑核验状态</span></div>
            </div>
          </header>
          <section className="home-graph-shell" id="graph" aria-label="可筛选动态图谱">
            <div className="home-graph-card__toolbar">
              <div>
                <h2>理论关系图谱</h2>
                <p>选择学科与图谱模式，聚焦主题、理论、学者和作品之间的真实关系。</p>
              </div>
              <div className="home-graph-card__status">{graph.meta.nodeCount} 个节点 · {graph.meta.edgeCount} 条链接</div>
            </div>
            <KnowledgeGraphExperience initialGraph={graph} />
          </section>
        </section>
      </main>
    </>
  );
}
