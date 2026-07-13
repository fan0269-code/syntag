import Link from "next/link";

type EntityCardProps = {
  title: string;
  summary: string;
  tags: string[];
  readingTime: string;
  href: string;
};

export function EntityCard({ title, summary, tags, readingTime, href }: EntityCardProps) {
  return (
    <Link href={href} className="entity-card">
      <h3>{title}</h3>
      <p>{summary}</p>
      <div className="entity-card__footer">
        <span className="entity-card__tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</span>
        <time>{readingTime}</time>
      </div>
    </Link>
  );
}
