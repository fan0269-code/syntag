"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { graphFocusHref } from "@/lib/graph-focus";

type Suggestion = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  href: string;
  focus?: { discipline: string; mode: "genealogy" | "scholars" | "topics"; nodeId: string };
  kind: "theory" | "scholar" | "work" | "topic" | "concept" | "field";
};
type ApiResult = { results: Record<string, Omit<Suggestion, "kind">[]> };
const singularKind: Record<string, Suggestion["kind"]> = {
  theories: "theory",
  scholars: "scholar",
  works: "work",
  topics: "topic",
  concepts: "concept",
  fields: "field",
};

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => {
    const term = query.trim();
    if (!term) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(term)}&limit=5`, { signal: controller.signal });
        if (!response.ok) throw new Error("Search unavailable");
        const data = await response.json() as ApiResult;
        setResults(Object.entries(data.results).flatMap(([kind, entries]) => entries.map((entry) => ({ ...entry, kind: singularKind[kind] }))));
      } catch (error) { if ((error as Error).name !== "AbortError") { setResults([]); setError(true); } }
      finally { setLoading(false); }
    }, 300);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query]);

  const updateQuery = (value: string) => { setQuery(value); if (!value.trim()) { setResults([]); setLoading(false); setError(false); } };

  const focusGraph = (item: Suggestion) => {
    if (item.focus) router.push(graphFocusHref(item.focus));
    setOpen(false);
  };

  const submitSearch = () => {
    const term = query.trim();
    if (!term) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return <div className={`search-box${compact ? " search-box--compact" : ""}`}>
    <button type="button" className="icon-control" aria-label="Open search" aria-expanded={open} onClick={() => setOpen((value) => !value)}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg></button>
    {open && <div className="search-box__overlay" role="dialog" aria-label="Search Syrtag"><div className="search-box__panel"><div className="search-box__input"><input ref={inputRef} value={query} onChange={(event) => updateQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); if (event.key === "Enter") { event.preventDefault(); submitSearch(); } }} placeholder="Search theories, scholars, works, topics, concepts, and fields" /><Link href={`/search?q=${encodeURIComponent(query)}`} onClick={() => setOpen(false)}>View all</Link></div>
      {loading && <p className="search-box__status">Searching knowledge graph…</p>}
      {!loading && error && <p className="search-box__status">Search is temporarily unavailable. Try again shortly.</p>}
      {!loading && !error && query.trim() && !results.length && <p className="search-box__status">No matching published entities found. Try a different keyword.</p>}
      {!!results.length && <ul>{results.map((item) => <li key={`${item.kind}-${item.id}`}><button type="button" onClick={() => focusGraph(item)} disabled={!item.focus}><span>{item.focus ? "Focus graph" : item.kind}</span><strong>{item.title}</strong>{item.summary && <small>{item.summary}</small>}</button><Link href={item.href} onClick={() => setOpen(false)}>Open</Link></li>)}</ul>}
    </div></div>}
  </div>;
}
