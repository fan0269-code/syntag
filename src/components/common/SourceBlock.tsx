import { VerificationBadge, type VerificationLevel } from "./VerificationBadge";

type Source = { text: string; level: VerificationLevel; url?: string; type?: string; date?: string };

function safeSourceUrl(url: string | undefined) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? url : "";
  } catch {
    return url.startsWith("/") && !url.startsWith("//") ? url : "";
  }
}

export function SourceBlock({ sources }: { sources: Source[] }) {
  return (
    <section className="source-block" aria-labelledby="sources-heading" data-source-scope="page-source-register">
      <h2 id="sources-heading">Page source register</h2>
      <p className="source-block__intro">These sources are registered for this page and support editorial synthesis. This is not a claim-by-claim verification database.</p>
      <ul>
        {sources.map((source) => {
          const safeUrl = safeSourceUrl(source.url);
          return (
            <li key={`${source.text}-${source.level}-${source.url ?? "no-url"}-${source.type ?? "no-type"}-${source.date ?? "no-date"}`}>
              <VerificationBadge level={source.level} scope="source" />
              <span className="source-block__entry">
                {safeUrl ? <a href={safeUrl} target="_blank" rel="noopener noreferrer">{source.text}</a> : <span>{source.text}</span>}
                <span className="source-block__meta" data-source-type={source.type ?? "not-recorded"} data-source-date={source.date ?? "not-recorded"}>
                  {source.type && <span>Type: {source.type}</span>}
                  {source.date && <span>Date: {source.date}</span>}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export type { Source };
