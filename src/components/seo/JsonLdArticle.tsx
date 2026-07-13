import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export function JsonLdArticle({ headline, description, path, datePublished, dateModified }: { headline: string; description: string; path: string; datePublished?: Date | string | null; dateModified?: Date | string | null }) {
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    mainEntityOfPage: absoluteUrl(path),
    author: { "@type": "Organization", name: "Syrtag" },
    publisher: { "@type": "Organization", name: "Syrtag", url: absoluteUrl("/") },
    ...(datePublished ? { datePublished: new Date(datePublished).toISOString() } : {}),
    ...(dateModified ? { dateModified: new Date(dateModified).toISOString() } : {}),
  }} />;
}
