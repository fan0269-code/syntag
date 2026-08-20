/**
 * Temporary U3 quarantine approved in FAN-48 on 2026-08-14.
 *
 * Public genealogy is an allowlist: keep this empty until each relation has
 * complete evidence, row-level human review, and an owner release decision.
 * The corpus, audit records, and database rows remain available internally.
 */
export const PUBLIC_GENEALOGY_RELATION_IDS: readonly string[] = [];

export function isPublicGenealogyRelation(id: string) {
  return PUBLIC_GENEALOGY_RELATION_IDS.includes(id);
}

export function filterPublicGenealogyRelations<T extends { id: string }>(relations: T[]) {
  return relations.filter(({ id }) => isPublicGenealogyRelation(id));
}

export function publicGenealogyRelationWhere() {
  return { id: { in: [...PUBLIC_GENEALOGY_RELATION_IDS] } };
}

export function hasPublicGenealogyRelations() {
  return PUBLIC_GENEALOGY_RELATION_IDS.length > 0;
}
