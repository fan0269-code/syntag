export const THEORY_BLOCKS = [
  "what_is_it",
  "origins",
  "core_concepts",
  "genealogy",
  "applicable_topics",
  "inapplicable_topics",
  "misuse_risks",
  "analysis_dimensions",
  "data_collection",
  "chapter_structure",
  "fit_writing",
  "sources",
] as const;

export type TheoryDepth = "D1" | "D2" | "D3";
export type TheoryBlockName = (typeof THEORY_BLOCKS)[number];
export type EvidenceLevel = "L1" | "L2" | "L3";

export interface ConceptEntry {
  name: string;
  definition: string;
  relevance: string;
}

export interface GenealogyEntry {
  related_theory: string;
  relationship: string;
  description: string;
}

export interface SuitabilityEntry {
  topic: string;
  rationale: string;
}

export interface OperationalizationEntry {
  dimension: string;
  indicators: string[];
  collection_prompt: string;
}

export interface ReadingPathEntry {
  order: number;
  title: string;
  purpose: string;
  source_id?: string;
}

export interface ChapterEntry {
  chapter: string;
  purpose: string;
  theory_use: string;
}

export interface ContentSource {
  id: string;
  citation: string;
  url: string;
  evidence_level: EvidenceLevel;
  supports: string[];
}

export interface VerificationEntry {
  claim: string;
  evidence_level: EvidenceLevel;
  source_id?: string;
  status: "verified" | "editorial" | "proposed";
}

export interface TheoryContent {
  what_is_it: string;
  origins: string;
  core_concepts: ConceptEntry[];
  genealogy: GenealogyEntry[];
  applicable_topics: SuitabilityEntry[];
  inapplicable_topics: SuitabilityEntry[];
  misuse_risks: string[];
  analysis_dimensions: string[];
  data_collection: OperationalizationEntry[];
  chapter_structure: ChapterEntry[];
  fit_writing: string[];
  sources: ContentSource[];
  reading_path: ReadingPathEntry[];
  verification: VerificationEntry[];
}

export function requiredTheoryBlocks(depth: TheoryDepth): TheoryBlockName[] {
  return depth === "D1" ? THEORY_BLOCKS.slice(0, 7) : [...THEORY_BLOCKS];
}

function hasContent(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && typeof value === "object";
}

export function isTheoryContent(
  value: unknown,
  depth: TheoryDepth,
): value is TheoryContent {
  return (
    value !== null &&
    typeof value === "object" &&
    requiredTheoryBlocks(depth).every((key) =>
      hasContent((value as Record<string, unknown>)[key]),
    )
  );
}

export const LIFE_COURSE_D2_EXAMPLE: TheoryContent = {
  what_is_it:
    "Life Course Theory explains lives as trajectories shaped by historical time, social relationships, institutions, and transitions across age-graded roles.",
  origins:
    "The framework developed across sociology, psychology, and demography, with Glen H. Elder Jr.'s studies of children of the Great Depression establishing a widely cited formulation.",
  core_concepts: [
    {
      name: "Trajectories",
      definition: "Long-term pathways through roles and institutions.",
      relevance: "They connect individual biographies to patterned social change.",
    },
    {
      name: "Transitions",
      definition: "Changes in social roles or statuses, such as leaving school or becoming a parent.",
      relevance: "They identify moments when constraints and opportunities may change.",
    },
  ],
  genealogy: [
    {
      related_theory: "Cumulative Advantage",
      relationship: "complements",
      description:
        "Both frameworks examine how earlier conditions shape later outcomes, while cumulative advantage focuses more directly on accumulating inequality.",
    },
  ],
  applicable_topics: [
    {
      topic: "Educational and employment transitions",
      rationale:
        "The framework can connect institutional timing, family context, and historical change to changing educational and work pathways.",
    },
  ],
  inapplicable_topics: [
    {
      topic: "A single cross-sectional attitude with no temporal or relational dimension",
      rationale:
        "The theory adds little when the research question does not concern timing, sequence, relationships, or historical context.",
    },
  ],
  misuse_risks: [
    "Treating age alone as a causal explanation rather than examining institutions, relationships, and period effects.",
    "Listing life-course principles without specifying how they guide the study's evidence or analysis.",
  ],
  analysis_dimensions: [
    "Timing of transitions",
    "Linked lives and family relationships",
    "Historical period and place",
    "Agency within institutional constraints",
  ],
  data_collection: [
    {
      dimension: "Transition timing",
      indicators: ["Age at transition", "Sequence of education and work roles"],
      collection_prompt:
        "Ask participants to reconstruct key transitions and the conditions surrounding them.",
    },
    {
      dimension: "Linked lives",
      indicators: ["Family obligations", "Support networks", "Household changes"],
      collection_prompt:
        "Ask how close relationships shaped choices at each transition.",
    },
  ],
  chapter_structure: [
    {
      chapter: "Literature review",
      purpose: "Position the study within research on trajectories, transitions, and linked lives.",
      theory_use: "Define the selected principles and distinguish them from adjacent frameworks.",
    },
    {
      chapter: "Findings and discussion",
      purpose: "Explain how participants' transitions unfolded in historical and relational context.",
      theory_use: "Use the principles as analytic lenses, not as a checklist of demographic variables.",
    },
  ],
  fit_writing: [
    "Use Life Course Theory because the study asks how transitions unfold over time within changing institutional and relational conditions.",
    "State which principles guide sampling, data collection, and interpretation before claiming theoretical fit.",
  ],
  sources: [
    {
      id: "elder-1998-life-course",
      citation:
        "Elder, G. H., Jr. (1998). The life course as developmental theory. Child Development, 69(1), 1-12.",
      url: "https://doi.org/10.1111/j.1467-8624.1998.tb06128.x",
      evidence_level: "L1",
      supports: ["Bibliographic details", "Foundational framing of the life course"],
    },
  ],
  reading_path: [
    {
      order: 1,
      title: "The life course as developmental theory",
      purpose: "Establish the framework's core principles and vocabulary.",
      source_id: "elder-1998-life-course",
    },
  ],
  verification: [
    {
      claim: "Glen H. Elder Jr.'s 1998 article is a foundational life-course reference.",
      evidence_level: "L1",
      source_id: "elder-1998-life-course",
      status: "verified",
    },
    {
      claim: "The proposed chapter structure is an editorial adaptation for dissertation writing.",
      evidence_level: "L3",
      status: "proposed",
    },
  ],
};
