import type { Source } from "@/components/common/SourceBlock";
import type { ConceptContent, WorkContent } from "@/data/templates/knowledge-entity-template";
import type { ScholarContent } from "@/data/templates/scholar-template";
import type { PathwayContent } from "@/data/templates/pathway-template";

type SourceBackedContent = Pick<WorkContent, "sources" | "verification"> | Pick<ConceptContent, "sources" | "verification"> | Pick<ScholarContent, "sources" | "verification"> | Pick<PathwayContent, "sources" | "verification">;

export function sourceItemsForEntity(content: SourceBackedContent): Source[] {
  const sourceById = new Map(content.sources.map((source) => [source.id, source]));
  const items = content.verification.flatMap<Source>((entry): Source[] => {
    if (entry.evidence_level === "L1") {
      const source = sourceById.get(entry.source_id);
      return source ? [{ text: `${entry.claim} — ${source.citation}`, level: "L1_verified" as const, url: source.url }] : [];
    }
    if (entry.evidence_level === "L2") return [{ text: entry.claim, level: "L2_reviewed" as const }];
    return [{ text: entry.claim, level: "L3_pending" as const }];
  });
  const linkedUrls = new Set(items.flatMap((item) => item.url ? [item.url] : []));
  return [
    ...items,
    ...content.sources.filter((source) => !linkedUrls.has(source.url)).map((source) => ({
      text: source.citation,
      level: "L1_verified" as const,
      url: source.url,
    })),
  ];
}
