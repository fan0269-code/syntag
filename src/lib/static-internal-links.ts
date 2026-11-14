export type InternalLink = { label: string; href: string; reason: string };

export const STATIC_INTERNAL_LINKS = [
  { label: "About", href: "/about", reason: "Syrtag's purpose and editorial approach" },
] as const satisfies readonly InternalLink[];
