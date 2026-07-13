import Link from "next/link";

import type { PathwayContent } from "@/data/templates/pathway-template";
import { entityDetailHref } from "@/lib/entity-routes";

const roleLabel = {
  primary: "Primary candidate",
  supporting: "Supporting candidate",
  not_recommended: "Not recommended as primary",
} as const;

export function PathwayContentSections({ content }: { content: PathwayContent }) {
  return <>
    <section className="prose-section"><h2>Core research questions</h2><ul>{content.core_questions.map((question) => <li key={question}>{question}</li>)}</ul></section>
    <section className="prose-section"><h2>Question classification and theory route</h2>{content.question_categories.map((category) => <article key={category.category}><h3>{category.category}</h3><p>{category.description}</p><p><b>Candidate theories</b> {category.theory_slugs.map((slug) => <Link key={slug} href={entityDetailHref("theory", slug)}>{slug.replaceAll("-", " ")}</Link>).reduce<React.ReactNode[]>((items, link, index) => index ? [...items, ", ", link] : [link], [])}</p></article>)}</section>
    <section className="prose-section"><h2>Theory selection path</h2><ol>{content.selection_path.map((step) => <li key={step.step}><b>{step.step}.</b> {step.prompt} {step.routing_rule}</li>)}</ol></section>
    <section className="prose-section theory-comparison"><h2>Theory comparison</h2><div className="responsive-table">{content.theory_pathways.map((pathway) => <article key={pathway.theory_slug}><strong><Link href={entityDetailHref("theory", pathway.theory_slug)}>{pathway.theory_slug.replaceAll("-", " ")}</Link></strong><span><b>Recommendation</b>{roleLabel[pathway.role]}</span><span><b>Explanatory focus</b>{pathway.explanatory_focus}</span><span><b>Analysis unit</b>{pathway.analysis_unit}</span><span><b>Useful materials</b>{pathway.data_materials}</span><span><b>Strength</b>{pathway.strengths}</span><span><b>Boundary</b>{pathway.limitations}</span></article>)}</div></section>
    <section className="prose-section"><h2>Connected entries</h2><ul>{content.entry_points.map((entry) => <li key={`${entry.entity_type}:${entry.slug}`}><Link href={entityDetailHref(entry.entity_type, entry.slug)}>{entry.label}</Link> — {entry.relevance}</li>)}</ul></section>
  </>;
}
