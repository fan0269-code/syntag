import Link from "next/link";
import { catalogReadingNote, publishedCatalogBoundary } from "@/lib/home-catalog";

type ReadingMode = "published" | "demo" | "empty" | "unavailable" | "catalog";

const modeCopy: Record<ReadingMode, string> = {
  published: "The graph on this page is drawn from published records. Open a linked page for its summary and sources. The graph is a way to move between those pages. It is not itself a scholarly article.",
  demo: "The graph on this page is local development sample data. It is labeled as a demo and is not published scholarship.",
  empty: "This render has no published theory, scholar, or work list and no published graph. That is a data state for this page. It is not a statement that the literature does not exist, and draft or archived records are still not published scholarship.",
  unavailable: "The catalog could not be loaded. Please try again shortly. This notice is an availability state. It is not a statement that research has been published or withdrawn.",
  catalog: catalogReadingNote,
};

export function SiteReadingGuide({ mode }: { mode: ReadingMode }) {
  return (
    <section className="static-prose site-reading-guide" aria-labelledby="site-reading-guide-title">
      <h2 id="site-reading-guide-title">How to read Syrtag</h2>
      <p>Syrtag helps a reader move from a research question to a published theory, and from that theory to the scholar and work records that can be attributed. Concept, topic, discipline, and field indexes are not part of that published catalog.</p>
      <p>{modeCopy[mode]}</p>
      <h2>What a public page includes</h2>
      <p>A public entity page should be readable without the graph: a summary, the limits of that summary, and sources a reader can open. A dated claim should carry a verification date. Syrtag does not treat an unsourced paragraph as a published academic conclusion.</p>
      <p>{publishedCatalogBoundary}</p>
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
        <Link href="/theories">Theories</Link>
        <Link href="/scholars">Scholars</Link>
        <Link href="/works">Works</Link>
      </p>
    </section>
  );
}
