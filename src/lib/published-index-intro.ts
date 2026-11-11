export type PublishedIndexKind = "theories" | "scholars" | "works";

/**
 * Names only the records the published-index query returned.
 * An empty result keeps the honest empty sentence. It does not preview
 * corpus rows that have not been imported.
 */
export function publishedIndexIntro(
  kind: PublishedIndexKind,
  items: ReadonlyArray<{ title: string }>,
  emptyFallback: string,
): string {
  const titles = items.map((item) => item.title.trim()).filter(Boolean);
  if (titles.length === 0) return emptyFallback;
  const noun = kind === "theories" ? "theory" : kind === "scholars" ? "scholar" : "work";
  const label = titles.length === 1 ? noun : kind;
  return `This index currently lists ${titles.length} published ${label}: ${joinTitles(titles)}. That list is the published set returned for this render. Draft and archived records are omitted.`;
}

function joinTitles(titles: readonly string[]): string {
  if (titles.length === 1) return titles[0];
  if (titles.length === 2) return `${titles[0]} and ${titles[1]}`;
  return `${titles.slice(0, -1).join(", ")}, and ${titles[titles.length - 1]}`;
}
