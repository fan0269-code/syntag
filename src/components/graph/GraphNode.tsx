import type { PositionedGraphNode } from "./types";

function truncateLabel(label: string) {
  return label.length > 25 ? `${label.slice(0, 24)}…` : label;
}

export function GraphNode({ node, selected, onSelect }: { node: PositionedGraphNode; selected?: boolean; onSelect?: (node: PositionedGraphNode) => void }) {
  const size = node.type === "theory" ? (node.depth === "D3" ? 28 : node.depth === "D2" ? 24 : 20) : node.type === "work" ? 12 : node.type === "concept" ? 14 : 20;
  const fill = node.type === "theory"
    ? `var(--node-theory-${node.depth === "D3" ? "primary" : "branch"})`
    : `var(--node-${node.type === "work" ? "work" : node.type})`;
  const label = truncateLabel(node.label);
  const common = { fill, className: selected ? "graph-node graph-node--selected" : "graph-node" };

  return (
    <g transform={`translate(${node.x} ${node.y})`} onClick={() => onSelect?.(node)} role="button" tabIndex={0} aria-label={node.label}>
      <title>{node.label}</title>
      {node.type === "theory" && <rect {...common} x={-size} y={-size * 0.62} width={size * 2} height={size * 1.24} rx="6" />}
      {node.type === "scholar" && <circle {...common} r={size} />}
      {node.type === "concept" && <path {...common} d={`M 0 ${-size} L ${size} 0 L 0 ${size} L ${-size} 0 Z`} />}
      {node.type === "work" && <rect {...common} x={-size} y={-size} width={size * 2} height={size * 2} rx="2" />}
      {node.type === "topic" && <path {...common} d={`M ${-size} ${-size * .58} L 0 ${-size} L ${size} ${-size * .58} L ${size} ${size * .58} L 0 ${size} L ${-size} ${size * .58} Z`} />}
      <text className="graph-node__label" y={size + 17} textAnchor="middle">{label}</text>
    </g>
  );
}
