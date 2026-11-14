"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AdScreenKind } from "@/lib/ad-screen";

const AdScreenContext = createContext<AdScreenKind>("unclassified");

export function AdScreenProvider({ screen, children }: { screen: AdScreenKind; children: ReactNode }) {
  return <AdScreenContext.Provider value={screen}>{children}</AdScreenContext.Provider>;
}

export function useAdScreen(): AdScreenKind {
  return useContext(AdScreenContext);
}
