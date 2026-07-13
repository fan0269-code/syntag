import Link from "next/link";

type RelatedTheory = { slug: string; titleEn: string };

function compactLabel(value: string) {
  return value.length > 22 ? `${value.slice(0, 21)}…` : value;
}

/** A lightweight, crawlable relation map for theory pages. */
export function TheoryGenealogyMap({ theory, related }: { theory: RelatedTheory; related: RelatedTheory[] }) {
  const uniqueRelated = Array.from(new Map(related.map((item) => [item.slug, item])).values()).slice(0, 6);

  if (!uniqueRelated.length) {
    return <p className="genealogy-map__empty">No published theory relationships are available for this entry yet.</p>;
  }

  return (
    <div className="genealogy-map">
      <svg
        viewBox="0 0 560 260"
        role="img"
        aria-label={`Theoretical genealogy for ${theory.titleEn}. A relation map connecting this theory with related published theories.`}
      >
        <defs>
          <marker id="genealogy-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" />
          </marker>
        </defs>
        {uniqueRelated.map((item, index) => {
          const angle = (index / uniqueRelated.length) * Math.PI * 2 - Math.PI / 2;
          const x = 280 + Math.cos(angle) * 190;
          const y = 130 + Math.sin(angle) * 86;
          return <g key={item.slug}>
            <line x1="280" y1="130" x2={x} y2={y} markerEnd="url(#genealogy-arrow)" />
            <Link href={`/theories/${item.slug}`} aria-label={`Read ${item.titleEn}`}>
              <rect x={x - 72} y={y - 22} width="144" height="44" rx="5" />
              <text x={x} y={y + 4} textAnchor="middle">{compactLabel(item.titleEn)}</text>
            </Link>
          </g>;
        })}
        <rect className="genealogy-map__focus" x="198" y="101" width="164" height="58" rx="7" />
        <text className="genealogy-map__focus-label" x="280" y="125" textAnchor="middle">CURRENT THEORY</text>
        <text className="genealogy-map__focus-title" x="280" y="145" textAnchor="middle">{compactLabel(theory.titleEn)}</text>
      </svg>
      <p>Follow a connected theory to compare its intellectual relationship in more detail.</p>
    </div>
  );
}
