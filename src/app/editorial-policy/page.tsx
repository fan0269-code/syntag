import { StaticPage } from "@/components/content/StaticPage";
import { entityMetadata } from "@/lib/seo";

export const metadata = entityMetadata({ title: "Editorial policy", description: "How Syrtag researches, verifies, and updates theory content.", path: "/editorial-policy", type: "website" });

export default function EditorialPolicyPage() {
  return (
    <StaticPage title="Editorial policy">
      <h2>Sources and review status</h2>
      <p>Syrtag distinguishes listed sources, editorial synthesis, research guidance, and material awaiting review. A source list does not mean that every claim on a page has completed claim-level review.</p>
      <p>Where evidence is incomplete, content should be presented with a limited review status rather than as a settled academic conclusion.</p>
      <h2>Current editorial capacity</h2>
      <p>Syrtag does not claim to operate a peer-review committee, a fixed review cycle, or a public correction form. Those processes will be described only if they are established.</p>
      <h2>Scope</h2>
      <p>Syrtag is an educational navigation resource, not a substitute for disciplinary supervision, primary-source reading, or a methodological review.</p>
    </StaticPage>
  );
}
