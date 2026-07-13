export const GRAPH_MODES = ["genealogy", "scholars", "topics"] as const;
export type GraphMode = (typeof GRAPH_MODES)[number];

export const SEARCH_TYPES = ["all", "theory", "scholar", "work", "topic", "concept", "field"] as const;
export type SearchType = (typeof SEARCH_TYPES)[number];

export type ApiErrorCode =
  | "NOT_FOUND"
  | "INVALID_PARAM"
  | "DATABASE_ERROR"
  | "INTERNAL_ERROR";

export function apiError(code: ApiErrorCode, message: string, status: number) {
  return Response.json({ error: { code, message } }, { status, headers: { "Cache-Control": "no-store" } });
}

export function parseMode(value: string | null): GraphMode | null {
  if (value === null) return "genealogy";
  return GRAPH_MODES.includes(value as GraphMode) ? (value as GraphMode) : null;
}

export function parseSearchType(value: string | null): SearchType | null {
  if (value === null) return "all";
  return SEARCH_TYPES.includes(value as SearchType) ? (value as SearchType) : null;
}

export function parseLimit(value: string | null, defaultValue = 10, maximum = 50) {
  if (value === null) return defaultValue;
  if (!/^\d+$/.test(value)) return null;

  const parsed = Number(value);
  if (parsed < 1) return null;
  return Math.min(parsed, maximum);
}
