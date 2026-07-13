import { apiError, parseLimit, parseMode, parseSearchType, type GraphMode, type SearchType } from "./api.ts";
import { isDatabaseUnavailableError } from "./db.ts";

const graphCacheHeaders = { "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600" };
const searchCacheHeaders = { "Cache-Control": "public, max-age=300, stale-while-revalidate=60" };

type GraphLoader = (discipline: string, mode: GraphMode) => Promise<unknown | null>;
type SearchLoader = (query: string, type: SearchType, limit: number) => Promise<unknown>;
type ApiErrorLogger = (scope: string, error: unknown) => void;

function logUnexpectedApiError(scope: string, error: unknown) {
  const details = typeof error === "object" && error !== null ? error as { name?: unknown; code?: unknown } : undefined;
  console.error(`${scope} API failed`, {
    name: error instanceof Error ? error.name : typeof error,
    code: typeof details?.code === "string" ? details.code : undefined,
  });
}

export function createGraphGet(loadGraph: GraphLoader, logError: ApiErrorLogger = logUnexpectedApiError) {
  return async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const discipline = searchParams.get("discipline")?.trim();
    const mode = parseMode(searchParams.get("mode"));
    if (!discipline) return apiError("INVALID_PARAM", "The discipline parameter is required", 400);
    if (!mode) return apiError("INVALID_PARAM", "mode must be genealogy, scholars, or topics", 400);

    try {
      const graph = await loadGraph(discipline, mode);
      if (!graph) return apiError("NOT_FOUND", `Discipline '${discipline}' not found`, 404);
      return Response.json(graph, { headers: graphCacheHeaders });
    } catch (error) {
      if (isDatabaseUnavailableError(error)) {
        return apiError("DATABASE_ERROR", "Data temporarily unavailable. Try again later.", 503);
      }
      logError("Graph", error);
      return apiError("INTERNAL_ERROR", "Unable to load graph data. Please try again.", 500);
    }
  };
}

export function createSearchGet(search: SearchLoader, logError: ApiErrorLogger = logUnexpectedApiError) {
  return async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();
    const type = parseSearchType(searchParams.get("type"));
    const limit = parseLimit(searchParams.get("limit"));
    if (!query) return apiError("INVALID_PARAM", "The q parameter is required", 400);
    if (!type) return apiError("INVALID_PARAM", "type must be all, theory, scholar, work, topic, concept, or field", 400);
    if (!limit) return apiError("INVALID_PARAM", "limit must be a positive integer", 400);

    try {
      return Response.json(await search(query, type, limit), { headers: searchCacheHeaders });
    } catch (error) {
      if (isDatabaseUnavailableError(error)) {
        return apiError("DATABASE_ERROR", "Data temporarily unavailable. Try again later.", 503);
      }
      logError("Search", error);
      return apiError("INTERNAL_ERROR", "Unable to search published content. Please try again.", 500);
    }
  };
}
