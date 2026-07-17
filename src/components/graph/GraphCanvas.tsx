"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import type { GraphEdgeModel, GraphNodeModel, PositionedGraphNode } from "./types";

type GraphStatus = "loading" | "ready" | "empty" | "error";
type Transform = { x: number; y: number; scale: number };

type GraphCanvasProps = {
  nodes: GraphNodeModel[];
  edges: GraphEdgeModel[];
  status?: GraphStatus;
  onRetry?: () => void;
  onNodeSelect?: (node: GraphNodeModel) => void;
  focusId?: string | null;
  mode?: string;
  disciplineLabel?: string;
  focusTargetRef?: MutableRefObject<HTMLElement | null>;
};

const edgeStyle: Record<string, { color: string; dash?: number[]; arrow?: boolean; double?: boolean }> = {
  precursor_of: { color: "--edge-precursor", dash: [10, 12], arrow: true },
  branched_from: { color: "--edge-branched", dash: [8, 10], arrow: true },
  extended_by: { color: "--edge-extended", dash: [12, 14] },
  critiqued_by: { color: "--edge-critique", dash: [8, 10] },
  integrated_with: { color: "--edge-integrated", dash: [12, 10], double: true },
  founder: { color: "--edge-integrated" },
  key_contributor: { color: "--edge-extended" },
  extender: { color: "--edge-extended" },
  critic: { color: "--edge-critique", dash: [6, 5] },
  synthesizer: { color: "--edge-integrated", double: true },
  suitability: { color: "--edge-extended", arrow: true },
};

function nodeRadius(node: GraphNodeModel) {
  if (node.type === "theory") return node.depth === "D3" ? 18 : node.depth === "D2" ? 16 : 14;
  if (node.type === "work") return 13;
  if (node.type === "concept") return 14;
  return 15;
}

function placeNodes(nodes: GraphNodeModel[]): PositionedGraphNode[] {
  const density = nodes.length <= 12 ? 0.78 : nodes.length <= 24 ? 0.9 : 1;
  return nodes.map((node, index) => {
    const angle = (index / Math.max(nodes.length, 1)) * Math.PI * 2 - Math.PI / 2;
    const radius = (105 + (index % 3) * 72) * density;
    return { ...node, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  });
}

function formatRelation(type: string) { return type.replaceAll("_", " "); }
function shortLabel(label: string) { return label.length > 25 ? `${label.slice(0, 24)}…` : label; }
function controlPoint(start: { x: number; y: number }, end: { x: number; y: number }, bend = 0.16) {
  const midpoint = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return { x: midpoint.x - dy * bend, y: midpoint.y + dx * bend };
}

export function GraphCanvas(props: GraphCanvasProps) {
  const graphKey = props.nodes.map((node) => node.id).join(":");
  return <GraphCanvasInstance key={graphKey} {...props} />;
}

function GraphCanvasInstance({ nodes, edges, status = "ready", onRetry, onNodeSelect, focusId, mode = "genealogy", disciplineLabel = "this discipline", focusTargetRef }: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const transform = useRef<Transform>({ x: 0, y: 0, scale: 1 });
  const action = useRef<{ kind: "pan" | "node"; originX: number; originY: number; lastX: number; lastY: number; nodeId?: string; moved: boolean } | null>(null);
  const [points, setPoints] = useState<PositionedGraphNode[]>(() => placeNodes(nodes));
  const [selected, setSelected] = useState<GraphNodeModel | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState<{ node?: GraphNodeModel; edge?: GraphEdgeModel; x: number; y: number } | null>(null);
  const [viewport, setViewport] = useState({ width: 1, height: 1 });
  const [reducedMotion, setReducedMotion] = useState(false);

  const selectNode = useCallback((node: GraphNodeModel) => {
    setSelected(node);
    setActiveIndex(Math.max(points.findIndex((entry) => entry.id === node.id), 0));
    onNodeSelect?.(node);
  }, [onNodeSelect, points]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (!focusTargetRef) return;
    focusTargetRef.current = canvasRef.current;
    return () => { focusTargetRef.current = null; };
  }, [focusTargetRef]);

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
    const selectFocusedNode = () => {
      selectNode(node);
      setViewport((current) => ({ ...current }));
    };
    if (reducedMotion) {
      selectFocusedNode();
      return;
    }
    const frame = window.requestAnimationFrame(selectFocusedNode);
    return () => window.cancelAnimationFrame(frame);
  }, [focusId, points, reducedMotion, selectNode, viewport.height, viewport.width]);

  const nodeById = useMemo(() => new Map(points.map((node) => [node.id, node])), [points]);
  const hoveredNodeId = hovered?.node?.id;
  const adjacentNodeIds = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>();
    const ids = new Set<string>([hoveredNodeId]);
    edges.forEach((edge) => {
      if (edge.source === hoveredNodeId) ids.add(edge.target);
      if (edge.target === hoveredNodeId) ids.add(edge.source);
    });
    return ids;
  }, [edges, hoveredNodeId]);
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

    let animationFrame = 0;
    const draw = (time: number) => {
      const motionTime = reducedMotion ? 0 : time;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, viewport.width, viewport.height);
      context.lineCap = "round";
      context.lineJoin = "round";

      edges.forEach((edge, index) => {
        const source = nodeById.get(edge.source); const target = nodeById.get(edge.target);
        if (!source || !target) return;
        const start = toScreen(source); const end = toScreen(target); const style = edgeStyle[edge.type] ?? { color: "--edge-precursor", dash: [10, 12] };
        const control = controlPoint(start, end, index % 2 ? -0.14 : 0.14);
        const color = cssColor(style.color);
        context.save();
        context.strokeStyle = color;
        const connectedToHover = hoveredNodeId && (edge.source === hoveredNodeId || edge.target === hoveredNodeId);
        context.globalAlpha = hoveredNodeId ? (connectedToHover ? .95 : .3) : .52;
        context.lineWidth = connectedToHover ? 3.4 : 1.9;
        context.setLineDash(style.dash ?? [12, 12]);
        context.lineDashOffset = reducedMotion ? 0 : -motionTime / 90 - index * 8;
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.quadraticCurveTo(control.x, control.y, end.x, end.y);
        context.stroke();
        if (style.double) {
          context.globalAlpha = .32;
          context.lineWidth = 1.2;
          context.setLineDash([4, 12]);
          context.lineDashOffset = reducedMotion ? 0 : motionTime / 110 + index * 6;
          context.beginPath();
          context.moveTo(start.x + 3, start.y + 3);
          context.quadraticCurveTo(control.x + 3, control.y + 3, end.x + 3, end.y + 3);
          context.stroke();
        }
        if (style.arrow) {
          const angle = Math.atan2(end.y - control.y, end.x - control.x);
          context.globalAlpha = .65;
          context.setLineDash([]);
          context.fillStyle = color;
          context.beginPath();
          context.moveTo(end.x, end.y);
          context.lineTo(end.x - 8 * Math.cos(angle - .42), end.y - 8 * Math.sin(angle - .42));
          context.lineTo(end.x - 8 * Math.cos(angle + .42), end.y - 8 * Math.sin(angle + .42));
          context.closePath();
          context.fill();
        }
        context.restore();
      });

      points.forEach((node, index) => {
        const basePoint = toScreen(node);
        const floatY = reducedMotion ? 0 : Math.sin(motionTime / 1200 + index * .9) * 4;
        const point = { x: basePoint.x, y: basePoint.y + floatY };
        const radius = nodeRadius(node) * transform.current.scale; const selectedNode = selected?.id === node.id;
        const relatedToHover = !hoveredNodeId || adjacentNodeIds.has(node.id);
        const colorName = node.type === "theory"
          ? `--node-theory-${node.depth === "D3" ? "primary" : "branch"}`
          : node.type === "work" ? "--node-work" : `--node-${node.type}`;
        const color = cssColor(colorName);
        context.save();
        context.globalAlpha = relatedToHover ? 1 : .3;
        context.shadowColor = "rgba(44, 39, 34, 0.16)";
        context.shadowBlur = selectedNode ? 20 : 14;
        context.shadowOffsetY = 8;
        context.fillStyle = cssColor("--bg-surface");
        context.strokeStyle = selectedNode ? cssColor("--accent-primary") : color;
        context.lineWidth = selectedNode ? 3 : 2;
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.shadowColor = "transparent";
        context.fillStyle = color;
        context.globalAlpha = (selectedNode ? .92 : .74) * (relatedToHover ? 1 : .3);
        context.beginPath();
        context.arc(point.x, point.y, Math.max(4, radius * .34), 0, Math.PI * 2);
        context.fill();
        if (selectedNode) {
          context.globalAlpha = reducedMotion ? .18 : .18 + Math.sin(motionTime / 260) * .04;
          context.strokeStyle = cssColor("--accent-primary");
          context.lineWidth = 2;
          context.beginPath();
          context.arc(point.x, point.y, reducedMotion ? radius + 9 : radius + 9 + Math.sin(motionTime / 420) * 3, 0, Math.PI * 2);
          context.stroke();
        }
        context.globalAlpha = relatedToHover ? 1 : .3;
        if (transform.current.scale > .55) {
          context.fillStyle = cssColor("--text-secondary");
          context.font = "13px Inter, system-ui, sans-serif";
          context.textAlign = "center";
          context.fillText(shortLabel(node.label), point.x, point.y + radius + 20);
        }
        context.restore();
      });

      if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw);
    };

    if (reducedMotion) draw(0);
    else animationFrame = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [adjacentNodeIds, cssColor, edges, hoveredNodeId, nodeById, points, reducedMotion, selected, toScreen, viewport]);

  const locateNode = (x: number, y: number) => points.find((node) => { const point = toScreen(node); return Math.hypot(point.x - x, point.y - y) <= nodeRadius(node) * transform.current.scale + 8; });
  const locateEdge = (x: number, y: number) => edges.find((edge) => { const source = nodeById.get(edge.source); const target = nodeById.get(edge.target); if (!source || !target) return false; const a = toScreen(source); const b = toScreen(target); const length = Math.hypot(b.x - a.x, b.y - a.y); if (!length) return false; const distance = Math.abs((b.y - a.y) * x - (b.x - a.x) * y + b.x * a.y - b.y * a.x) / length; const within = x >= Math.min(a.x, b.x) - 8 && x <= Math.max(a.x, b.x) + 8 && y >= Math.min(a.y, b.y) - 8 && y <= Math.max(a.y, b.y) + 8; return distance <= 7 && within; });
  const selectByIndex = (index: number) => {
    const next = points[(index + points.length) % points.length];
    if (next) selectNode(next);
  };

  return <div className="graph-canvas" ref={wrapperRef}>
    <p className="graph-canvas__instructions" id="graph-canvas-description">Use Arrow keys to move between nodes and Enter to select one. You can pan the canvas by dragging empty space, or choose a node from the list below.</p>
    <canvas ref={canvasRef} role="img" tabIndex={0} aria-label="Interactive research theory graph" aria-describedby="graph-canvas-description" onKeyDown={(event) => { if (!points.length) return; if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); selectByIndex(activeIndex + 1); } if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); selectByIndex(activeIndex - 1); } if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectByIndex(activeIndex); } }} onWheel={(event) => { event.preventDefault(); const factor = event.deltaY < 0 ? 1.12 : .89; transform.current.scale = Math.min(2.5, Math.max(.45, transform.current.scale * factor)); setViewport((current) => ({ ...current })); }} onPointerDown={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); const x = event.clientX - bounds.left; const y = event.clientY - bounds.top; const node = locateNode(x, y); action.current = { kind: node ? "node" : "pan", originX: x, originY: y, lastX: x, lastY: y, nodeId: node?.id, moved: false }; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); const x = event.clientX - bounds.left; const y = event.clientY - bounds.top; const active = action.current; if (active?.kind === "pan") { transform.current.x += x - active.lastX; transform.current.y += y - active.lastY; action.current = { ...active, lastX: x, lastY: y, moved: active.moved || Math.hypot(x - active.originX, y - active.originY) > 6 }; setViewport((current) => ({ ...current })); return; } if (active?.kind === "node" && active.nodeId) { const point = toWorld(x, y); action.current = { ...active, lastX: x, lastY: y, moved: active.moved || Math.hypot(x - active.originX, y - active.originY) > 6 }; setPoints((current) => current.map((node) => node.id === active.nodeId ? { ...node, x: point.x, y: point.y } : node)); return; } const node = locateNode(x, y); const edge = node ? undefined : locateEdge(x, y); setHovered(node ? { node, x, y } : edge ? { edge, x, y } : null); }} onPointerUp={(event) => { const active = action.current; action.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); if (active?.kind !== "node" || active.moved || !active.nodeId) return; const bounds = event.currentTarget.getBoundingClientRect(); const node = locateNode(event.clientX - bounds.left, event.clientY - bounds.top); if (node?.id === active.nodeId) selectNode(node); }} onPointerCancel={() => { action.current = null; }} />
    <p className="graph-canvas__selection-status" role="status" aria-live="polite">{selected ? `${selected.label} selected. Details are available in the selected node panel.` : "No node selected."}</p>
    <div className="graph-canvas__node-picker" role="group" aria-label="Available graph nodes">
      {points.map((node) => <button type="button" key={node.id} aria-pressed={selected?.id === node.id} aria-expanded={selected?.id === node.id} aria-controls="graph-theory-detail" onClick={() => selectNode(node)}>{node.label}</button>)}
    </div>
    {status === "loading" && <div className="graph-canvas__state graph-canvas__state--loading"><span /><p>Loading theory graph</p></div>}
    {status === "empty" && <div className="graph-canvas__state"><DataUnavailableState title={`No published ${mode} graph yet`} description={`No published ${mode} graph nodes are available for ${disciplineLabel} yet.`} /></div>}
    {status === "error" && <div className="graph-canvas__state"><DataUnavailableState title="The graph is temporarily unavailable" description="We could not load this graph. Try again shortly or continue with the theory index." /><button type="button" onClick={onRetry}>Try again</button></div>}
    {hovered && <div className="graph-canvas__tooltip" style={{ left: hovered.x + 16, top: hovered.y + 16 }}>{hovered.node ? <><strong>{hovered.node.label}</strong><span>{hovered.node.data?.summary || "Explore this graph node"}</span></> : <span>{hovered.edge?.label || formatRelation(hovered.edge?.type ?? "")}</span>}</div>}
  </div>;
}

export type { GraphStatus };
