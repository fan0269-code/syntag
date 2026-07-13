import type { GraphEdgeModel, PositionedGraphNode } from "./types";

const styleByRelation: Record<string, { color: string; dash?: string; arrow?: boolean; double?: boolean }> = {
  precursor_of: { color: "var(--edge-precursor)", arrow: true },
  branched_from: { color: "var(--edge-branched)", dash: "6 5", arrow: true },
  extended_by: { color: "var(--edge-extended)" },
  critiqued_by: { color: "var(--edge-critique)", dash: "6 5" },
  integrated_with: { color: "var(--edge-integrated)", double: true },
};

export function GraphEdge({ edge, source, target, onHover }: { edge: GraphEdgeModel; source: PositionedGraphNode; target: PositionedGraphNode; onHover?: (edge: GraphEdgeModel | null) => void }) {
  const style = styleByRelation[edge.type] ?? { color: "var(--edge-precursor)" };
  const line = <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={style.color} strokeDasharray={style.dash} markerEnd={style.arrow ? "url(#graph-arrow)" : undefined} />;
  return (
    <g className="graph-edge" onPointerEnter={() => onHover?.(edge)} onPointerLeave={() => onHover?.(null)}>
      <title>{edge.label || edge.type.replaceAll("_", " ")}</title>
      {line}
      {style.double && <line x1={source.x + 3} y1={source.y + 3} x2={target.x + 3} y2={target.y + 3} stroke={style.color} />}
    </g>
  );
}
