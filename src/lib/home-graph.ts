import { isDatabaseUnavailableError } from "./db.ts";

export type HomeGraphState<T> =
  | { kind: "content"; graph: T }
  | { kind: "demo"; graph: T }
  | { kind: "empty" }
  | { kind: "unavailable" };

export async function resolveHomeGraph<T>(
  loadGraph: () => Promise<T | null>,
  sampleGraph: T,
  allowDemo: boolean,
): Promise<HomeGraphState<T>> {
  try {
    const graph = await loadGraph();
    if (graph) return { kind: "content", graph };
    return allowDemo ? { kind: "demo", graph: sampleGraph } : { kind: "empty" };
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
    return allowDemo ? { kind: "demo", graph: sampleGraph } : { kind: "unavailable" };
  }
}
