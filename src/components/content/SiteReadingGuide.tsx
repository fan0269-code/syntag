import Link from "next/link";

type ReadingMode = "published" | "demo" | "empty" | "unavailable";

const modeCopy: Record<ReadingMode, string> = {
  published: "The graph on this page is drawn from published records. Open a linked page for its summary and sources. The graph is a way to move between those pages. It is not itself a scholarly article.",
  demo: "The graph on this page is local development sample data. It is labeled as a demo and is not published scholarship.",
  empty: "No published graph is available yet. Syrtag only shows records with status published after source-backed human review. An empty catalog means drafts, archived seed, and local demo data are withheld, not that the literature does not exist.",
  unavailable: "The catalog could not be loaded. Please try again shortly. This notice is an availability state. It is not a statement that research has been published or withdrawn.",
};

export function SiteReadingGuide({ mode }: { mode: ReadingMode }) {
  const compact = mode === "empty" || mode === "unavailable";

  return (
    <section className={`static-prose site-reading-guide${compact ? " site-reading-guide--compact" : ""}`} aria-labelledby="site-reading-guide-title">
      <h2 id="site-reading-guide-title">{compact ? "Read next" : "How to read Syrtag"}</h2>
      {!compact && <p>Syrtag is a source-aware navigation site for doctoral research questions. It is meant to help a reader compare theories, scholars, works, concepts, and topics, then return to the cited sources.</p>}
      <p>{modeCopy[mode]}</p>
      <p>The intended public scope is education and sociology. Advertising is off. Draft, archived, and local demo records are not published scholarship.</p>
      <p className="site-reading-guide__links">
        <Link href="/about">About</Link>
        <Link href="/editorial-policy">Editorial policy</Link>
        {!compact && (
          <>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/corrections">Contact and corrections</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/topics">Published topics</Link>
          </>
        )}
      </p>
    </section>
  );
}
