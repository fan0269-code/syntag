import { PageFrame } from "@/components/common/PageFrame";
import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { TheoryPathway } from "@/components/search/TheoryPathway";
import { isDatabaseUnavailableError } from "@/lib/db";
import { searchEntities } from "@/lib/search";
import { entityMetadata } from "@/lib/seo";

export const metadata = entityMetadata({ title: "Search research theory pathways", description: "Search Syntag theories, scholars, works, research topics, concepts, and fields.", path: "/search", type: "website" });
const groups = [
  { key: "theories", label: "Matching theories", intent: "Theory Name" },
  { key: "scholars", label: "Matching scholars", intent: "Scholar Name" },
  { key: "works", label: "Matching works", intent: "Work" },
  { key: "topics", label: "Matching research topics", intent: "Research Topic" },
  { key: "concepts", label: "Matching concepts", intent: "Concept" },
  { key: "fields", label: "Matching fields", intent: "Field" },
] as const;
export default async function SearchPage({ searchParams }: PageProps<"/search">) { const q = (await searchParams).q; const query = typeof q === "string" ? q.trim() : ""; let result: Awaited<ReturnType<typeof searchEntities>> | null = null; let unavailable = false; if (query) { try { result = await searchEntities(query, "all", 5); } catch (error) { if (isDatabaseUnavailableError(error)) unavailable = true; else throw error; } }
  return <PageFrame><section className="search-page content-layout"><header className="entity-page__hero"><span>Search</span><h1>{query ? `Results for “${query}”` : "Find a theory pathway"}</h1><p>Search theories, scholars, works, topics, concepts, and fields, then continue through the connected graph or detail pages.</p><form action="/search"><input name="q" defaultValue={query} placeholder="e.g. teacher identity" /><button type="submit">Search</button></form></header>{unavailable ? <DataUnavailableState description="Search is temporarily unavailable. Your query is still in the search box; try again shortly or return to the knowledge graph." /> : <>{query && result && groups.map((group) => { const rows = result.results[group.key]; return rows.length ? <section className="search-group" key={group.key}><h2>{group.label}</h2>{rows.map((item) => <TheoryPathway key={item.id} intent={group.intent} title={item.title} href={item.href} related={item.summary || undefined} />)}</section> : null; })}{query && (!result || groups.every((group) => !result.results[group.key].length)) && <section className="empty-state"><h2>No matching published entities found.</h2><p>Try a different keyword, a scholar name, or a broader research topic.</p></section>}</>}</section></PageFrame>; }
