import Link from "next/link";
import { StaticPage } from "@/components/content/StaticPage";
import { entityMetadata } from "@/lib/seo";

export const metadata = entityMetadata({ title: "Editorial policy", description: "How Syrtag researches, verifies, and updates theory content.", path: "/editorial-policy", type: "website" });

export default function EditorialPolicyPage() {
  return (
    <StaticPage title="Editorial policy">
      <h2>Responsibility</h2>
      <p>Syrtag is an independent research-navigation project.</p>
      <p>Syrtag is responsible for the selection, organization, source presentation, editorial synthesis, and correction of content it publishes. It distinguishes source-backed facts from editorial synthesis and research guidance. Its content is an educational navigation resource, not peer review and not a substitute for primary-source reading, disciplinary supervision, or methodological review.</p>
      <h2>Sources and review status</h2>
      <p>Syrtag distinguishes listed sources, editorial synthesis, research guidance, and material awaiting review. A source list does not mean that every claim on a page has completed claim-level review.</p>
      <p>Where evidence is incomplete, content should be presented with a limited review status rather than as a settled academic conclusion.</p>
      <h2>Current editorial capacity</h2>
      <p>Syrtag does not claim to operate a peer-review committee, a fixed review cycle, or a public correction form. Those processes will be described only if they are established.</p>
      <p>Syrtag does not currently operate a public correction-intake channel. Do not submit personal or sensitive information. A correction route will be published only after a monitored channel and data-handling process are established.</p>
      <p>No response or resolution timeframe is currently promised. Read the current <Link href="/corrections">contact and corrections status</Link>.</p>
      <h2>Scope</h2>
      <p>Syrtag is an educational navigation resource, not a substitute for disciplinary supervision, primary-source reading, or a methodological review.</p>
    </StaticPage>
  );
}
