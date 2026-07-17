"use client";

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import type { GraphMode } from "@/lib/api";
import { graphHasFocusTarget } from "@/lib/graph-focus";
import { GraphCanvas } from "./GraphCanvas";
import { TheoryDetail, type GraphRelationship } from "./TheoryDetail";
import type { GraphEdgeModel, GraphNodeModel } from "./types";

type GraphDisciplineOption = { slug: string; label: string };
export type GraphData = {
  nodes: GraphNodeModel[];
  edges: GraphEdgeModel[];
  meta: {
    discipline: string;
    disciplineSlug?: string;
    mode: string;
    nodeCount: number;
    edgeCount: number;
    availableDisciplines?: GraphDisciplineOption[];
    relationLabels?: string[];
    emptyReason?: string;
  };
};
const modes: Array<{ value: GraphMode; label: string }> = [{ value: "genealogy", label: "Genealogy" }, { value: "scholars", label: "Scholars" }, { value: "topics", label: "Topics" }];

export function KnowledgeGraphExperience({ initialGraph }: { initialGraph: GraphData }) {
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}><GraphExperience initialGraph={initialGraph} /></QueryClientProvider>;
}

function GraphExperience({ initialGraph }: { initialGraph: GraphData }) {
  const [selected, setSelected] = useState<GraphNodeModel | null>(null);
  const canvasFocusRef = useRef<HTMLElement | null>(null);
  const router = useRouter(); const pathname = usePathname(); const searchParams = useSearchParams();
  const initialDisciplines = initialGraph.meta.availableDisciplines?.length ? initialGraph.meta.availableDisciplines : [{ slug: initialGraph.meta.disciplineSlug ?? "education", label: initialGraph.meta.discipline }];
  const requestedDiscipline = searchParams.get("discipline");
  const defaultDiscipline = initialDisciplines.some((entry) => entry.slug === requestedDiscipline) ? requestedDiscipline : initialDisciplines[0]?.slug;
  const [discipline, setDiscipline] = useState(defaultDiscipline ?? "education");
  const initialMode = searchParams.get("mode");
  const [mode, setMode] = useState<GraphMode>((modes.some(({ value }) => value === initialMode) ? initialMode : "genealogy") as GraphMode);
  const focusId = searchParams.get("focus");
  const query = useQuery({
    queryKey: ["graph", discipline, mode],
    queryFn: async () => { const response = await fetch(`/api/graph?discipline=${discipline}&mode=${mode}`); if (!response.ok) throw new Error("Unable to load graph"); return response.json() as Promise<GraphData>; },
    initialData: discipline === "education" && mode === "genealogy" ? initialGraph : undefined,
    staleTime: 86_400_000,
    retry: 1,
  });
  const graph = query.data;
  const status = query.isPending ? "loading" : query.isError ? "error" : !graph?.nodes.length ? "empty" : "ready";
  const availableDisciplines = graph?.meta.availableDisciplines?.length ? graph.meta.availableDisciplines : initialDisciplines;

  const canvasNodes = useMemo(() => graph?.nodes ?? [], [graph]);
  const canvasEdges = useMemo(() => graph?.edges ?? [], [graph]);
  const nodeLabels = useMemo(() => new Map(canvasNodes.map((node) => [node.id, node.label])), [canvasNodes]);
  const selectedRelationships = useMemo((): GraphRelationship[] => {
    if (!selected) return [];
    return canvasEdges.filter((edge) => edge.source === selected.id || edge.target === selected.id).map((edge) => ({
      id: edge.id,
      sourceLabel: nodeLabels.get(edge.source) ?? edge.source,
      targetLabel: nodeLabels.get(edge.target) ?? edge.target,
      type: edge.type,
      label: edge.label,
    }));
  }, [canvasEdges, nodeLabels, selected]);
  const replaceGraphUrl = (nextDiscipline: string, nextMode: GraphMode) => {
    const params = new URLSearchParams();
    params.set("discipline", nextDiscipline);
    params.set("mode", nextMode);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  const changeDiscipline = (value: string) => { setDiscipline(value); setSelected(null); replaceGraphUrl(value, mode); };
  const changeMode = (value: GraphMode) => { setMode(value); setSelected(null); replaceGraphUrl(discipline, value); };
  const focusMiss = focusId && status === "ready" && !graphHasFocusTarget(canvasNodes, focusId);
  const modeLabel = modes.find((entry) => entry.value === mode)?.label ?? mode;
  const relationLabelText = graph?.meta.relationLabels?.length ? graph.meta.relationLabels.join(", ") : "no published relationships";

  return <section className="knowledge-graph-experience" aria-label="Research theory knowledge graph">
    <div className="graph-mobile-controls">
      <GraphDisciplineSelect discipline={discipline} disciplines={availableDisciplines} setDiscipline={changeDiscipline} />
      <GraphModeControls mode={mode} setMode={changeMode} />
    </div>
    <aside className="graph-discipline-rail" role="group" aria-label="Disciplines"><span>Disciplines</span>{availableDisciplines.map((entry) => <button key={entry.slug} type="button" className={entry.slug === discipline ? "is-active" : ""} aria-pressed={entry.slug === discipline} onClick={() => changeDiscipline(entry.slug)}>{entry.label}</button>)}</aside>
    <div className="graph-workspace"><div className="graph-toolbar"><GraphModeControls mode={mode} setMode={changeMode} /><p>{graph?.meta.nodeCount ?? 0} nodes · {graph?.meta.edgeCount ?? 0} relationships · {relationLabelText}</p></div>
    {graph?.meta.emptyReason && <p className="graph-focus-feedback" role="status">{graph.meta.emptyReason}</p>}
    {focusMiss && <p className="graph-focus-feedback" role="status">Focused node is not available in {graph?.meta.discipline ?? discipline} / {modeLabel}. Choose the matching discipline or graph mode from the controls.</p>}
    <GraphCanvas nodes={canvasNodes} edges={canvasEdges} status={status} mode={mode} disciplineLabel={graph?.meta.discipline ?? discipline} focusId={focusId} focusTargetRef={canvasFocusRef} onRetry={() => query.refetch()} onNodeSelect={setSelected} /></div>
    <TheoryDetail node={selected} relationships={selectedRelationships} onClose={() => setSelected(null)} returnFocusTarget={canvasFocusRef} />
  </section>;
}

function GraphDisciplineSelect({ discipline, disciplines, setDiscipline }: { discipline: string; disciplines: GraphDisciplineOption[]; setDiscipline: (value: string) => void }) {
  return <div className="graph-tabs"><label><span className="sr-only">Discipline</span><select aria-label="Discipline" value={discipline} onChange={(event) => setDiscipline(event.target.value)}>{disciplines.map((entry) => <option key={entry.slug} value={entry.slug}>{entry.label}</option>)}</select></label></div>;
}

function GraphModeControls({ mode, setMode }: { mode: GraphMode; setMode: (value: GraphMode) => void }) {
  return <div className="graph-modes" role="group" aria-label="Graph view mode">{modes.map((entry) => <button type="button" key={entry.value} className={mode === entry.value ? "is-active" : ""} aria-pressed={mode === entry.value} onClick={() => setMode(entry.value)}>{entry.label}</button>)}</div>;
}
