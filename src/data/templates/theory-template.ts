import type { ContentNature, EvidenceStatus, ReviewDecision, ReviewerRole } from "./evidence-template.ts";

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

export const D3_THEORY_BLOCKS = [
  "core_question",
  "historical_development",
  "key_scholars",
  "adjacent_theories",
  "criticisms",
] as const;

export const D2_THEORY_BLOCKS = [
  "explanatory_mechanisms",
  "analysis_unit",
  "theory_comparisons",
  "boundary_conditions",
] as const;

export type TheoryDepth = "D1" | "D2" | "D3";
export type TheoryBlockName = (typeof THEORY_BLOCKS)[number] | (typeof D2_THEORY_BLOCKS)[number] | (typeof D3_THEORY_BLOCKS)[number];
export type EvidenceLevel = "L1" | "L2" | "L3";
export type TraceableSourceKind =
  | "doi"
  | "publisher"
  | "university"
  | "library"
  | "journal"
  | "authoritative_web";

export interface ConceptEntry {
  name: string;
  definition: string;
  relevance: string;
}

export interface GenealogyEntry {
  related_theory: string;
  relationship: string;
  description: string;
  source_ids?: string[];
}

export interface TheoryNatureEntry {
  kind: "theory" | "framework" | "research_tradition" | "editorial_umbrella";
  label: string;
  explanation: string;
  source_ids: string[];
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
  level?: string;
  title: string;
  purpose: string;
  source_id?: string;
}

export interface ChapterEntry {
  chapter: string;
  purpose: string;
  theory_use: string;
}

export interface HistoricalDevelopmentEntry {
  period: string;
  development: string;
  significance: string;
  source_ids: string[];
}

export interface ScholarContributionEntry {
  name: string;
  contribution: string;
  representative_work: string;
  source_ids: string[];
}

export interface AdjacentTheoryEntry {
  theory: string;
  shared_focus: string;
  difference: string;
  source_ids: string[];
}

export interface CriticismBoundaryEntry {
  criticism: string;
  boundary: string;
  source_ids: string[];
}

export interface ExplanatoryMechanismEntry {
  mechanism: string;
  process: string;
  evidence_focus: string;
  source_ids: string[];
}

export interface TheoryComparisonEntry {
  theory: string;
  role: "main_candidate" | "alternative";
  shared_focus: string;
  difference: string;
  when_prefer: string;
  source_ids: string[];
}

export interface BoundaryConditionEntry {
  condition: string;
  implication: string;
  source_ids: string[];
}

export interface ContentSource {
  id: string;
  citation: string;
  url: string;
  source_kind: TraceableSourceKind;
  evidence_level: "L1";
  supports: string[];
}

export interface L1VerificationEntry {
  claim: string;
  evidence_level: "L1";
  source_id: string;
  status: "verified";
}

export interface L2VerificationEntry {
  claim: string;
  evidence_level: "L2";
  status: "editorial";
}

export interface L3VerificationEntry {
  claim: string;
  evidence_level: "L3";
  status: "proposed";
}

export type VerificationEntry = (
  | L1VerificationEntry
  | L2VerificationEntry
  | L3VerificationEntry
) & ClaimReviewMetadata;

export type ClaimReviewMetadata = {
  claimId?: string;
  fieldPath?: string;
  locator?: string;
  evidenceStatus?: EvidenceStatus;
  contentNature?: ContentNature;
  verifiedAt?: string;
  reviewerRole?: ReviewerRole;
  reviewDecision?: ReviewDecision;
};

export interface TheoryCoreContent {
  what_is_it: string;
  origins: string;
  core_concepts: ConceptEntry[];
  genealogy: GenealogyEntry[];
  applicable_topics: SuitabilityEntry[];
  inapplicable_topics: SuitabilityEntry[];
  misuse_risks: string[];
}

export interface TheoryExtendedContent {
  analysis_dimensions: string[];
  data_collection: OperationalizationEntry[];
  chapter_structure: ChapterEntry[];
  fit_writing: string[];
  sources: ContentSource[];
}

export interface TheoryDeepContent {
  core_question: string;
  historical_development: HistoricalDevelopmentEntry[];
  key_scholars: ScholarContributionEntry[];
  adjacent_theories: AdjacentTheoryEntry[];
  criticisms: CriticismBoundaryEntry[];
}

export interface TheoryDesignContent {
  explanatory_mechanisms: ExplanatoryMechanismEntry[];
  analysis_unit: string;
  theory_comparisons: TheoryComparisonEntry[];
  boundary_conditions: BoundaryConditionEntry[];
}

export type TheoryContent = TheoryCoreContent & Partial<TheoryExtendedContent> & Partial<TheoryDesignContent> & Partial<TheoryDeepContent> & {
  theory_nature?: TheoryNatureEntry;
  reading_path?: ReadingPathEntry[];
  verification?: VerificationEntry[];
};

export function requiredTheoryBlocks(depth: TheoryDepth): TheoryBlockName[] {
  if (depth === "D1") return THEORY_BLOCKS.slice(0, 7);
  if (depth === "D3") return [...THEORY_BLOCKS, ...D3_THEORY_BLOCKS];
  return [...THEORY_BLOCKS, ...D2_THEORY_BLOCKS];
}

export function isTheoryDepth(value: unknown): value is TheoryDepth {
  return value === "D1" || value === "D2" || value === "D3";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonEmptyStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);
}

function isRecordArray(
  value: unknown,
  validator: (entry: Record<string, unknown>) => boolean,
): boolean {
  return Array.isArray(value) && value.length > 0 && value.every((entry) => isRecord(entry) && validator(entry));
}

function hasStrings(entry: Record<string, unknown>, keys: string[]): boolean {
  return keys.every((key) => isNonEmptyString(entry[key]));
}

function isContentSource(value: unknown): value is ContentSource {
  if (!isRecord(value)) return false;
  return (
    hasStrings(value, ["id", "citation", "url"]) &&
    value.evidence_level === "L1" &&
    ["doi", "publisher", "university", "library", "journal", "authoritative_web"].includes(
      value.source_kind as string,
    ) &&
    isNonEmptyStringArray(value.supports)
  );
}

function isVerificationEntry(value: unknown, sourceIds: Set<string>): value is VerificationEntry {
  if (!isRecord(value) || !isNonEmptyString(value.claim)) return false;
  if (value.evidence_level === "L1") {
    return value.status === "verified" && isNonEmptyString(value.source_id) && sourceIds.has(value.source_id);
  }
  if (value.evidence_level === "L2") return value.status === "editorial";
  return value.evidence_level === "L3" && value.status === "proposed";
}

function isTheoryBlock(key: TheoryBlockName, value: unknown): boolean {
  switch (key) {
    case "what_is_it":
    case "origins":
    case "core_question":
      return isNonEmptyString(value);
    case "core_concepts":
      return isRecordArray(value, (entry) => hasStrings(entry, ["name", "definition", "relevance"]));
    case "genealogy":
      return isRecordArray(value, (entry) =>
        hasStrings(entry, ["related_theory", "relationship", "description"]) &&
        (entry.source_ids === undefined || isNonEmptyStringArray(entry.source_ids)),
      );
    case "applicable_topics":
    case "inapplicable_topics":
      return isRecordArray(value, (entry) => hasStrings(entry, ["topic", "rationale"]));
    case "misuse_risks":
    case "analysis_dimensions":
    case "fit_writing":
      return isNonEmptyStringArray(value);
    case "data_collection":
      return isRecordArray(value, (entry) =>
        hasStrings(entry, ["dimension", "collection_prompt"]) && isNonEmptyStringArray(entry.indicators),
      );
    case "chapter_structure":
      return isRecordArray(value, (entry) => hasStrings(entry, ["chapter", "purpose", "theory_use"]));
    case "historical_development":
      return isRecordArray(value, (entry) =>
        hasStrings(entry, ["period", "development", "significance"]) && isNonEmptyStringArray(entry.source_ids),
      );
    case "key_scholars":
      return isRecordArray(value, (entry) =>
        hasStrings(entry, ["name", "contribution", "representative_work"]) && isNonEmptyStringArray(entry.source_ids),
      );
    case "adjacent_theories":
      return isRecordArray(value, (entry) =>
        hasStrings(entry, ["theory", "shared_focus", "difference"]) && isNonEmptyStringArray(entry.source_ids),
      );
    case "criticisms":
      return isRecordArray(value, (entry) =>
        hasStrings(entry, ["criticism", "boundary"]) && isNonEmptyStringArray(entry.source_ids),
      );
    case "explanatory_mechanisms":
      return isRecordArray(value, (entry) =>
        hasStrings(entry, ["mechanism", "process", "evidence_focus"]) && isNonEmptyStringArray(entry.source_ids),
      );
    case "analysis_unit":
      return isNonEmptyString(value);
    case "theory_comparisons":
      return isRecordArray(value, (entry) =>
        hasStrings(entry, ["theory", "shared_focus", "difference", "when_prefer"]) &&
        (entry.role === "main_candidate" || entry.role === "alternative") && isNonEmptyStringArray(entry.source_ids),
      );
    case "boundary_conditions":
      return isRecordArray(value, (entry) =>
        hasStrings(entry, ["condition", "implication"]) && isNonEmptyStringArray(entry.source_ids),
      );
    case "sources":
      return Array.isArray(value) && value.length > 0 && value.every(isContentSource);
  }
}

export function isTheoryContent(
  value: unknown,
  depth: unknown,
): value is TheoryContent {
  if (!isTheoryDepth(depth) || !isRecord(value)) return false;
  const blocks = requiredTheoryBlocks(depth);
  if (!blocks.every((key) => isTheoryBlock(key, value[key]))) return false;

  const optionalBlocks: TheoryBlockName[] = [...THEORY_BLOCKS, ...D2_THEORY_BLOCKS, ...D3_THEORY_BLOCKS]
    .filter((key) => !blocks.includes(key));
  if (optionalBlocks.some((key) => key in value && !isTheoryBlock(key, value[key]))) return false;

  const sourceIds = new Set(
    Array.isArray(value.sources)
      ? value.sources.filter(isContentSource).map((source) => source.id)
      : [],
  );
  if ("theory_nature" in value) {
    const nature = value.theory_nature;
    if (!isRecord(nature) ||
      !["theory", "framework", "research_tradition", "editorial_umbrella"].includes(nature.kind as string) ||
      !hasStrings(nature, ["label", "explanation"]) ||
      !isNonEmptyStringArray(nature.source_ids) ||
      nature.source_ids.some((sourceId) => !sourceIds.has(sourceId))) return false;
  }
  for (const key of ["genealogy", "historical_development", "key_scholars", "adjacent_theories", "criticisms", "explanatory_mechanisms", "theory_comparisons", "boundary_conditions"] as const) {
    if (key in value && objectSourceIds(value[key]).some((sourceId) => !sourceIds.has(sourceId))) return false;
  }
  const validReadingPath = isRecordArray(value.reading_path, (entry) =>
    typeof entry.order === "number" && Number.isInteger(entry.order) && entry.order > 0 &&
    hasStrings(entry, ["title", "purpose"]) &&
    (entry.source_id === undefined ||
      (isNonEmptyString(entry.source_id) && sourceIds.has(entry.source_id))));
  if ((depth !== "D1" || "reading_path" in value) && !validReadingPath) return false;

  const verification = Array.isArray(value.verification) ? value.verification : [];
  const validVerification = verification.length > 0 &&
    verification.every((entry) => isVerificationEntry(entry, sourceIds));
  if ((depth !== "D1" || "verification" in value) && !validVerification) return false;
  if (depth !== "D1") {
    const levels = new Set(verification.flatMap((entry) => {
      if (!isRecord(entry)) return [];
      const level = entry.evidence_level;
      return level === "L1" || level === "L2" || level === "L3" ? [level] : [];
    }));
    if (!["L1", "L2", "L3"].every((level) => levels.has(level))) return false;
  }
  return true;
}

function objectSourceIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => isRecord(entry) && Array.isArray(entry.source_ids)
    ? entry.source_ids.filter(isNonEmptyString)
    : []);
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
      source_kind: "doi",
      evidence_level: "L1",
      supports: ["Bibliographic details", "Foundational framing of the life course"],
    },
  ],
  explanatory_mechanisms: [
    {
      mechanism: "Transition timing",
      process: "The timing and sequence of transitions can shape later pathways within historical and relational conditions.",
      evidence_focus: "Dated transitions and contextual evidence.",
      source_ids: ["elder-1998-life-course"],
    },
  ],
  analysis_unit: "A trajectory in historical and relational context.",
  theory_comparisons: [
    {
      theory: "Narrative inquiry",
      role: "main_candidate",
      shared_focus: "Biography and change over time.",
      difference: "Narrative inquiry centres meaning-making while life-course analysis also foregrounds social pathways and timing.",
      when_prefer: "Prefer narrative inquiry when remembered meaning is the primary object.",
      source_ids: ["elder-1998-life-course"],
    },
    {
      theory: "Event-history analysis",
      role: "alternative",
      shared_focus: "Transitions and timing.",
      difference: "Event-history analysis is a method rather than a complete theory of pathways.",
      when_prefer: "Prefer it when modelling event timing is the central task.",
      source_ids: ["elder-1998-life-course"],
    },
  ],
  boundary_conditions: [
    {
      condition: "A question has no temporal or relational component.",
      implication: "Life-course analysis is unlikely to be a primary framework.",
      source_ids: ["elder-1998-life-course"],
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
      claim: "The fit and boundary statements are an editorial interpretation for research use.",
      evidence_level: "L2",
      status: "editorial",
    },
    {
      claim: "The proposed chapter structure is an editorial adaptation for dissertation writing.",
      evidence_level: "L3",
      status: "proposed",
    },
  ],
};
