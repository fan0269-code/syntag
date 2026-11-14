/**
 * Screen-level advertising gate.
 *
 * GLOBAL_ADS_ENABLED is the only global switch, and it stays off.
 * Empty, navigation, search, pricing, policy, error, and transition screens
 * refuse an ad slot even if a later change turns the global switch on.
 * Entity screens follow the global switch. While it is off they also render nothing.
 * An unclassified screen fails closed.
 */

export const GLOBAL_ADS_ENABLED = false;

export const AD_SCREEN_KINDS = [
  "unclassified",
  "navigation",
  "empty-type",
  "search",
  "pricing",
  "policy",
  "error",
  "transition",
  "entity",
] as const;

export type AdScreenKind = (typeof AD_SCREEN_KINDS)[number];

const ALWAYS_REFUSED = new Set<AdScreenKind>([
  "unclassified",
  "navigation",
  "empty-type",
  "search",
  "pricing",
  "policy",
  "error",
  "transition",
]);

export function adSlotMayRender({
  screen,
  requested,
  globalEnabled = GLOBAL_ADS_ENABLED,
}: {
  screen: AdScreenKind;
  requested: boolean;
  globalEnabled?: boolean;
}): boolean {
  if (!requested || !globalEnabled) return false;
  if (ALWAYS_REFUSED.has(screen)) return false;
  return screen === "entity";
}
