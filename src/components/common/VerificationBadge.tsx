type VerificationLevel = "L1_verified" | "L2_reviewed" | "L3_pending";
type VerificationScope = "claim" | "source" | "page";

const labels: Record<VerificationLevel, string> = {
  L1_verified: "Source verified",
  L2_reviewed: "Editorial synthesis",
  L3_pending: "Sources listed · claim-level review pending",
};

const levelLabels: Record<VerificationLevel, string> = {
  L1_verified: "L1",
  L2_reviewed: "L2",
  L3_pending: "L3",
};

const explanations: Record<VerificationLevel, string> = {
  L1_verified: "A listed source supports this registered item.",
  L2_reviewed: "This is an editorial synthesis rather than a primary-source fact.",
  L3_pending: "Sources are listed, but claim-level review remains pending.",
};

export function VerificationBadge({ level, scope = "claim" }: { level: VerificationLevel; scope?: VerificationScope }) {
  return <span className={`verification-badge verification-badge--${level}`} data-verification-scope={scope}>
    <span className="verification-badge__level">{levelLabels[level]}</span>
    <span className="verification-badge__text">{labels[level]}</span>
    <span className="verification-badge__explanation">{explanations[level]}</span>
  </span>;
}

export type { VerificationLevel, VerificationScope };
