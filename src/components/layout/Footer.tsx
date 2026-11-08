import Link from "next/link";
import { STATIC_INTERNAL_LINKS } from "@/lib/static-internal-links";

const explore = [
  { label: "Topics", href: "/topics" },
  { label: "Theories", href: "/theories" },
  ...STATIC_INTERNAL_LINKS,
] as const;

const legal = [
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["Editorial Policy", "/editorial-policy"],
  ["Contact and Corrections", "/corrections"],
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div><strong>Syrtag</strong><p>Source-aware research navigation for education and sociology. Public pages are published records only. Advertising is off.</p></div>
        <nav aria-label="Explore Syrtag"><h2>Quick links</h2>{explore.map(({ label, href }) => <Link href={href} key={href}>{label}</Link>)}</nav>
        <nav aria-label="Legal information"><h2>Legal</h2>{legal.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav>
      </div>
    </footer>
  );
}
