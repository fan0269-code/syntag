import { StaticPage } from "@/components/content/StaticPage";
import { entityMetadata } from "@/lib/seo";

export const metadata = entityMetadata({ title: "About Syrtag", description: "A source-aware knowledge graph for bounded exploration and comparison of research theories.", path: "/about", type: "website" });

export default function AboutPage() {
  return (
    <StaticPage title="About Syrtag">
      <p>Syrtag supports source-aware exploration and bounded comparison of theory pathways from a research question.</p>
      <p>We organize theories, scholars, works, concepts, and research topics as one connected knowledge graph. The graph is a navigation surface; each linked page provides the editorial context needed to assess a theory responsibly.</p>
      <h2>Publisher identity</h2>
      <p>Syrtag is an independent research-navigation project.</p>
      <p>Syrtag does not currently identify a registered entity or an individual operator on the public site.</p>
      <h2>Editorial responsibility</h2>
      <p>Syrtag is responsible for the selection, organization, source presentation, editorial synthesis, and correction of content it publishes. It distinguishes source-backed facts from editorial synthesis and research guidance. Its content is an educational navigation resource, not peer review and not a substitute for primary-source reading, disciplinary supervision, or methodological review.</p>
    </StaticPage>
  );
}
