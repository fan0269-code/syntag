import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export type GraphListItem = { name: string; href?: string; description?: string };

export function JsonLdGraph({ items }: { items: GraphListItem[] }) {
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Syntag — Research Theory Knowledge Graph",
    description: "A source-aware knowledge graph for navigating research theories, scholars, and foundational works.",
    url: absoluteUrl("/"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        ...(item.href ? { url: absoluteUrl(item.href) } : {}),
        ...(item.description ? { description: item.description } : {}),
      })),
    },
  }} />;
}
