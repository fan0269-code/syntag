import Link from "next/link";

export function TheoryPathway({ intent, title, href, related }: { intent: "Research Topic" | "Theory Name" | "Scholar Name" | "Work" | "Concept" | "Field"; title: string; href: string; related?: string }) {
  return <Link className="theory-pathway" href={href}><span>{intent}</span><div><strong>{title}</strong><i aria-hidden="true">→</i><em>{related || "Explore connected theory pathways"}</em></div></Link>;
}
