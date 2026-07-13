import { isDatabaseUnavailableError } from "./db.ts";

export const DATA_UNAVAILABLE = Symbol("DATA_UNAVAILABLE");

export async function loadDataPage<T>(load: () => Promise<T>): Promise<T | typeof DATA_UNAVAILABLE> {
  try {
    return await load();
  } catch (error) {
    if (isDatabaseUnavailableError(error)) return DATA_UNAVAILABLE;
    throw error;
  }
}
