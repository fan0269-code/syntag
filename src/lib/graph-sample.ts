import type { GraphEdgeModel, GraphNodeModel } from "@/components/graph/types";

export const sampleGraph = {
  nodes: [
    { id: "life-course-theory", type: "theory", label: "Life Course Theory", depth: "D3", data: { slug: "life-course-theory", summary: "How historical time, social ties, and transitions shape development." } },
    { id: "teacher-identity-theory", type: "theory", label: "Teacher Identity Theory", depth: "D3", data: { slug: "teacher-identity-theory", summary: "How teachers narrate and negotiate professional selves." } },
    { id: "communities-of-practice", type: "theory", label: "Communities of Practice", depth: "D2", data: { slug: "communities-of-practice", summary: "A social learning theory centered on participation and shared practice." } },
    { id: "practice-theory-bourdieu", type: "theory", label: "Practice Theory (Bourdieu)", depth: "D2", data: { slug: "practice-theory-bourdieu", summary: "Habitus, capital, and field as an account of patterned practice." } },
    { id: "teacher-professional-development-theory", type: "theory", label: "Teacher Professional Development", depth: "D1", data: { slug: "teacher-professional-development-theory", summary: "Continuing learning and change across teaching careers." } },
  ] satisfies GraphNodeModel[],
  edges: [
    { id: "life-to-identity", source: "life-course-theory", target: "teacher-identity-theory", type: "extended_by", label: "Applied to professional identity across careers" },
    { id: "identity-to-development", source: "teacher-identity-theory", target: "teacher-professional-development-theory", type: "extended_by", label: "Explains professional learning and change" },
    { id: "practice-to-community", source: "practice-theory-bourdieu", target: "communities-of-practice", type: "critiqued_by", label: "Contrasting accounts of social practice" },
  ] satisfies GraphEdgeModel[],
  meta: { discipline: "Education", mode: "genealogy", nodeCount: 5, edgeCount: 3 },
};
