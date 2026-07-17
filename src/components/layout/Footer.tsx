import Link from "next/link";
import { ENTITY_INDEXES } from "@/lib/entity-routes";
import { STATIC_INTERNAL_LINKS } from "@/lib/static-internal-links";

const links = [
  ...ENTITY_INDEXES.map(({ label, href }) => [label, href] as const),
  ...STATIC_INTERNAL_LINKS.map(({ label, href }) => [label, href] as const),
];

const legal = [
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["Editorial Policy", "/editorial-policy"],
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div><strong>Syrtag</strong><p>A knowledge graph for research theories and dissertation-ready frameworks.</p></div>
        <div><h2>Quick links</h2>{links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div>
        <div><h2>Legal</h2>{legal.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div>
      </div>
    </footer>
  );
}
