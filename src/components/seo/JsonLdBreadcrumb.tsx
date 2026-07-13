import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export type JsonLdBreadcrumbItem = { label: string; href?: string };

export function JsonLdBreadcrumb({ items }: { items: JsonLdBreadcrumbItem[] }) {
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  }} />;
}
