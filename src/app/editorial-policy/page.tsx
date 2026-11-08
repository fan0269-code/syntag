import Link from "next/link";
import { StaticPage } from "@/components/content/StaticPage";
import { entityMetadata } from "@/lib/seo";

export const metadata = entityMetadata({
  title: "Editorial policy — Sources, synthesis, and review status | Syrtag",
  description: "Substantive claims need a source and a verification date. Editorial synthesis is not peer review. Incomplete evidence is labeled limited review.",
  path: "/editorial-policy",
  type: "website",
});

export default function EditorialPolicyPage() {
  return (
    <StaticPage
      title="Editorial policy"
      eyebrow="Trust"
      description="Sources, editorial synthesis, and limited review."
      lede="Syrtag labels what a source supports, what the editor synthesized, and what is still incomplete. It does not claim a peer-review committee."
    >
      <h2>Responsibility</h2>
      <p>Syrtag is an independent research-navigation project.</p>
      <p>Syrtag is responsible for the selection, organization, source presentation, editorial synthesis, and correction of content it publishes. It distinguishes source-backed facts from editorial synthesis and research guidance. Its content is an educational navigation resource, not peer review and not a substitute for primary-source reading, disciplinary supervision, or methodological review.</p>
      <h2>Sources and review status</h2>
      <p>A substantive claim needs a source URL, a source type, and a verification date. Research comes before drafting. Wikidata and general encyclopedias may help discovery, but they must not be the sole support for a substantive claim.</p>
      <p>Editorial synthesis is not a peer-reviewed conclusion. A source list does not mean that every claim on a page has completed claim-level review.</p>
      <p>Where evidence is incomplete, the page carries a limited-review label. Incomplete evidence is not presented as a settled academic conclusion.</p>
      <p>A published summary is a paraphrase with the primary sources it relies on. It is not a verbatim copy of a copyrighted abstract or a paste from an abstract database.</p>
      <h2>Current editorial capacity</h2>
      <p>Syrtag does not claim to operate a peer-review committee, a fixed review cycle, or a public correction form. Those processes will be described only if they are established.</p>
      <p>Syrtag does not currently operate a public correction-intake channel. Do not submit personal or sensitive information. A correction route will be published only after a monitored channel and data-handling process are established.</p>
      <p>No response or resolution timeframe is currently promised. Read the current <Link href="/corrections">contact and corrections status</Link>.</p>
      <h2>Publication</h2>
      <p>Public routes include a record only when its status is published. Draft records, archived records, and the local development demo graph are not published scholarship. A source list on a future page does not by itself make every sentence a settled conclusion. Substantive claims still need a citable source and a verification date before publication. Gaps marked for the operator are not articles.</p>
      <h2>Scope</h2>
      <p>The intended public scope is education and sociology. Syrtag does not present other disciplines as published coverage.</p>
      <p>Syrtag is an educational navigation resource, not a substitute for disciplinary supervision, primary-source reading, or a methodological review. It is not a ghostwriting service, a degree or admissions broker, or a journal.</p>
    </StaticPage>
  );
}
