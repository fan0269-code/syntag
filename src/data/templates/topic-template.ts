import type {
  ContentSource,
  SuitabilityEntry,
  VerificationEntry,
} from "./theory-template.ts";

export interface TopicContent {
  research_question: string;
  overview: string;
  suitable_theories: SuitabilityEntry[];
  comparison_prompts: string[];
  sources: ContentSource[];
  verification: VerificationEntry[];
}

export const SCHOOL_TO_WORK_TRANSITIONS_COMPACT_EXAMPLE: TopicContent = {
  research_question:
    "How do family resources and historical conditions shape young adults' transitions from education into work?",
  overview:
    "This topic examines how a transition is patterned by relationships, institutions, and period-specific opportunities.",
  suitable_theories: [
    {
      topic: "Life Course Theory",
      rationale:
        "It frames the school-to-work transition within trajectories, linked lives, and historical context.",
    },
  ],
  comparison_prompts: [
    "Which transition and trajectory are central to the study?",
    "What relational and historical conditions need to be explained?",
  ],
  sources: [
    {
      id: "elder-1998-life-course",
      citation:
        "Elder, G. H., Jr. (1998). The life course as developmental theory. Child Development, 69(1), 1-12.",
      url: "https://doi.org/10.1111/j.1467-8624.1998.tb06128.x",
      evidence_level: "L1",
      supports: ["Life-course concepts used for topic framing"],
    },
  ],
  verification: [
    {
      claim: "The proposed theory fit is an editorial recommendation for this research question.",
      evidence_level: "L2",
      status: "editorial",
    },
  ],
};
