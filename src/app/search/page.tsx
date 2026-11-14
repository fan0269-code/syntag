import Link from "next/link";
import { PageFrame } from "@/components/common/PageFrame";
import { TheoryPathway } from "@/components/search/TheoryPathway";
import { isDatabaseUnavailableError } from "@/lib/db";
import { searchEntities } from "@/lib/search";
import { entityMetadata } from "@/lib/seo";

export const metadata = entityMetadata({
  title: "Search published records",
  description: "Search published Syrtag theories, scholars, and works. An empty result means nothing matching is published. This page is not a content index.",
  path: "/search",
  type: "website",
  noindex: true,
});

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

  return (
    <PageFrame adScreen="search">
      <section className="search-page content-layout">
        <header className="entity-page__hero">
          <span>Search</span>
          <h1>{unavailable ? "Search is temporarily unavailable" : query ? `Results for “${query}”` : "Find a published record"}</h1>
          <p>Search published theories, scholars, and works. A result is a published record. The query is not turned into an article. Topics, concepts, disciplines, and fields are not a published catalog.</p>
          <nav className="search-page__recovery-links" aria-label="Published indexes">
            <Link href="/theories">Theories</Link>
            <Link href="/scholars">Scholars</Link>
            <Link href="/works">Works</Link>
          </nav>
          <form action="/search" className="search-page__form">
            <label htmlFor="search-page-query">Search published Syrtag content</label>
            <input id="search-page-query" name="q" defaultValue={query} placeholder="e.g. teacher identity" />
            <button type="submit">Search</button>
          </form>
        </header>
        {!query && (
          <section className="search-page__prompt">
            <h2>Start with a research question</h2>
            <p>Try a theory name, a scholar, or a work title, such as teacher identity or Kingdon. If nothing published matches, the page says so and points to the three indexes.</p>
          </section>
        )}
        {unavailable ? (
          <section className="route-error" role="status">
            <p>Your query is still in the search box. Try again shortly, or open a catalog. This is an availability state, not a published result.</p>
            <p><Link href="/">Return to the homepage</Link> · <Link href="/theories">Theories</Link> · <Link href="/scholars">Scholars</Link> · <Link href="/works">Works</Link></p>
          </section>
        ) : (
          <>
            {query && result && groups.map((group) => {
              const rows = result.results[group.key];
              return rows.length ? (
                <section className="search-group" key={group.key}>
                  <h2>{group.label}</h2>
                  {rows.map((item) => <TheoryPathway key={item.id} intent={group.intent} title={item.title} href={item.href} related={item.summary || undefined} />)}
                </section>
              ) : null;
            })}
            {query && !hasResults && (
              <section className="empty-state">
                <h2>No matching published entities found.</h2>
                <p>Your query “{query}” is still in the search box above. An empty result means no published record matched. It is not a new article and it is not a finding that the literature lacks the subject.</p>
                <ul className="search-page__recovery-links">
                  <li><Link href="/theories">Theories</Link></li>
                  <li><Link href="/scholars">Scholars</Link></li>
                  <li><Link href="/works">Works</Link></li>
                </ul>
              </section>
            )}
          </>
        )}
      </section>
    </PageFrame>
  );
}
