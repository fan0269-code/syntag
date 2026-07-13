"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GraphEdgeModel, GraphNodeModel, PositionedGraphNode } from "./types";

type GraphStatus = "loading" | "ready" | "empty" | "error";
type Transform = { x: number; y: number; scale: number };

const edgeStyle: Record<string, { color: string; dash?: number[]; arrow?: boolean; double?: boolean }> = {
  precursor_of: { color: "--edge-precursor", arrow: true },
  branched_from: { color: "--edge-branched", dash: [6, 5], arrow: true },
  extended_by: { color: "--edge-extended" },
  critiqued_by: { color: "--edge-critique", dash: [6, 5] },
  integrated_with: { color: "--edge-integrated", double: true },
  founder: { color: "--edge-integrated" },
  key_contributor: { color: "--edge-extended" },
  extender: { color: "--edge-extended" },
  critic: { color: "--edge-critique", dash: [6, 5] },
  synthesizer: { color: "--edge-integrated", double: true },
  suitability: { color: "--edge-extended", arrow: true },
};

function nodeRadius(node: GraphNodeModel) {
  if (node.type === "theory") return node.depth === "D3" ? 28 : node.depth === "D2" ? 24 : 20;
  if (node.type === "work") return 12;
  if (node.type === "concept") return 14;
  return 20;
}

function placeNodes(nodes: GraphNodeModel[]): PositionedGraphNode[] {
  return nodes.map((node, index) => {
    const angle = (index / Math.max(nodes.length, 1)) * Math.PI * 2 - Math.PI / 2;
    const radius = 115 + (index % 3) * 85;
    return { ...node, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  });
}

function formatRelation(type: string) { return type.replaceAll("_", " "); }
function shortLabel(label: string) { return label.length > 25 ? `${label.slice(0, 24)}…` : label; }

type GraphCanvasProps = { nodes: GraphNodeModel[]; edges: GraphEdgeModel[]; status?: GraphStatus; onRetry?: () => void; onNodeSelect?: (node: GraphNodeModel) => void; focusId?: string | null; mode?: string; disciplineLabel?: string };

export function GraphCanvas(props: GraphCanvasProps) {
  const graphKey = props.nodes.map((node) => node.id).join(":");
  return <GraphCanvasInstance key={graphKey} {...props} />;
}

function GraphCanvasInstance({ nodes, edges, status = "ready", onRetry, onNodeSelect, focusId, mode = "genealogy", disciplineLabel = "this discipline" }: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const transform = useRef<Transform>({ x: 0, y: 0, scale: 1 });
  const action = useRef<{ kind: "pan" | "node"; startX: number; startY: number; nodeId?: string } | null>(null);
  const [points, setPoints] = useState<PositionedGraphNode[]>(() => placeNodes(nodes));
  const [selected, setSelected] = useState<GraphNodeModel | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState<{ node?: GraphNodeModel; edge?: GraphEdgeModel; x: number; y: number } | null>(null);
  const [viewport, setViewport] = useState({ width: 1, height: 1 });

  const selectNode = useCallback((node: GraphNodeModel) => {
    setSelected(node);
    setActiveIndex(Math.max(points.findIndex((entry) => entry.id === node.id), 0));
    onNodeSelect?.(node);
  }, [onNodeSelect, points]);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;
    const resize = () => setViewport({ width: element.clientWidth, height: element.clientHeight });
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!focusId || viewport.width < 1 || viewport.height < 1) return;
    const node = points.find((entry) => entry.id === focusId || entry.data?.slug === focusId);
    if (!node) return;
    const scale = Math.max(transform.current.scale, 1.25);
    transform.current = { x: -node.x * scale, y: -node.y * scale, scale };
    const frame = window.requestAnimationFrame(() => {
      selectNode(node);
      setViewport((current) => ({ ...current }));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [focusId, points, selectNode, viewport.height, viewport.width]);

  const nodeById = useMemo(() => new Map(points.map((node) => [node.id, node])), [points]);
  const toScreen = useCallback((node: PositionedGraphNode) => ({ x: viewport.width / 2 + transform.current.x + node.x * transform.current.scale, y: viewport.height / 2 + transform.current.y + node.y * transform.current.scale }), [viewport]);
  const toWorld = useCallback((x: number, y: number) => ({ x: (x - viewport.width / 2 - transform.current.x) / transform.current.scale, y: (y - viewport.height / 2 - transform.current.y) / transform.current.scale }), [viewport]);
  const cssColor = useCallback((name: string) => getComputedStyle(canvasRef.current ?? document.documentElement).getPropertyValue(name).trim(), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || viewport.width < 1 || viewport.height < 1) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = viewport.width * ratio;
    canvas.height = viewport.height * ratio;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, viewport.width, viewport.height);
    context.lineCap = "round";
    edges.forEach((edge) => {
      const source = nodeById.get(edge.source); const target = nodeById.get(edge.target);
      if (!source || !target) return;
      const start = toScreen(source); const end = toScreen(target); const style = edgeStyle[edge.type] ?? { color: "--edge-precursor" };
      context.strokeStyle = cssColor(style.color); context.lineWidth = 1.2; context.setLineDash(style.dash ?? []);
      context.beginPath(); context.moveTo(start.x, start.y); context.lineTo(end.x, end.y); context.stroke();
      if (style.double) { context.beginPath(); context.moveTo(start.x + 3, start.y + 3); context.lineTo(end.x + 3, end.y + 3); context.stroke(); }
      if (style.arrow) { const angle = Math.atan2(end.y - start.y, end.x - start.x); context.setLineDash([]); context.fillStyle = cssColor(style.color); context.beginPath(); context.moveTo(end.x, end.y); context.lineTo(end.x - 8 * Math.cos(angle - .45), end.y - 8 * Math.sin(angle - .45)); context.lineTo(end.x - 8 * Math.cos(angle + .45), end.y - 8 * Math.sin(angle + .45)); context.closePath(); context.fill(); }
    });
    context.setLineDash([]);
    points.forEach((node) => {
      const point = toScreen(node); const radius = nodeRadius(node) * transform.current.scale; const selectedNode = selected?.id === node.id;
      const colorName = node.type === "theory"
        ? `--node-theory-${node.depth === "D3" ? "primary" : "branch"}`
        : node.type === "work" ? "--node-work" : `--node-${node.type}`;
      context.fillStyle = cssColor(colorName); context.strokeStyle = selectedNode ? cssColor("--accent-primary") : "transparent"; context.lineWidth = 2;
      context.beginPath();
      if (node.type === "theory") context.roundRect(point.x - radius, point.y - radius * .62, radius * 2, radius * 1.24, 6);
      else if (node.type === "scholar") context.arc(point.x, point.y, radius, 0, Math.PI * 2);
      else if (node.type === "concept") { context.moveTo(point.x, point.y - radius); context.lineTo(point.x + radius, point.y); context.lineTo(point.x, point.y + radius); context.lineTo(point.x - radius, point.y); context.closePath(); }
      else if (node.type === "work") context.roundRect(point.x - radius, point.y - radius, radius * 2, radius * 2, 2);
      else { for (let step = 0; step < 6; step += 1) { const angle = Math.PI / 3 * step - Math.PI / 2; const x = point.x + Math.cos(angle) * radius; const y = point.y + Math.sin(angle) * radius; if (step) context.lineTo(x, y); else context.moveTo(x, y); } context.closePath(); }
      context.fill(); context.stroke();
      if (transform.current.scale > .55) { context.fillStyle = cssColor("--text-secondary"); context.font = "12px Inter, system-ui, sans-serif"; context.textAlign = "center"; context.fillText(shortLabel(node.label), point.x, point.y + radius + 17); }
    });
  }, [cssColor, edges, nodeById, points, selected, toScreen, viewport]);

  const locateNode = (x: number, y: number) => points.find((node) => { const point = toScreen(node); return Math.hypot(point.x - x, point.y - y) <= nodeRadius(node) * transform.current.scale + 8; });
  const locateEdge = (x: number, y: number) => edges.find((edge) => { const source = nodeById.get(edge.source); const target = nodeById.get(edge.target); if (!source || !target) return false; const a = toScreen(source); const b = toScreen(target); const length = Math.hypot(b.x - a.x, b.y - a.y); if (!length) return false; const distance = Math.abs((b.y - a.y) * x - (b.x - a.x) * y + b.x * a.y - b.y * a.x) / length; const within = x >= Math.min(a.x, b.x) - 8 && x <= Math.max(a.x, b.x) + 8 && y >= Math.min(a.y, b.y) - 8 && y <= Math.max(a.y, b.y) + 8; return distance <= 7 && within; });
  const selectByIndex = (index: number) => {
    const next = points[(index + points.length) % points.length];
    if (next) selectNode(next);
  };

  return <div className="graph-canvas" ref={wrapperRef}>
    <canvas ref={canvasRef} role="img" tabIndex={0} aria-label="Interactive research theory graph" aria-describedby="graph-canvas-description" onKeyDown={(event) => { if (!points.length) return; if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); selectByIndex(activeIndex + 1); } if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); selectByIndex(activeIndex - 1); } if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectByIndex(activeIndex); } }} onWheel={(event) => { event.preventDefault(); const factor = event.deltaY < 0 ? 1.12 : .89; transform.current.scale = Math.min(2.5, Math.max(.45, transform.current.scale * factor)); setViewport((current) => ({ ...current })); }} onPointerDown={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); const x = event.clientX - bounds.left; const y = event.clientY - bounds.top; const node = locateNode(x, y); action.current = { kind: node ? "node" : "pan", startX: x, startY: y, nodeId: node?.id }; event.currentTarget.setPointerCapture(event.pointerId); if (node) selectNode(node); }} onPointerMove={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); const x = event.clientX - bounds.left; const y = event.clientY - bounds.top; const active = action.current; if (active?.kind === "pan") { transform.current.x += x - active.startX; transform.current.y += y - active.startY; action.current = { ...active, startX: x, startY: y }; setViewport((current) => ({ ...current })); return; } if (active?.kind === "node" && active.nodeId) { const point = toWorld(x, y); setPoints((current) => current.map((node) => node.id === active.nodeId ? { ...node, x: point.x, y: point.y } : node)); return; } const node = locateNode(x, y); const edge = node ? undefined : locateEdge(x, y); setHovered(node ? { node, x, y } : edge ? { edge, x, y } : null); }} onPointerUp={(event) => { action.current = null; event.currentTarget.releasePointerCapture(event.pointerId); }} />
    {status === "loading" && <div className="graph-canvas__state graph-canvas__state--loading"><span /><p>Loading theory graph</p></div>}
    {status === "empty" && <div className="graph-canvas__state"><p>No published {mode} graph nodes are available for {disciplineLabel} yet.</p></div>}
    {status === "error" && <div className="graph-canvas__state"><p>We could not load this graph.</p><button type="button" onClick={onRetry}>Try again</button></div>}
    {hovered && <div className="graph-canvas__tooltip" style={{ left: hovered.x + 16, top: hovered.y + 16 }}>{hovered.node ? <><strong>{hovered.node.label}</strong><span>{hovered.node.data?.summary || "Explore this graph node"}</span></> : <span>{hovered.edge?.label || formatRelation(hovered.edge?.type ?? "")}</span>}</div>}
    <div className="sr-only"><p id="graph-canvas-description">Interactive graph of research theories and their relationships. Use the following buttons to select an available node.</p>{points.map((node) => <button type="button" key={node.id} onClick={() => selectNode(node)}>{node.label}</button>)}</div>
  </div>;
}

export type { GraphStatus };
