import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export function JsonLdPerson({ name, description, path, sameAs = [] }: { name: string; description: string; path: string; sameAs?: string[] }) {
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    description,
    url: absoluteUrl(path),
    ...(sameAs.length ? { sameAs } : {}),
  }} />;
}
