/**
 * A claim ledger is closed only when every row has the publication-gate
 * fields and an L1 row has a locator. Research guidance stays labeled.
 * It is not a claim that every sentence on the page was read from an open full text.
 */

export type LedgerLevel = "source_record" | "source_verified" | "L2_editorial" | "L3_pending" | "L3_guidance";

export const OPEN_THEORY_LEDGER_SUMMARY = "Sources listed · claim-level review pending · editorial synthesis ongoing";
export const OPEN_ENTITY_LEDGER_SUMMARY = "Source records available · editorial synthesis · claim-level review pending";
export const CLOSED_LEDGER_SUMMARY = "Claim ledger closed · source-backed facts carry a URL, source type, verification date, and locator · editorial synthesis and research guidance stay labeled";

type LedgerRow = {
  claim?: unknown;
  claimId?: unknown;
  fieldPath?: unknown;
  evidence_level?: unknown;
  source_id?: unknown;
  status?: unknown;
  locator?: unknown;
  contentNature?: unknown;
  evidenceStatus?: unknown;
  verifiedAt?: unknown;
  reviewerRole?: unknown;
  reviewDecision?: unknown;
};

function row(value: unknown): LedgerRow | null {
  return value && typeof value === "object" ? value as LedgerRow : null;
}

function text(value: unknown): string {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function reviewed(entry: LedgerRow): boolean {
  return Boolean(
    text(entry.claimId)
    && text(entry.fieldPath)
    && text(entry.verifiedAt)
    && !Number.isNaN(Date.parse(text(entry.verifiedAt)))
    && entry.reviewerRole === "publication_editor"
    && entry.reviewDecision === "approved",
  );
}

export function isClosedClaimLedger(entries: readonly unknown[] | undefined): boolean {
  if (!entries || entries.length === 0) return false;
  let hasFact = false;
  for (const value of entries) {
    const entry = row(value);
    if (!entry || !text(entry.claim) || !reviewed(entry)) return false;
    if (entry.evidence_level === "L1") {
      if (
        entry.status !== "verified"
        || !text(entry.source_id)
        || !text(entry.locator)
        || entry.contentNature !== "source_backed_fact"
        || entry.evidenceStatus !== "source_verified"
      ) return false;
      hasFact = true;
      continue;
    }
    if (entry.evidence_level === "L2") {
      if (entry.status !== "editorial" || entry.contentNature !== "editorial_synthesis") return false;
      continue;
    }
    if (entry.evidence_level === "L3") {
      if (entry.status !== "proposed" || entry.contentNature !== "research_guidance") return false;
      continue;
    }
    return false;
  }
  return hasFact;
}

export function ledgerDate(verifiedAt: unknown): string {
  const value = text(verifiedAt);
  return value.length >= 10 ? value.slice(0, 10) : "";
}
