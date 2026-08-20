export const FAN_133_U3_ARCHIVED_WORK_SLUGS = ["equity-sen-1992"] as const;
export const FAN_133_U3_ARCHIVED_CONCEPT_SLUGS = [
  "trajectory",
  "transition",
  "turning-point",
  "teacher-professional-identity",
  "teacher-self-understanding",
  "duality-of-structure",
  "rules-and-resources",
  "recursive-practice",
  "mutual-engagement",
  "shared-repertoire",
  "habitus",
  "field",
  "symbolic-power",
  "professional-learning",
  "institutional-isomorphism",
] as const;

export type U3ArchivedEntityType = "work" | "concept";

export function isFAN133U3Archived(type: U3ArchivedEntityType, slug: string) {
  return type === "work"
    ? FAN_133_U3_ARCHIVED_WORK_SLUGS.includes(slug as typeof FAN_133_U3_ARCHIVED_WORK_SLUGS[number])
    : FAN_133_U3_ARCHIVED_CONCEPT_SLUGS.includes(slug as typeof FAN_133_U3_ARCHIVED_CONCEPT_SLUGS[number]);
}
