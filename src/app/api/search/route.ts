import { createSearchGet } from "@/lib/api-runtime";
import { searchEntities } from "@/lib/search";

export const GET = createSearchGet(searchEntities);
