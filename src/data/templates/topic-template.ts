import type {
  ChapterEntry,
  ContentSource,
  SuitabilityEntry,
  VerificationEntry,
} from "./theory-template.ts";

export interface TopicContent {
  research_question: string;
  overview: string;
  suitable_theories: SuitabilityEntry[];
  theory_comparison_table: Array<{
    theory: string;
    explanatory_focus: string;
    fit: string;
    limitation: string;
  }>;
  comparison_prompts: string[];
  recommended_primary_theory: {
    theory: string;
    rationale: string;
  };
  chapter_structure_suggestion: ChapterEntry[];
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
  theory_comparison_table: [
    {
      theory: "Life Course Theory",
      explanatory_focus: "Transitions within trajectories, linked lives, and historical time.",
      fit: "Explains how the timing and sequence of school-to-work transitions are shaped by relationships and period conditions.",
      limitation: "Does not by itself specify how resources circulate through a network.",
    },
    {
      theory: "Social Capital Theory",
      explanatory_focus: "Resources embedded in social relationships and networks.",
      fit: "Clarifies how family and network resources can support a transition.",
      limitation: "Provides less guidance on sequencing transitions across historical time.",
    },
  ],
  comparison_prompts: [
    "Which transition and trajectory are central to the study?",
    "What relational and historical conditions need to be explained?",
  ],
  recommended_primary_theory: {
    theory: "Life Course Theory",
    rationale:
      "The research question asks how a transition unfolds over time and across relational and historical contexts; social capital can remain a supporting lens for resource mechanisms.",
  },
  chapter_structure_suggestion: [
    {
      chapter: "Literature review",
      purpose: "Compare the temporal-relational explanation offered by Life Course Theory with resource-focused alternatives.",
      theory_use: "Justify Life Course Theory as the primary lens and delimit the contribution of supporting concepts.",
    },
    {
      chapter: "Findings and discussion",
      purpose: "Analyse transition timing, linked lives, and period conditions before discussing resource mechanisms.",
      theory_use: "Keep the primary theory visible in the analytic structure rather than presenting a list of theories.",
    },
  ],
  sources: [
    {
      id: "elder-1998-life-course",
      citation:
        "Elder, G. H., Jr. (1998). The life course as developmental theory. Child Development, 69(1), 1-12.",
      url: "https://doi.org/10.1111/j.1467-8624.1998.tb06128.x",
      source_kind: "doi",
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
