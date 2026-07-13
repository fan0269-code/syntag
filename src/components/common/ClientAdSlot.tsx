"use client";

import { useEffect } from "react";
import { AdSlot, type AdPlacement } from "./AdSlot";

export function ClientAdSlot({ placement }: { placement: AdPlacement }) {
  useEffect(() => {
    // Phase 1 intentionally reserves the placement without loading AdSense.
  }, []);
  return <AdSlot placement={placement} />;
}
