import type { GraphMode } from "./api";

export type FocusableGraphNode = {
  id: string;
  data?: { slug?: string };
};

export type GraphFocusTarget = {
  discipline: string;
  mode: GraphMode;
  nodeId: string;
};

export function graphHasFocusTarget(nodes: FocusableGraphNode[], focusId: string | null | undefined) {
  return Boolean(focusId && nodes.some((node) => node.id === focusId || node.data?.slug === focusId));
}

export function graphFocusHref(target: GraphFocusTarget) {
  const params = new URLSearchParams({
    discipline: target.discipline,
    mode: target.mode,
    focus: target.nodeId,
  });

  return `/?${params.toString()}`;
}
