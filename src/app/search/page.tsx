import Link from "next/link";
import { PageFrame } from "@/components/common/PageFrame";
import { DataUnavailableState } from "@/components/common/DataUnavailableState";
import { TheoryPathway } from "@/components/search/TheoryPathway";
import { isDatabaseUnavailableError } from "@/lib/db";
import { searchEntities } from "@/lib/search";
import { entityMetadata } from "@/lib/seo";

export const metadata = entityMetadata({ title: "Search research theory pathways", description: "Search Syrtag theories, scholars, works, research topics, concepts, and fields.", path: "/search", type: "website" });

const groups = [
  { key: "theories", label: "Matching theories", intent: "Theory Name" },
  { key: "scholars", label: "Matching scholars", intent: "Scholar Name" },
  { key: "works", label: "Matching works", intent: "Work" },
  { key: "topics", label: "Matching research topics", intent: "Research Topic" },
  { key: "concepts", label: "Matching concepts", intent: "Concept" },
  { key: "fields", label: "Matching fields", intent: "Field" },
] as const;

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const q = (await searchParams).q;
  const query = typeof q === "string" ? q.trim() : "";
  let result: Awaited<ReturnType<typeof searchEntities>> | null = null;
  let unavailable = false;

  if (query) {
    try {
      result = await searchEntities(query, "all", 5);
    } catch (error) {
      if (isDatabaseUnavailableError(error)) unavailable = true;
      else throw error;
    }
  }

  const hasResults = Boolean(result && groups.some((group) => result.results[group.key].length));

  return <PageFrame><section className="search-page content-layout"><header className="entity-page__hero"><span>Search</span><h1>{query ? `Results for “${query}”` : "Find a theory pathway"}</h1><p>Search theories, scholars, works, topics, concepts, and fields, then continue through the connected graph or detail pages.</p><form action="/search" className="search-page__form"><label htmlFor="search-page-query">Search published Syrtag content</label><input id="search-page-query" name="q" defaultValue={query} placeholder="e.g. teacher identity" /><button type="submit">Search</button></form></header>{!query && <section className="search-page__prompt"><h2>Start with a research question</h2><p>Try a theory name, scholar, core concept, work title, or a topic such as teacher identity.</p></section>}{unavailable ? <DataUnavailableState title="Search is temporarily unavailable" description="Your query is still in the search box; try again shortly or return to a browse path below." indexHref="/topics" indexLabel="Browse research topics" /> : <>{query && result && groups.map((group) => { const rows = result.results[group.key]; return rows.length ? <section className="search-group" key={group.key}><h2>{group.label}</h2>{rows.map((item) => <TheoryPathway key={item.id} intent={group.intent} title={item.title} href={item.href} related={item.summary || undefined} />)}</section> : null; })}{query && !hasResults && <section className="empty-state"><h2>No matching published entities found.</h2><p>Your query “{query}” is still in the search box above. Try a broader keyword or use one of these paths.</p><ul className="search-page__recovery-links"><li><Link href="/topics">Browse research topics</Link></li><li><Link href="/theories">Browse theories</Link></li><li><Link href="/#graph">Return to the homepage graph</Link></li></ul></section>}</>}</section></PageFrame>;
}
