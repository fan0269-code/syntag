"use client";

import { AdSlot, type AdPlacement } from "./AdSlot";
import type { AdScreenKind } from "@/lib/ad-screen";

export function ClientAdSlot({
  placement,
  enabled = false,
  screen,
}: {
  placement: AdPlacement;
  enabled?: boolean;
  screen?: AdScreenKind;
}) {
  return <AdSlot placement={placement} enabled={enabled} screen={screen} />;
}
