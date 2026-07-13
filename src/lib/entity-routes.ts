export const ENTITY_INDEXES = [
  { type: "discipline", label: "Disciplines", href: "/disciplines" },
  { type: "field", label: "Fields", href: "/fields" },
  { type: "theory", label: "Theories", href: "/theories" },
  { type: "scholar", label: "Scholars", href: "/scholars" },
  { type: "work", label: "Works", href: "/works" },
  { type: "topic", label: "Topics", href: "/topics" },
  { type: "concept", label: "Concepts", href: "/concepts" },
] as const;

export const INDEX_LIMIT = 50;

export type EntityType = (typeof ENTITY_INDEXES)[number]["type"];

export function isEntityType(value: string): value is EntityType {
  return ENTITY_INDEXES.some((item) => item.type === value);
}

export function entityIndexHref(type: EntityType) {
  return ENTITY_INDEXES.find((item) => item.type === type)!.href;
}

export function entityDetailHref(type: EntityType, slug: string) {
  return `${entityIndexHref(type)}/${slug}`;
}

const legacyEntitySearchRoutes: Record<string, EntityType> = {
  "/search?q=concept": "concept",
  "/search?q=research": "topic",
  "/search?q=scholar": "scholar",
  "/search?q=theory": "theory",
  "/search?q=work": "work",
};

export function canonicalEntityIndexHref(href?: string) {
  return href && legacyEntitySearchRoutes[href]
    ? entityIndexHref(legacyEntitySearchRoutes[href])
    : href;
}
