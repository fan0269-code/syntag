import Link from "next/link";
import { StaticPage } from "@/components/content/StaticPage";
import { entityMetadata } from "@/lib/seo";

export const metadata = entityMetadata({
  title: "About Syrtag — What we publish and what we don't | Syrtag",
  description: "What Syrtag is for, how published differs from draft or demo, and how source boundaries are read. Operator identity is published only when the owner fills it.",
  path: "/about",
  type: "website",
});

export default function AboutPage() {
  return (
    <StaticPage
      title="About Syrtag"
      eyebrow="Trust"
      description="Syrtag is a source-aware navigation site for doctoral research questions in education and sociology."
      lede="No entity pages are published from the current corpus. An empty catalog means those records are draft or archived. It is not a finding about the research literature."
    >
      <h2>What this site is</h2>
      <p>Syrtag is a source-aware knowledge graph for doctoral research navigation. It connects theories, scholars, works, concepts, and topics so a reader can move from a research question to related pathways, and then to the sources behind each published page. The graph is a navigation surface, not a substitute for reading primary literature or working with a supervisor.</p>
      <h2>Who Syrtag is for</h2>
      <p>Syrtag is for researchers who need a bounded map of theoretical frameworks, especially in education and sociology, before committing to a dissertation framing. It is not a ghostwriting service, a degree or admissions broker, a journal, or a credentialing body.</p>
      <h2>Scope</h2>
      <p>The intended public scope is education and sociology. Other disciplines are not presented as published coverage.</p>

      <h2>Publisher identity</h2>
      <p>Syrtag is an independent research-navigation project.</p>
      <p>Syrtag does not currently identify a registered entity or an individual operator on the public site.</p>
      <p>The fields below are unpublished. They are not a legal name, a role, or a jurisdiction, and they must not be cited as one.</p>
      <dl className="owner-slots">
        <div>
          <dt>Legal or operating name</dt>
          <dd>Not published.</dd>
        </div>
        <div>
          <dt>Operator role</dt>
          <dd>Not published.</dd>
        </div>
        <div>
          <dt>Jurisdiction</dt>
          <dd>Not published.</dd>
        </div>
      </dl>

      <h2>Contact</h2>
      <p>No monitored contact channel is published. The public status, and the empty slots reserved for a future channel, are on the <Link href="/corrections">contact and corrections</Link> page.</p>

      <h2>Corrections policy</h2>
      <p>Syrtag does not currently operate a public correction-intake channel. Do not submit personal or sensitive information. A correction route will be published only after a monitored channel and a data-handling process are established. No response or resolution timeframe is currently promised.</p>
      <p>The <Link href="/editorial-policy">editorial policy</Link> states how source-backed claims, editorial synthesis, and material awaiting review are distinguished. A published correction would name the page, the wording that changed, and the source used to check it.</p>

      <h2>Publication boundary</h2>
      <p>A page is public only when its record status is published. Draft records, archived records, and the local development demo graph are not published scholarship. The entity catalog is empty until records are published. An empty index does not mean the scholarly literature is empty.</p>
      <p>Flagship theory, scholar, work, and topic pages are not published from this change. Each substantive claim on a future page still needs a citable source and a verification date. Source gaps kept for the operator are not articles.</p>

      <h2>Where to go next</h2>
      <p>While the public catalog is empty, the trust pages explain the boundary. Entity indexes list published records only, and they may be empty.</p>
      <p className="site-reading-guide__links">
        <Link href="/">Home</Link>
        <Link href="/editorial-policy">Editorial policy</Link>
        <Link href="/corrections">Contact and corrections</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </p>

      <h2>Editorial responsibility</h2>
      <p>Syrtag is responsible for the selection, organization, source presentation, editorial synthesis, and correction of content it publishes. It distinguishes source-backed facts from editorial synthesis and research guidance. Its content is an educational navigation resource, not peer review and not a substitute for primary-source reading, disciplinary supervision, or methodological review.</p>
      <p>Syrtag does not claim a peer-review committee, a university imprint, or a credential it has not published.</p>
    </StaticPage>
  );
}
