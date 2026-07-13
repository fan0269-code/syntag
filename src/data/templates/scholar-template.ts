import type {
  ContentSource,
  ReadingPathEntry,
  VerificationEntry,
} from "./theory-template.ts";

export interface ScholarContent {
  overview: string;
  academic_identity: {
    discipline: string;
    role: string;
    source_ids: string[];
  };
  theory_relationships: Array<{
    theory_slug: string;
    relationship: string;
    description: string;
    source_ids: string[];
  }>;
  representative_works: Array<{
    title: string;
    work_slug?: string;
    contribution: string;
    source_ids: string[];
  }>;
  scholarly_relations: Array<{
    kind: "influence" | "development" | "critique" | "collaboration";
    description: string;
    source_ids: string[];
  }>;
  attribution_boundaries: string[];
  reading_path: ReadingPathEntry[];
  sources: ContentSource[];
  verification: VerificationEntry[];
}

export const GLEN_ELDER_COMPACT_EXAMPLE: ScholarContent = {
  overview:
    "Glen H. Elder Jr. is a sociologist whose work helped establish modern life-course research.",
  academic_identity: {
    discipline: "Sociology",
    role: "Life-course researcher",
    source_ids: ["elder-1998-life-course"],
  },
  theory_relationships: [{ theory_slug: "life-course-theory", relationship: "Key contributor", description: "The cited article supplies a life-course formulation used by the corresponding theory page.", source_ids: ["elder-1998-life-course"] }],
  representative_works: [{ title: "The Life Course as Developmental Theory", contribution: "A concise formulation of the life-course perspective used as an entry point in this corpus.", source_ids: ["elder-1998-life-course"] }],
  scholarly_relations: [{ kind: "development", description: "Editorially, this article is treated as a contribution to modern life-course research rather than proof of sole authorship of the wider tradition.", source_ids: ["elder-1998-life-course"] }],
  attribution_boundaries: ["Do not attribute all life-course scholarship, later applications, or every use of temporal biography to Elder alone."],
  reading_path: [
    {
      order: 1,
      title: "The life course as developmental theory",
      purpose: "Start with Elder's concise formulation of the framework.",
      source_id: "elder-1998-life-course",
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
      supports: ["Author attribution", "Work citation"],
    },
  ],
  verification: [
    {
      claim: "Elder authored the cited 1998 article.",
      evidence_level: "L1",
      source_id: "elder-1998-life-course",
      status: "verified",
    },
    {
      claim: "The profile's theory relation and contribution wording are bounded editorial synthesis.",
      evidence_level: "L2",
      status: "editorial",
    },
    {
      claim: "Reading choices should be adapted to a study's question, access, and disciplinary guidance.",
      evidence_level: "L3",
      status: "proposed",
    },
  ],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function sourcesAreValid(value: unknown): value is ContentSource[] {
  return Array.isArray(value) && value.length > 0 && value.every((source) => isRecord(source) && nonEmpty(source.id) && nonEmpty(source.citation) && nonEmpty(source.url) && source.evidence_level === "L1");
}

function sourceIdsAreValid(value: unknown, sourceIds: Set<string>): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every((sourceId) => nonEmpty(sourceId) && sourceIds.has(sourceId));
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

export function isScholarContent(value: unknown): value is ScholarContent {
  if (!isRecord(value) || !nonEmpty(value.overview) || !sourcesAreValid(value.sources)) return false;
  const sourceIds = new Set(value.sources.map((source) => source.id));
  if (!isRecord(value.academic_identity) || !nonEmpty(value.academic_identity.discipline) || !nonEmpty(value.academic_identity.role) || !sourceIdsAreValid(value.academic_identity.source_ids, sourceIds)) return false;
  if (!Array.isArray(value.theory_relationships) || value.theory_relationships.length === 0 || !value.theory_relationships.every((entry) => isRecord(entry) && nonEmpty(entry.theory_slug) && nonEmpty(entry.relationship) && nonEmpty(entry.description) && sourceIdsAreValid(entry.source_ids, sourceIds))) return false;
  if (!Array.isArray(value.representative_works) || value.representative_works.length === 0 || !value.representative_works.every((entry) => isRecord(entry) && nonEmpty(entry.title) && (entry.work_slug === undefined || nonEmpty(entry.work_slug)) && nonEmpty(entry.contribution) && sourceIdsAreValid(entry.source_ids, sourceIds))) return false;
  if (!Array.isArray(value.scholarly_relations) || value.scholarly_relations.length === 0 || !value.scholarly_relations.every((entry) => isRecord(entry) && ["influence", "development", "critique", "collaboration"].includes(String(entry.kind)) && nonEmpty(entry.description) && sourceIdsAreValid(entry.source_ids, sourceIds))) return false;
  if (!Array.isArray(value.attribution_boundaries) || value.attribution_boundaries.length === 0 || !value.attribution_boundaries.every(nonEmpty)) return false;
  if (!Array.isArray(value.reading_path) || value.reading_path.length === 0 || !value.reading_path.every((entry) => isRecord(entry) && typeof entry.order === "number" && nonEmpty(entry.title) && nonEmpty(entry.purpose) && nonEmpty(entry.source_id) && sourceIds.has(entry.source_id))) return false;
  return verificationIsValid(value.verification, sourceIds);
}
