type VerificationLevel = "L1_verified" | "L2_reviewed" | "L3_pending";

const labels: Record<VerificationLevel, string> = {
  L1_verified: "Verified",
  L2_reviewed: "Editorially Reviewed",
  L3_pending: "Research Guidance",
};

export function VerificationBadge({ level }: { level: VerificationLevel }) {
  return <span className={`verification-badge verification-badge--${level}`}>{labels[level]}</span>;
}

export type { VerificationLevel };
