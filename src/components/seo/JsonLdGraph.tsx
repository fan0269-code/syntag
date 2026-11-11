import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export type GraphListItem = { name: string; href?: string; description?: string };

export function JsonLdGraph({
  items,
  description = "Published education and sociology records, including research works. The graph links those pages and is not itself a scholarly article.",
}: {
  items: GraphListItem[];
  description?: string;
}) {
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Syrtag — Doctoral theory navigation (education & sociology)",
    description,
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
