import Link from "next/link";
import { StaticPage } from "@/components/content/StaticPage";
import { entityMetadata } from "@/lib/seo";

export const metadata = entityMetadata({
  title: "About Syrtag",
  description: "What Syrtag publishes, who operates it, and how to read its source boundary.",
  path: "/about",
  type: "website",
});

export default function AboutPage() {
  return (
    <StaticPage
      title="About Syrtag"
      eyebrow="Trust"
      description="Syrtag is a source-aware navigation site for doctoral research questions."
      lede="When records are published, the graph helps a reader move between those pages. It does not replace a summary, a source list, or a verification date."
    >
      <p>Syrtag supports source-aware exploration and bounded comparison of theory pathways from a research question.</p>
      <p>Syrtag organizes theories, scholars, works, concepts, and research topics as a connected knowledge graph when those records are published. The graph is a navigation surface. Each public page should give enough editorial context to assess a pathway, including the limits of that context.</p>

      <h2>What this site is</h2>
      <p>Syrtag is an educational navigation resource for people comparing research theories. It is not a ghostwriting service, a degree or admissions broker, a journal, or a substitute for supervision. It does not certify qualifications.</p>
      <p>The intended public scope is education and sociology. Other disciplines are not presented as published coverage.</p>

      <h2>Publisher identity</h2>
      <p>Syrtag is an independent research-navigation project.</p>
      <p>Syrtag does not currently identify a registered entity or an individual operator on the public site.</p>
      <p>The slots below are unpublished fill-ins. They are not a legal name, a role, or a jurisdiction, and they must not be cited as one.</p>
      <dl className="owner-slots">
        <div>
          <dt>Legal or operating name</dt>
          <dd><code>TODO_OWNER_LEGAL_NAME</code> — not published.</dd>
        </div>
        <div>
          <dt>Operator role</dt>
          <dd><code>TODO_OWNER_OPERATOR_ROLE</code> — not published.</dd>
        </div>
        <div>
          <dt>Jurisdiction</dt>
          <dd><code>TODO_OWNER_JURISDICTION</code> — not published.</dd>
        </div>
      </dl>

      <h2>Contact</h2>
      <p>No monitored contact channel is published. The public status, and the empty slots reserved for a future channel, are on the <Link href="/corrections">contact and corrections</Link> page.</p>

      <h2>Corrections policy</h2>
      <p>Syrtag does not currently operate a public correction-intake channel. Do not submit personal or sensitive information. A correction route will be published only after a monitored channel and a data-handling process are established. No response or resolution timeframe is currently promised.</p>
      <p>The <Link href="/editorial-policy">editorial policy</Link> states how source-backed claims, editorial synthesis, and material awaiting review are distinguished. A published correction would name the page, the wording that changed, and the source used to check it.</p>

      <h2>Publication boundary</h2>
      <p>A page is public only when its record status is published. Draft records, archived records, and the local development demo graph are not published scholarship. The current authored corpus keeps entity records in draft or archived state, so a database seeded from that corpus has no public entity pages.</p>
      <p>Flagship theory, scholar, work, and topic pages are not currently published. Each substantive claim on those future pages still needs a citable source and a verification date. Those gaps are marked <code>TODO_SOURCE</code> for the operator. They are not articles.</p>

      <h2>Advertising</h2>
      <p>Advertising is off. Syrtag has not enabled advertising technology and does not load an advertising script. While advertising stays off, the site does not publish an ads.txt publisher authorization or a google-adsense-account metadata tag. The <Link href="/privacy">privacy page</Link> is the measurement and advertising boundary.</p>

      <h2>Editorial responsibility</h2>
      <p>Syrtag is responsible for the selection, organization, source presentation, editorial synthesis, and correction of content it publishes. It distinguishes source-backed facts from editorial synthesis and research guidance. Its content is an educational navigation resource, not peer review and not a substitute for primary-source reading, disciplinary supervision, or methodological review.</p>
      <p>Syrtag does not claim a peer-review committee, a university imprint, or a credential it has not published.</p>
    </StaticPage>
  );
}
