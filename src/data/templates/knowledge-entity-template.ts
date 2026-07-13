import type { ContentSource, VerificationEntry } from "./theory-template.ts";

export interface LegalAccessEntry {
  label: string;
  guidance: string;
  source_id: string;
}

export interface WorkContent {
  overview: string;
  core_question: string;
  central_argument: string;
  theoretical_contribution: string;
  reading_focus: string[];
  legal_access: LegalAccessEntry[];
  sources: ContentSource[];
  verification: VerificationEntry[];
}

export interface ConceptTheoryVariation {
  theory_slug: string;
  relationship: string;
  meaning: string;
  source_ids: string[];
}

export interface RelatedWorkEntry {
  work_slug: string;
  title: string;
  relationship: string;
  relevance: string;
}

export interface RelatedScholarEntry {
  name: string;
  scholar_slug?: string;
  relevance: string;
}

export interface ConceptContent {
  overview: string;
  theory_variations: ConceptTheoryVariation[];
  observable_manifestations: string[];
  misuse_risks: string[];
  related_works: RelatedWorkEntry[];
  related_scholars: RelatedScholarEntry[];
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
  return Array.isArray(value) && value.length > 0 && value.every((source) => isRecord(source) &&
    nonEmpty(source.id) && nonEmpty(source.citation) && nonEmpty(source.url) && source.evidence_level === "L1");
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

export function isWorkContent(value: unknown): value is WorkContent {
  if (!isRecord(value) || !["overview", "core_question", "central_argument", "theoretical_contribution"].every((key) => nonEmpty(value[key]))) return false;
  if (!Array.isArray(value.reading_focus) || value.reading_focus.length === 0 || !value.reading_focus.every(nonEmpty)) return false;
  if (!sourcesAreValid(value.sources)) return false;
  const sourceIds = new Set(value.sources.map((source) => source.id));
  if (!Array.isArray(value.legal_access) || value.legal_access.length === 0 || !value.legal_access.every((entry) => isRecord(entry) && nonEmpty(entry.label) && nonEmpty(entry.guidance) && nonEmpty(entry.source_id) && sourceIds.has(entry.source_id))) return false;
  return verificationIsValid(value.verification, sourceIds);
}

export function isConceptContent(value: unknown): value is ConceptContent {
  if (!isRecord(value) || !nonEmpty(value.overview) || !sourcesAreValid(value.sources)) return false;
  const sourceIds = new Set(value.sources.map((source) => source.id));
  if (!Array.isArray(value.theory_variations) || value.theory_variations.length === 0 || !value.theory_variations.every((entry) => isRecord(entry) && nonEmpty(entry.theory_slug) && nonEmpty(entry.relationship) && nonEmpty(entry.meaning) && Array.isArray(entry.source_ids) && entry.source_ids.length > 0 && entry.source_ids.every((sourceId) => nonEmpty(sourceId) && sourceIds.has(sourceId)))) return false;
  if (!Array.isArray(value.observable_manifestations) || value.observable_manifestations.length === 0 || !value.observable_manifestations.every(nonEmpty)) return false;
  if (!Array.isArray(value.misuse_risks) || value.misuse_risks.length === 0 || !value.misuse_risks.every(nonEmpty)) return false;
  if (!Array.isArray(value.related_works) || value.related_works.length === 0 || !value.related_works.every((entry) => isRecord(entry) && nonEmpty(entry.work_slug) && nonEmpty(entry.title) && nonEmpty(entry.relationship) && nonEmpty(entry.relevance))) return false;
  if (!Array.isArray(value.related_scholars) || value.related_scholars.length === 0 || !value.related_scholars.every((entry) => isRecord(entry) && nonEmpty(entry.name) && nonEmpty(entry.relevance) && (entry.scholar_slug === undefined || nonEmpty(entry.scholar_slug)))) return false;
  return verificationIsValid(value.verification, sourceIds);
}
