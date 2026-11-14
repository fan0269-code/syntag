import Link from "next/link";
import { StaticPage } from "@/components/content/StaticPage";
import { getPublishedCatalogCounts } from "@/lib/published-catalog-counts";
import { entityMetadata } from "@/lib/seo";

export const metadata = entityMetadata({
  title: "About Syrtag — What we publish and what we don't | Syrtag",
  description: "Education and sociology only. Published theories, scholars, and works are listed. Four other indexes may be empty. Advertising is off.",
  path: "/about",
  type: "website",
});

export default async function AboutPage() {
  const counts = await getPublishedCatalogCounts();

  return (
    <StaticPage
      title="About Syrtag"
      eyebrow="Trust"
      description="Syrtag is a source-aware navigation site for doctoral research questions in education and sociology."
      lede="Syrtag publishes source-aware records so a reader can move from a research question to a theory, a scholar, or a work, and then to the sources named on that page."
      adScreen="policy"
    >
      <h2>What this site is</h2>
      <p>Syrtag is a source-aware navigation site for doctoral research in education and sociology. Syrtag is not a journal, a writing service, a degree or admissions broker, or a credentialing body. The graph, when a published graph is available, is a way to move between records. It is not a substitute for the cited sources or for a supervisor.</p>

      <h2>Who Syrtag is for</h2>
      <p>Syrtag is for researchers who need a bounded map before committing to a dissertation framing. The public scope is education and sociology only. Psychology, management, and other disciplines are not presented as published coverage.</p>

      <h2>What is published now</h2>
      {counts ? (
        <>
          <p>This render publishes {counts.theories} theories, {counts.scholars} scholars, and {counts.works} works. Those three indexes are the public catalog. Open them for the titles themselves. This page does not treat that count as a quality threshold.</p>
          <p>Topics ({counts.topics}), concepts ({counts.concepts}), disciplines ({counts.disciplines}), and fields ({counts.fields}) are separate indexes. A zero means nothing of that type is published. It does not mean the literature lacks the subject, and it does not turn the index into an article.</p>
        </>
      ) : (
        <>
          <p>This page could not load the publication count. Open the theory, scholar, and work indexes for the records that are published. A missing count is not a claim that the catalog has no entities, and it is not a finding about the research literature.</p>
          <p>Topic, concept, discipline, and field indexes are separate routes. They may be empty. An empty index means nothing of that type is published.</p>
        </>
      )}
      <p className="site-reading-guide__links">
        <Link href="/theories">Theories</Link>
        <Link href="/scholars">Scholars</Link>
        <Link href="/works">Works</Link>
      </p>

      <h2>Publisher identity</h2>
      <p>Syrtag is an independent research-navigation project.</p>
      <p>Syrtag does not currently identify a registered entity or an individual operator on the public site.</p>
      <p>The fields below stay unfinished until the owner fills them. They are not a legal name, a role, or a jurisdiction, and they must not be cited as one.</p>
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
      <p>A page is public only when its record status is published. Draft records, archived records, and the local development demo graph are not published scholarship. An empty index does not mean the scholarly literature is empty. Older slugs that are draft or archived stay unavailable. They are not redirected to a different record.</p>

      <h2>Where to go next</h2>
      <p>Use the three published indexes for the records, and the trust pages for the editorial boundary. Search finds published records. It does not write a new article from the query.</p>
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
