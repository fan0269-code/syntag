type VerificationLevel = "L1_verified" | "L2_reviewed" | "L3_pending";

const labels: Record<VerificationLevel, string> = {
  L1_verified: "Source verified",
  L2_reviewed: "Editorial synthesis",
  L3_pending: "Sources listed · claim-level review pending",
};

export function VerificationBadge({ level }: { level: VerificationLevel }) {
  return <span className={`verification-badge verification-badge--${level}`}>{labels[level]}</span>;
}

export type { VerificationLevel };
