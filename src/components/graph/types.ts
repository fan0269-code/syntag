export type GraphNodeType = "theory" | "scholar" | "concept" | "work" | "topic";

export type GraphRelationType =
  | "precursor_of"
  | "branched_from"
  | "extended_by"
  | "critiqued_by"
  | "integrated_with"
  | "influenced_by"
  | "student_of"
  | "collaborator_of"
  | "critic_of"
  | "contemporary_of"
  | "founder"
  | "key_contributor"
  | "extender"
  | "critic"
  | "synthesizer"
  | "suitability";

export type GraphNodeData = {
  slug?: string;
  summary?: string;
  scholarCount?: number;
  theoryCount?: number;
  concepts?: string[];
  articleHref?: string;
};

export type GraphNodeModel = {
  id: string;
  type: GraphNodeType;
  label: string;
  depth?: "D1" | "D2" | "D3" | string;
  data?: GraphNodeData;
};

export type GraphEdgeModel = {
  id: string;
  source: string;
  target: string;
  type: GraphRelationType | string;
  label?: string;
  strength?: number;
};

export type PositionedGraphNode = GraphNodeModel & { x: number; y: number };
