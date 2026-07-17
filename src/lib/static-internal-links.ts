export type InternalLink = { label: string; href: string; reason: string };

export const STATIC_INTERNAL_LINKS = [
  { label: "Pricing", href: "/pricing", reason: "Plans and feature availability" },
] as const satisfies readonly InternalLink[];
