import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export function JsonLdBook({ name, path, authors, isbn, publisher }: { name: string; path: string; authors: string[]; isbn?: string | null; publisher?: string | null }) {
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "Book",
    name,
    url: absoluteUrl(path),
    ...(authors.length ? { author: authors.map((author) => ({ "@type": "Person", name: author })) } : {}),
    ...(isbn ? { isbn } : {}),
    ...(publisher ? { publisher: { "@type": "Organization", name: publisher } } : {}),
  }} />;
}
