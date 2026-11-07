import Link from "next/link";

type ReadingMode = "published" | "demo" | "empty" | "unavailable";

const modeCopy: Record<ReadingMode, string> = {
  published: "The graph on this page is drawn from published records. Open a linked page for its summary and sources. The graph is a way to move between those pages. It is not itself a scholarly article.",
  demo: "The graph on this page is local development sample data. It is labeled as a demo and is not published scholarship.",
  empty: "No published graph is available yet. Syrtag only shows records with status published after source-backed human review. An empty catalog means drafts, archived seed, and local demo data are withheld, not that the literature does not exist.",
  unavailable: "The catalog could not be loaded. Please try again shortly. This notice is an availability state. It is not a statement that research has been published or withdrawn.",
};

export function SiteReadingGuide({ mode }: { mode: ReadingMode }) {
  return (
    <section className="static-prose site-reading-guide" aria-labelledby="site-reading-guide-title">
      <h2 id="site-reading-guide-title">How to read Syrtag</h2>
      <p>Syrtag is a source-aware navigation site for doctoral research questions. It is meant to help a reader compare theories, scholars, works, concepts, and topics, then return to the cited sources.</p>
      <p>{modeCopy[mode]}</p>
      <h2>What a public page includes</h2>
      <p>A public entity page should be readable without the graph: a summary, the limits of that summary, and sources a reader can open. A dated claim should carry a verification date. Syrtag does not treat an unsourced paragraph as a published academic conclusion.</p>
      <p>Public routes list only records whose status is published. The current authored corpus keeps entity records in draft or archived state, so a database seeded from that corpus has no public entity pages. Candidate flagship pages stay unpublished until the operator supplies citable sources.</p>
      <h2>Scope</h2>
      <p>The intended public scope is education and sociology. Syrtag does not present psychology, management, or any other discipline as published coverage.</p>
      <h2>Trust and advertising</h2>
      <p>Advertising is off. Syrtag does not load an advertising script, and it does not ask you to click an advertisement. The about, privacy, and contact pages describe the current boundary, including operator details that are still unpublished.</p>
      <p className="site-reading-guide__links">
        <Link href="/about">About</Link>
        <Link href="/editorial-policy">Editorial policy</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/corrections">Contact and corrections</Link>
        <Link href="/pricing">Pricing</Link>
        {(mode === "published" || mode === "demo") && <Link href="/topics">Published topics</Link>}
      </p>
    </section>
  );
}
