"use client";

import { AdSlot, type AdPlacement } from "./AdSlot";

export function ClientAdSlot({ placement, enabled = false }: { placement: AdPlacement; enabled?: boolean }) {
  return <AdSlot placement={placement} enabled={enabled} />;
}
