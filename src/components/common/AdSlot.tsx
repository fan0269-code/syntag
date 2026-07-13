type AdPlacement = "in-article" | "bottom" | "home-banner";

const heights: Record<AdPlacement, string> = {
  "in-article": "min(40vh, 280px)",
  bottom: "min(40vh, 250px)",
  "home-banner": "min(40vh, 180px)",
};

export function AdSlot({ placement }: { placement: AdPlacement }) {
  return (
    <aside className={`ad-slot ad-slot--${placement}`} aria-label="Advertisement">
      <span className="ad-slot__label">Advertisement</span>
      <div id={`adsense-${placement}`} className="ad-slot__content" style={{ minHeight: heights[placement] }} />
    </aside>
  );
}

export type { AdPlacement };
