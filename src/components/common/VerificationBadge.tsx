type VerificationLevel = "source_record" | "L2_editorial" | "L3_pending";
type VerificationScope = "claim" | "source" | "page";

const labels: Record<VerificationLevel, string> = {
  source_record: "Source record",
  L2_editorial: "Editorial synthesis",
  L3_pending: "Claim-level review pending",
};

const levelLabels: Record<VerificationLevel, string> = {
  source_record: "Record",
  L2_editorial: "L2",
  L3_pending: "L3",
};

const explanations: Record<VerificationLevel, string> = {
  source_record: "A bibliographic or contextual record is listed; this does not imply claim-level verification.",
  L2_editorial: "This is an editorial synthesis rather than a primary-source fact.",
  L3_pending: "Source records may be listed, but page-level interpretation and research-use guidance remain under claim-level review.",
};

export function VerificationBadge({ level, scope = "claim" }: { level: VerificationLevel; scope?: VerificationScope }) {
  return <span className={`verification-badge verification-badge--${level}`} data-verification-scope={scope}>
    <span className="verification-badge__level">{levelLabels[level]}</span>
    <span className="verification-badge__text">{labels[level]}</span>
    <span className="verification-badge__explanation">{explanations[level]}</span>
  </span>;
}

export type { VerificationLevel, VerificationScope };
