import { Prisma } from "@prisma/client";
import type { GraphMode, SearchType } from "./api";
import { getDb } from "./db";
import { entityDetailHref, type EntityType } from "./entity-routes";

type SearchRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  relevance: number;
  discipline_slug: string | null;
};

type SearchResultKind = Exclude<SearchType, "all">;

export type SearchResult = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  relevance: number;
  nodeId: string;
  href: string;
  focus?: { discipline: string; mode: GraphMode; nodeId: string };
};

function normalize(rows: SearchRow[], kind: SearchResultKind, mode?: GraphMode): SearchResult[] {
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    relevance: Number(row.relevance),
    nodeId: row.id,
    href: entityDetailHref(kind as EntityType, row.slug),
    focus: mode && row.discipline_slug ? { discipline: row.discipline_slug, mode, nodeId: row.id } : undefined,
  }));
}

async function searchTheories(query: string, limit: number) {
  const rows = await getDb().$queryRaw<SearchRow[]>(Prisma.sql`
    SELECT DISTINCT ON (t.id) t.id, t.slug, t.title_en AS title, t.summary_en AS summary,
      ts_rank_cd(t.search_vector_en, websearch_to_tsquery('english', ${query})) AS relevance,
      d.slug AS discipline_slug
    FROM theories t
    LEFT JOIN discipline_theory dt ON dt.theory_id = t.id
    LEFT JOIN disciplines d ON d.id = dt.discipline_id AND d.status = 'published'
    WHERE t.status = 'published' AND t.search_vector_en @@ websearch_to_tsquery('english', ${query})
    ORDER BY t.id, relevance DESC, d.title_en ASC
    LIMIT ${limit}
  `);
  return normalize(rows, "theory", "genealogy");
}

async function searchScholars(query: string, limit: number) {
  const rows = await getDb().$queryRaw<SearchRow[]>(Prisma.sql`
    SELECT DISTINCT ON (s.id) s.id, s.slug, s.name AS title, s.bio_en AS summary,
      ts_rank_cd(s.search_vector_en, websearch_to_tsquery('english', ${query})) AS relevance,
      d.slug AS discipline_slug
    FROM scholars s
    LEFT JOIN theory_scholar ts ON ts.scholar_id = s.id
    LEFT JOIN discipline_theory dt ON dt.theory_id = ts.theory_id
    LEFT JOIN disciplines d ON d.id = dt.discipline_id AND d.status = 'published'
    WHERE s.status = 'published' AND s.search_vector_en @@ websearch_to_tsquery('english', ${query})
    ORDER BY s.id, relevance DESC, d.title_en ASC
    LIMIT ${limit}
  `);
  return normalize(rows, "scholar", "scholars");
}

async function searchWorks(query: string, limit: number) {
  const rows = await getDb().$queryRaw<SearchRow[]>(Prisma.sql`
    SELECT DISTINCT ON (w.id) w.id, w.slug, w.title, NULL::text AS summary,
      ts_rank_cd(w.search_vector_en, websearch_to_tsquery('english', ${query})) AS relevance,
      d.slug AS discipline_slug
    FROM works w
    LEFT JOIN theory_work tw ON tw.work_id = w.id
    LEFT JOIN discipline_theory dt ON dt.theory_id = tw.theory_id
    LEFT JOIN disciplines d ON d.id = dt.discipline_id AND d.status = 'published'
    WHERE w.status = 'published' AND w.search_vector_en @@ websearch_to_tsquery('english', ${query})
    ORDER BY w.id, relevance DESC, d.title_en ASC
    LIMIT ${limit}
  `);
  return normalize(rows, "work");
}

async function searchTopics(query: string, limit: number) {
  const rows = await getDb().$queryRaw<SearchRow[]>(Prisma.sql`
    SELECT DISTINCT ON (tp.id) tp.id, tp.slug, tp.question_en AS title, NULL::text AS summary,
      ts_rank_cd(tp.search_vector_en, websearch_to_tsquery('english', ${query})) AS relevance,
      d.slug AS discipline_slug
    FROM topics tp
    LEFT JOIN topic_theory tt ON tt.topic_id = tp.id
    LEFT JOIN discipline_theory dt ON dt.theory_id = tt.theory_id
    LEFT JOIN disciplines d ON d.id = dt.discipline_id AND d.status = 'published'
    WHERE tp.status = 'published' AND tp.search_vector_en @@ websearch_to_tsquery('english', ${query})
    ORDER BY tp.id, relevance DESC, d.title_en ASC
    LIMIT ${limit}
  `);
  return normalize(rows, "topic", "topics");
}

async function searchConcepts(query: string, limit: number) {
  const rows = await getDb().$queryRaw<SearchRow[]>(Prisma.sql`
    SELECT DISTINCT ON (c.id) c.id, c.slug, c.term_en AS title, c.definition_en AS summary,
      CASE WHEN c.term_en ILIKE ${query} THEN 1 ELSE 0.5 END AS relevance,
      d.slug AS discipline_slug
    FROM concepts c
    LEFT JOIN theory_concept tc ON tc.concept_id = c.id
    LEFT JOIN discipline_theory dt ON dt.theory_id = tc.theory_id
    LEFT JOIN disciplines d ON d.id = dt.discipline_id AND d.status = 'published'
    WHERE c.status = 'published' AND (c.term_en ILIKE ${`%${query}%`} OR c.definition_en ILIKE ${`%${query}%`})
    ORDER BY c.id, relevance DESC, d.title_en ASC
    LIMIT ${limit}
  `);
  return normalize(rows, "concept");
}

async function searchFields(query: string, limit: number) {
  const rows = await getDb().$queryRaw<SearchRow[]>(Prisma.sql`
    SELECT f.id, f.slug, f.title_en AS title, f.description_en AS summary,
      CASE WHEN f.title_en ILIKE ${query} THEN 1 ELSE 0.5 END AS relevance,
      d.slug AS discipline_slug
    FROM fields f
    LEFT JOIN disciplines d ON d.id = f.discipline_id AND d.status = 'published'
    WHERE f.status = 'published' AND (f.title_en ILIKE ${`%${query}%`} OR f.description_en ILIKE ${`%${query}%`})
    ORDER BY relevance DESC, f.title_en ASC
    LIMIT ${limit}
  `);
  return normalize(rows, "field");
}

export async function searchEntities(query: string, type: SearchType, limit: number) {
  const [theories, scholars, works, topics, concepts, fields] = await Promise.all([
    type === "all" || type === "theory" ? searchTheories(query, limit) : [],
    type === "all" || type === "scholar" ? searchScholars(query, limit) : [],
    type === "all" || type === "work" ? searchWorks(query, limit) : [],
    type === "all" || type === "topic" ? searchTopics(query, limit) : [],
    type === "all" || type === "concept" ? searchConcepts(query, limit) : [],
    type === "all" || type === "field" ? searchFields(query, limit) : [],
  ]);

  return {
    query,
    detectedType: type === "all" ? null : type,
    results: { theories, scholars, works, topics, concepts, fields },
    suggestions: [`Try: ${query} theoretical framework`, `Try: ${query} research application`],
  };
}
