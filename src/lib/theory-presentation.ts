import type { TheoryDepth } from "../data/templates/theory-template";
import type { ContentRecord } from "./content";

export type TheorySectionKey =
  | "origins"
  | "theory_nature"
  | "explanatory_mechanisms"
  | "analysis_unit"
  | "theory_comparisons"
  | "boundary_conditions"
  | "core_question"
  | "historical_development"
  | "key_scholars"
  | "core_concepts"
  | "genealogy"
  | "adjacent_theories"
  | "applicable_topics"
  | "inapplicable_topics"
  | "misuse_risks"
  | "criticisms"
  | "analysis_dimensions"
  | "data_collection"
  | "chapter_structure"
  | "fit_writing"
  | "depth_coverage"
  | "reading_path"
  | "sources_and_verification";

type VerificationLevel = "L1_verified" | "L2_reviewed" | "L3_pending";

type CoreConcept = { name: string; definition: string; relevance: string };
type Genealogy = { relatedTheory: string; relationship: string; description: string; sources: ContentSource[] };
type TheoryNature = { kind: string; label: string; explanation: string; sources: ContentSource[] };
type Suitability = { topic: string; rationale: string };
type DataCollection = { dimension: string; indicators: string[]; collectionPrompt: string };
type ChapterUse = { chapter: string; purpose: string; theoryUse: string };
type ContentSource = { id: string; citation: string; url: string };
type HistoricalDevelopment = { period: string; development: string; significance: string; sources: ContentSource[] };
type ScholarContribution = { name: string; contribution: string; representativeWork: string; sources: ContentSource[] };
type AdjacentTheory = { theory: string; sharedFocus: string; difference: string; sources: ContentSource[] };
type CriticismBoundary = { criticism: string; boundary: string; sources: ContentSource[] };
type ExplanatoryMechanism = { mechanism: string; process: string; evidenceFocus: string; sources: ContentSource[] };
type TheoryComparison = { theory: string; role: "main_candidate" | "alternative"; sharedFocus: string; difference: string; whenPrefer: string; sources: ContentSource[] };
type BoundaryCondition = { condition: string; implication: string; sources: ContentSource[] };
type ReadingPath = { order: number; level: string; title: string; purpose: string; source?: ContentSource };
type SourceItem = { text: string; level: VerificationLevel; url?: string };

export type TheoryPresentation = {
  depthLabel: string;
  summary: string;
  origins: string;
  theoryNature: TheoryNature | null;
  explanatoryMechanisms: ExplanatoryMechanism[];
  analysisUnit: string;
  theoryComparisons: TheoryComparison[];
  boundaryConditions: BoundaryCondition[];
  coreQuestion: string;
  historicalDevelopment: HistoricalDevelopment[];
  keyScholars: ScholarContribution[];
  coreConcepts: CoreConcept[];
  genealogy: Genealogy[];
  adjacentTheories: AdjacentTheory[];
  applicableTopics: Suitability[];
  inapplicableTopics: Suitability[];
  misuseRisks: string[];
  criticisms: CriticismBoundary[];
  analysisDimensions: string[];
  dataCollection: DataCollection[];
  chapterStructure: ChapterUse[];
  fitWriting: string[];
  readingPath: ReadingPath[];
  sourceItems: SourceItem[];
  verificationSummary: string;
  depthCoverage: string[];
  sectionKeys: TheorySectionKey[];
};

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function nonEmptyString(value: unknown): string {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(nonEmptyString).filter(Boolean) : [];
}

function objectArray(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const parsed = record(item);
    return parsed ? [parsed] : [];
  });
}

function depthLabel(depth: TheoryDepth) {
  if (depth === "D3") return "D3 · Deep research";
  if (depth === "D2") return "D2 · Research design";
  return "D1 · Foundation";
}

function contentSources(value: unknown): ContentSource[] {
  return objectArray(value).flatMap((item) => {
    const id = nonEmptyString(item.id);
    const citation = nonEmptyString(item.citation);
    const url = nonEmptyString(item.url);
    return id && citation && url ? [{ id, citation, url }] : [];
  });
}

function buildSourceItems(value: unknown, sources: ContentSource[]): SourceItem[] {
  const sourceById = new Map(sources.map((source) => [source.id, source]));
  const items = objectArray(value).flatMap<SourceItem>((entry) => {
    const claim = nonEmptyString(entry.claim);
    const evidenceLevel = nonEmptyString(entry.evidence_level);
    if (!claim) return [];

    if (evidenceLevel === "L1") {
      const source = sourceById.get(nonEmptyString(entry.source_id));
      if (entry.status !== "verified" || !source) return [];
      return [{
        text: `${claim} — ${source.citation}`,
        level: "L3_pending" as const,
        url: source.url,
      }];
    }
    if (evidenceLevel === "L2" && entry.status === "editorial") {
      return [{ text: claim, level: "L2_reviewed" as const }];
    }
    if (evidenceLevel === "L3" && entry.status === "proposed") {
      return [{ text: claim, level: "L3_pending" as const }];
    }
    return [];
  });

  const linkedUrls = new Set(items.flatMap((item) => item.url ? [item.url] : []));
  return [
    ...items,
    ...sources.filter((source) => !linkedUrls.has(source.url)).map((source) => ({
      text: source.citation,
      level: "L3_pending" as const,
      url: source.url,
    })),
  ];
}

function linkedSources(value: unknown, sources: ContentSource[]): ContentSource[] {
  const ids = new Set(stringArray(value));
  return sources.filter((source) => ids.has(source.id));
}

export function buildTheoryPresentation(content: ContentRecord, depth: TheoryDepth): TheoryPresentation {
  const sources = contentSources(content.sources);
  const coreConcepts = objectArray(content.core_concepts).flatMap((item) => {
    const name = nonEmptyString(item.name);
    const definition = nonEmptyString(item.definition);
    const relevance = nonEmptyString(item.relevance);
    return name && definition && relevance ? [{ name, definition, relevance }] : [];
  });
  const genealogy = objectArray(content.genealogy).flatMap((item) => {
    const relatedTheory = nonEmptyString(item.related_theory);
    const relationship = nonEmptyString(item.relationship);
    const description = nonEmptyString(item.description);
    return relatedTheory && relationship && description
      ? [{ relatedTheory, relationship, description, sources: linkedSources(item.source_ids, sources) }]
      : [];
  });
  const theoryNature = (() => {
    const nature = record(content.theory_nature);
    if (!nature) return null;
    const kind = nonEmptyString(nature.kind);
    const label = nonEmptyString(nature.label);
    const explanation = nonEmptyString(nature.explanation);
    return kind && label && explanation
      ? { kind, label, explanation, sources: linkedSources(nature.source_ids, sources) }
      : null;
  })();
  const explanatoryMechanisms = objectArray(content.explanatory_mechanisms).flatMap((item) => {
    const mechanism = nonEmptyString(item.mechanism);
    const process = nonEmptyString(item.process);
    const evidenceFocus = nonEmptyString(item.evidence_focus);
    return mechanism && process && evidenceFocus
      ? [{ mechanism, process, evidenceFocus, sources: linkedSources(item.source_ids, sources) }]
      : [];
  });
  const analysisUnit = nonEmptyString(content.analysis_unit);
  const theoryComparisons = objectArray(content.theory_comparisons).flatMap((item) => {
    const theory = nonEmptyString(item.theory);
    const role: TheoryComparison["role"] | null = item.role === "main_candidate"
      ? "main_candidate"
      : item.role === "alternative"
        ? "alternative"
        : null;
    const sharedFocus = nonEmptyString(item.shared_focus);
    const difference = nonEmptyString(item.difference);
    const whenPrefer = nonEmptyString(item.when_prefer);
    return theory && role && sharedFocus && difference && whenPrefer
      ? [{ theory, role, sharedFocus, difference, whenPrefer, sources: linkedSources(item.source_ids, sources) }]
      : [];
  });
  const boundaryConditions = objectArray(content.boundary_conditions).flatMap((item) => {
    const condition = nonEmptyString(item.condition);
    const implication = nonEmptyString(item.implication);
    return condition && implication ? [{ condition, implication, sources: linkedSources(item.source_ids, sources) }] : [];
  });
  const historicalDevelopment = objectArray(content.historical_development).flatMap((item) => {
    const period = nonEmptyString(item.period);
    const development = nonEmptyString(item.development);
    const significance = nonEmptyString(item.significance);
    return period && development && significance ? [{ period, development, significance, sources: linkedSources(item.source_ids, sources) }] : [];
  });
  const keyScholars = objectArray(content.key_scholars).flatMap((item) => {
    const name = nonEmptyString(item.name);
    const contribution = nonEmptyString(item.contribution);
    const representativeWork = nonEmptyString(item.representative_work);
    return name && contribution && representativeWork ? [{ name, contribution, representativeWork, sources: linkedSources(item.source_ids, sources) }] : [];
  });
  const adjacentTheories = objectArray(content.adjacent_theories).flatMap((item) => {
    const theory = nonEmptyString(item.theory);
    const sharedFocus = nonEmptyString(item.shared_focus);
    const difference = nonEmptyString(item.difference);
    return theory && sharedFocus && difference ? [{ theory, sharedFocus, difference, sources: linkedSources(item.source_ids, sources) }] : [];
  });
  const criticisms = objectArray(content.criticisms).flatMap((item) => {
    const criticism = nonEmptyString(item.criticism);
    const boundary = nonEmptyString(item.boundary);
    return criticism && boundary ? [{ criticism, boundary, sources: linkedSources(item.source_ids, sources) }] : [];
  });
  const suitability = (value: unknown): Suitability[] => objectArray(value).flatMap((item) => {
    const topic = nonEmptyString(item.topic);
    const rationale = nonEmptyString(item.rationale);
    return topic && rationale ? [{ topic, rationale }] : [];
  });
  const analysisDimensions = stringArray(content.analysis_dimensions);
  const dataCollection = objectArray(content.data_collection).flatMap((item) => {
    const dimension = nonEmptyString(item.dimension);
    const indicators = stringArray(item.indicators);
    const collectionPrompt = nonEmptyString(item.collection_prompt);
    return dimension && indicators.length && collectionPrompt ? [{ dimension, indicators, collectionPrompt }] : [];
  });
  const chapterStructure = objectArray(content.chapter_structure).flatMap((item) => {
    const chapter = nonEmptyString(item.chapter);
    const purpose = nonEmptyString(item.purpose);
    const theoryUse = nonEmptyString(item.theory_use);
    return chapter && purpose && theoryUse ? [{ chapter, purpose, theoryUse }] : [];
  });
  const readingPath = objectArray(content.reading_path).flatMap((item) => {
    const order = typeof item.order === "number" ? item.order : 0;
    const level = nonEmptyString(item.level);
    const title = nonEmptyString(item.title);
    const purpose = nonEmptyString(item.purpose);
    const source = sources.find((candidate) => candidate.id === nonEmptyString(item.source_id));
    return order > 0 && title && purpose ? [{ order, level, title, purpose, source }] : [];
  }).sort((left, right) => left.order - right.order);
  const sourceItems = buildSourceItems(content.verification, sources);
  const advancedSections: TheorySectionKey[] = [
    "analysis_dimensions",
    "data_collection",
    "chapter_structure",
    "fit_writing",
  ];
  const sectionKeys: TheorySectionKey[] = [
    "origins",
    ...(theoryNature ? ["theory_nature" as const] : []),
    ...(depth === "D2" ? [
      "explanatory_mechanisms" as const,
      "analysis_unit" as const,
      "theory_comparisons" as const,
      "boundary_conditions" as const,
    ] : []),
    ...(depth === "D3" ? [
      "core_question" as const,
      "historical_development" as const,
      "key_scholars" as const,
    ] : []),
    "core_concepts",
    "genealogy",
    ...(depth === "D3" ? ["adjacent_theories" as const] : []),
    "applicable_topics",
    "inapplicable_topics",
    "misuse_risks",
    ...(depth === "D3" ? ["criticisms" as const] : []),
    ...(depth === "D1" ? [] : advancedSections),
    ...(depth === "D3" ? ["depth_coverage" as const] : []),
    "reading_path",
    "sources_and_verification",
  ];
  const depthCoverage = depth === "D3" ? [
    `${historicalDevelopment.length} development stages`,
    `${keyScholars.length} scholar contributions`,
    `${coreConcepts.length} core concepts`,
    `${genealogy.length} genealogy links`,
    `${adjacentTheories.length} adjacent theory comparisons`,
    `${criticisms.length} criticism and boundary notes`,
    `${analysisDimensions.length} analysis dimensions`,
    `${dataCollection.length} data collection guides`,
    `${chapterStructure.length} chapter uses`,
    `${readingPath.length} reading path entries`,
  ] : [];

  return {
    depthLabel: depthLabel(depth),
    summary: nonEmptyString(content.what_is_it),
    origins: nonEmptyString(content.origins),
    theoryNature,
    explanatoryMechanisms,
    analysisUnit,
    theoryComparisons,
    boundaryConditions,
    coreQuestion: nonEmptyString(content.core_question),
    historicalDevelopment,
    keyScholars,
    coreConcepts,
    genealogy,
    adjacentTheories,
    applicableTopics: suitability(content.applicable_topics),
    inapplicableTopics: suitability(content.inapplicable_topics),
    misuseRisks: stringArray(content.misuse_risks),
    criticisms,
    analysisDimensions,
    dataCollection,
    chapterStructure,
    fitWriting: stringArray(content.fit_writing),
    readingPath,
    sourceItems,
    verificationSummary: "Sources listed · claim-level review pending",
    depthCoverage,
    sectionKeys,
  };
}
