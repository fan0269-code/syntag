import type { ContentSource, VerificationEntry } from "./theory-template.ts";

export type TheoryPathwayRole = "primary" | "supporting" | "not_recommended";
export type PathwayEntryType = "topic" | "field" | "theory" | "scholar" | "work" | "concept";

export interface TheoryPathway {
  theory_slug: string;
  role: TheoryPathwayRole;
  explanatory_focus: string;
  analysis_unit: string;
  data_materials: string;
  strengths: string;
  limitations: string;
  source_ids: string[];
}

export interface PathwayContent {
  overview: string;
  core_questions: string[];
  question_categories: Array<{
    category: string;
    description: string;
    theory_slugs: string[];
  }>;
  selection_path: Array<{
    step: string;
    prompt: string;
    routing_rule: string;
  }>;
  theory_pathways: TheoryPathway[];
  entry_points: Array<{
    entity_type: PathwayEntryType;
    slug: string;
    label: string;
    relevance: string;
  }>;
  sources: ContentSource[];
  verification: VerificationEntry[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function sourcesAreValid(value: unknown): value is ContentSource[] {
  return Array.isArray(value) && value.length > 0 && value.every((source) => isRecord(source)
    && nonEmpty(source.id) && nonEmpty(source.citation) && nonEmpty(source.url) && source.evidence_level === "L1");
}

function verificationIsValid(value: unknown, sourceIds: Set<string>): value is VerificationEntry[] {
  if (!Array.isArray(value) || value.length === 0) return false;
  const levels = new Set<string>();
  for (const entry of value) {
    if (!isRecord(entry) || !nonEmpty(entry.claim)) return false;
    if (entry.evidence_level === "L1") {
      if (entry.status !== "verified" || !nonEmpty(entry.source_id) || !sourceIds.has(entry.source_id)) return false;
    } else if (entry.evidence_level === "L2") {
      if (entry.status !== "editorial") return false;
    } else if (entry.evidence_level === "L3") {
      if (entry.status !== "proposed") return false;
    } else return false;
    levels.add(entry.evidence_level);
  }
  return ["L1", "L2", "L3"].every((level) => levels.has(level));
}

export function isPathwayContent(value: unknown): value is PathwayContent {
  if (!isRecord(value) || !nonEmpty(value.overview) || !sourcesAreValid(value.sources)) return false;
  const sourceIds = new Set(value.sources.map((source) => source.id));
  if (!Array.isArray(value.core_questions) || value.core_questions.length === 0 || !value.core_questions.every(nonEmpty)) return false;
  if (!Array.isArray(value.question_categories) || value.question_categories.length === 0 || !value.question_categories.every((entry) => isRecord(entry) && nonEmpty(entry.category) && nonEmpty(entry.description) && Array.isArray(entry.theory_slugs) && entry.theory_slugs.length > 0 && entry.theory_slugs.every(nonEmpty))) return false;
  if (!Array.isArray(value.selection_path) || value.selection_path.length === 0 || !value.selection_path.every((entry) => isRecord(entry) && nonEmpty(entry.step) && nonEmpty(entry.prompt) && nonEmpty(entry.routing_rule))) return false;
  if (!Array.isArray(value.theory_pathways) || value.theory_pathways.length < 3 || !value.theory_pathways.every((entry) => isRecord(entry) && nonEmpty(entry.theory_slug) && ["primary", "supporting", "not_recommended"].includes(entry.role as string) && ["explanatory_focus", "analysis_unit", "data_materials", "strengths", "limitations"].every((key) => nonEmpty(entry[key])) && Array.isArray(entry.source_ids) && entry.source_ids.length > 0 && entry.source_ids.every((sourceId) => nonEmpty(sourceId) && sourceIds.has(sourceId)))) return false;
  if (!Array.isArray(value.entry_points) || value.entry_points.length === 0 || !value.entry_points.every((entry) => isRecord(entry) && ["topic", "field", "theory", "scholar", "work", "concept"].includes(entry.entity_type as string) && nonEmpty(entry.slug) && nonEmpty(entry.label) && nonEmpty(entry.relevance))) return false;
  return verificationIsValid(value.verification, sourceIds);
}

export function pathwayContentFromPayload(value: unknown): PathwayContent | null {
  return isRecord(value) && isPathwayContent(value.en) ? value.en : null;
}
