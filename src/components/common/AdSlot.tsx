"use client";

import { adSlotMayRender, type AdScreenKind } from "@/lib/ad-screen";
import { useAdScreen } from "./AdScreenProvider";

type AdPlacement = "in-article" | "bottom" | "home-banner";

const heights: Record<AdPlacement, string> = {
  "in-article": "min(40vh, 280px)",
  bottom: "min(40vh, 250px)",
  "home-banner": "min(40vh, 180px)",
};

export function AdSlot({
  placement,
  enabled = false,
  screen,
}: {
  placement: AdPlacement;
  enabled?: boolean;
  screen?: AdScreenKind;
}) {
  const contextScreen = useAdScreen();
  const resolvedScreen = screen ?? contextScreen;
  // No advertising script is loaded from this component. A refused screen returns null,
  // including when a caller passes enabled, so the DOM has no ad container.
  if (!adSlotMayRender({ screen: resolvedScreen, requested: enabled })) return null;

  return (
    <aside className={`ad-slot ad-slot--${placement}`} aria-label="Advertisement">
      <span className="ad-slot__label">Advertisement</span>
      <div id={`adsense-${placement}`} className="ad-slot__content" style={{ minHeight: heights[placement] }} />
    </aside>
  );
}

export type { AdPlacement };
