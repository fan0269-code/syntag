/**
 * CEO-authorized visibility contraction from FAN-247, revision
 * caec373f-4f30-4f7b-b566-4fce2fff1e09.
 *
 * This is a publication-state decision only. It does not make or imply an
 * academic, editorial, methods, or named-human review decision.
 */
export const FAN_247_ARCHIVED_DISCIPLINE_SLUGS = [
  "education",
  "sociology",
] as const;

export const FAN_247_ARCHIVED_FIELD_SLUGS = [
  "teacher-education-professional-development",
  "rural-remote-education",
  "educational-equity-policy",
  "life-course-aging-studies",
  "sociology-of-education",
  "organizational-sociology",
] as const;

export const FAN_247_ARCHIVED_THEORY_SLUGS = [
  "life-course-theory",
  "teacher-identity-theory",
  "structuration-theory",
  "communities-of-practice",
  "practice-theory-bourdieu",
  "social-capital-theory",
  "teacher-professional-development-theory",
  "teacher-life-history-research",
  "educational-equity-theory",
  "institutional-theory",
  "street-level-bureaucracy",
  "multiple-streams-framework",
] as const;

export const FAN_247_ARCHIVED_WORK_SLUGS = [
  "elder-1998-life-course",
  "beijaard-meijer-verloop-2004-identity",
  "kelchtermans-2009-teacher-identity",
  "struct-giddens-1984",
  "lave-wenger-1991-situated-learning",
  "cop-wenger-1998",
  "bourdieu-1977-outline-practice",
  "practice-capital-1986",
  "coleman-1988-social-capital",
  "social-lin-2001",
  "day-1999-developing-teachers",
  "teacher-development-clarke-hollingsworth-2002",
  "goodson-2013-narrative-theory",
  "unesco-2020-inclusion-education",
  "dimaggio-powell-1983-iron-cage",
  "institutional-meyer-rowan-1977",
  "lipsky-2010-street-level-bureaucracy",
  "kingdon-1995-agendas-alternatives",
] as const;

export const FAN_247_ARCHIVED_CONCEPT_SLUGS = [
  "legitimate-peripheral-participation",
  "capital-conversion",
  "relational-resource-access",
  "obligation-and-reciprocity",
  "life-history",
  "educational-equity",
  "decoupling",
  "frontline-discretion",
  "streams-coupling-policy-window",
] as const;

export const FAN_247_ARCHIVED_SCHOLAR_SLUGS = [
  "glen-h-elder-jr",
  "geert-kelchtermans",
  "anthony-giddens",
  "pierre-bourdieu",
  "jean-lave",
  "etienne-wenger",
  "michael-lipsky",
] as const;

export const FAN_247_ARCHIVED_TOPIC_SLUGS = [
  "teachers-professional-identity-during-reform",
  "educational-transitions-over-time",
  "organizational-routines-and-structural-change",
  "inequality-in-educational-and-social-fields",
] as const;

export const FAN_247_ARCHIVED_PAGE_COUNT = 58;

export type FAN247VisibilityEntityType =
  | "discipline"
  | "field"
  | "theory"
  | "work"
  | "concept"
  | "scholar"
  | "topic";

const archivedSlugs: Record<FAN247VisibilityEntityType, readonly string[]> = {
  discipline: FAN_247_ARCHIVED_DISCIPLINE_SLUGS,
  field: FAN_247_ARCHIVED_FIELD_SLUGS,
  theory: FAN_247_ARCHIVED_THEORY_SLUGS,
  work: FAN_247_ARCHIVED_WORK_SLUGS,
  concept: FAN_247_ARCHIVED_CONCEPT_SLUGS,
  scholar: FAN_247_ARCHIVED_SCHOLAR_SLUGS,
  topic: FAN_247_ARCHIVED_TOPIC_SLUGS,
};

export function isFAN247Archived(type: FAN247VisibilityEntityType, slug: string) {
  return archivedSlugs[type].includes(slug);
}
