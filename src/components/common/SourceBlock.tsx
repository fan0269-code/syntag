import { VerificationBadge, type VerificationLevel } from "./VerificationBadge";

type Source = { text: string; level: VerificationLevel; url?: string };

export function SourceBlock({ sources }: { sources: Source[] }) {
  return (
    <section className="source-block" aria-labelledby="sources-heading">
      <h2 id="sources-heading">Sources & verification</h2>
      <ul>
        {sources.map((source) => (
          <li key={`${source.text}-${source.level}`}>
            <VerificationBadge level={source.level} />
            {source.url ? <a href={source.url} target="_blank" rel="noreferrer">{source.text}</a> : <span>{source.text}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

export type { Source };
