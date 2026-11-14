import Link from "next/link";
import { ClientAdSlot } from "@/components/common/ClientAdSlot";
import type { AdScreenKind } from "@/lib/ad-screen";

export function ProseSection({ title, children, id }: { title: string; children: string; id?: string }) {
  return <section className="prose-section" id={id}><h2>{title}</h2>{children.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph.replace(/^#+\s*/, "")}</p>)}</section>;
}

export function RelatedLinks({ heading, links }: { heading: string; links: Array<{ label: string; href: string; description?: string | null }> }) {
  if (!links.length) return null;
  return <section className="related-links"><h2>{heading}</h2><div>{links.map((item) => <Link href={item.href} key={item.href}><strong>{item.label}</strong>{item.description && <span>{item.description}</span>}</Link>)}</div></section>;
}

export function ContentAd({ placement, screen = "entity" }: { placement: "in-article" | "bottom"; screen?: AdScreenKind }) {
  return <ClientAdSlot placement={placement} screen={screen} />;
}
