#!/usr/bin/env node
// Zotero → Syrtag ContentSource 导出脚本 (R1)
// 用途：从 Zotero 本地 API 拉条目，按 Syrtag ContentSource 合同产出 draft 片段 + source register 行。
// 不落库，不写 seed-content；产物 stdout 输出，人工并入 evidence pack / content-batches。
//
// 用法：
//   node --experimental-strip-types scripts/zotero-export.ts [itemKey]
//   不带 itemKey 时导出库内全部非附件/笔记条目。
//
// 依赖：Zotero 运行中 → Settings → Advanced → 勾选 "Allow other applications..." (本地 API 23119)
//       Better BibTeX 已安装（用于 citationKey 字段）。

const ZOTERO_API = "http://127.0.0.1:23119";

interface ZoteroCreator {
  creatorType?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

interface ZoteroItemData {
  key: string;
  itemType: string;
  title?: string;
  date?: string;
  DOI?: string;
  isbn?: string;
  publicationTitle?: string;
  publisher?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  url?: string;
  abstractNote?: string;
  citationKey?: string;
  creators?: ZoteroCreator[];
  collections?: string[];
}

interface ZoteroItem {
  key: string;
  version: number;
  data: ZoteroItemData;
}

// Syrtag ContentSource 合同字段 (对齐 src/data/corpus/shared/entities.ts)
interface ContentSourceDraft {
  id: string;
  citation: string;
  url: string;
  source_kind: "doi" | "publisher" | "university" | "library" | "journal" | "authoritative_web";
  evidence_level: "L1" | "L2" | "L3";
  supports: string[];
  // 额外元信息，不进合同，供 evidence pack 用
  _zoteroKey: string;
  _bbtCitekey?: string;
  _accessedAt: string;
}

const ACCESS_DATE = "2026-07-20";

function authorsToApa(creators: ZoteroCreator[] = []): string {
  const auths = creators.filter((c) => c.creatorType === "author" || !c.creatorType);
  if (auths.length === 0) return "";
  const fmt = (c: ZoteroCreator) => {
    const last = (c.lastName || c.name || "").trim();
    const first = (c.firstName || "").trim();
    if (first) return `${last}, ${first.split(/\s+/).map((s) => s[0] + ".").join(" ")}`;
    return last;
  };
  if (auths.length === 1) return fmt(auths[0]);
  if (auths.length === 2) return `${fmt(auths[0])}, & ${fmt(auths[1])}`;
  return `${fmt(auths[0])}, ${fmt(auths[1])}, … & ${fmt(auths[auths.length - 1])}`;
}

function yearOf(date?: string): string {
  if (!date) return "";
  const m = date.match(/\d{4}/);
  return m ? m[0] : "";
}

function titleOf(title?: string): string {
  return (title || "").replace(/\s+/g, " ").trim();
}

function inferSourceKind(data: ZoteroItemData): ContentSourceDraft["source_kind"] {
  if (data.DOI) return "doi";
  if (data.itemType === "book" || data.itemType === "bookSection") return data.publisher ? "publisher" : "library";
  if (data.itemType === "journalArticle") return "doi";
  if (data.itemType === "thesis") return "university";
  return "authoritative_web";
}

function urlOf(data: ZoteroItemData): string {
  if (data.DOI) return `https://doi.org/${data.DOI}`;
  if (data.url) return data.url;
  if (data.isbn) return `https://www.google.com/books/edition?q=isbn:${data.isbn}`;
  return "";
}

function toCitation(data: ZoteroItemData): string {
  const authors = authorsToApa(data.creators);
  const year = yearOf(data.date);
  const title = titleOf(data.title);
  if (data.itemType === "journalArticle") {
    const pub = data.publicationTitle || "";
    const vol = data.volume ? `${data.volume}` : "";
    const issue = data.issue ? `(${data.issue})` : "";
    const pages = data.pages ? `, ${data.pages}` : "";
    return `${authors} (${year}). ${title}. ${pub}, ${vol}${issue}${pages}.`.replace(/\s+,/g, ",").replace(/\s+/g, " ").trim();
  }
  if (data.itemType === "book" || data.itemType === "bookSection") {
    const pub = data.publisher ? ` ${data.publisher}.` : "";
    return `${authors} (${year}). ${title}.${pub}`.replace(/\s+/g, " ").trim();
  }
  return `${authors} (${year}). ${title}.`.trim();
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${ZOTERO_API}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${path}`);
  return res.json() as Promise<T>;
}

function toContentSourceDraft(item: ZoteroItem): ContentSourceDraft {
  const data = item.data;
  const firstAuthorSurname = (data.creators?.[0]?.lastName || data.creators?.[0]?.name || "unknown")
    .toLowerCase().replace(/[^a-z0-9]+/g, "");
  const year = yearOf(data.date);
  // 显式把 firstAuthor 塞进 slug 前缀
  const id = `${firstAuthorSurname}-${year}-${(data.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`;

  const supports: string[] = [];
  if (data.creators?.length) {
    supports.push(`${authorsToApa(data.creators)} authored "${titleOf(data.title)}"`);
  }
  if (year) supports.push(`Published in ${year}`);
  if (data.itemType === "journalArticle" && data.publicationTitle) {
    const vol = data.volume ? ` ${data.volume}` : "";
    const issue = data.issue ? `(${data.issue})` : "";
    const pages = data.pages ? `, ${data.pages}` : "";
    supports.push(`In ${data.publicationTitle}${vol}${issue}${pages}`);
  }
  if (data.DOI) supports.push(`DOI ${data.DOI}`);

  return {
    id,
    citation: toCitation(data),
    url: urlOf(data),
    source_kind: inferSourceKind(data),
    evidence_level: "L1",
    supports,
    _zoteroKey: data.key,
    _bbtCitekey: data.citationKey,
    _accessedAt: ACCESS_DATE,
  };
}

function renderMarkdownRegister(drafts: ContentSourceDraft[]): string {
  const rows = drafts.map((d) =>
    `| \`${d.id}\` | ${d.citation} | ${d.url} | ${d.source_kind} | ${d.supports.map((s) => s.replace(/\|/g, "\\|")).join("; ")} | (see forbidden extensions in claim matrix) | ${d._accessedAt} | | ${d._bbtCitekey || ""} |`
  );
  return `| source ID | citation | URL | source type | directly supports | does not support | accessed date | bbt citekey |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n${rows.join("\n")}`;
}

function contentSourceVarName(id: string): string {
  // elder-1998-the-life-course-as-developmental-theory → elder1998LifeCourseAsDevelopmentalTheory
  const parts = id.split("-");
  const [author, year, ...words] = parts;
  const cap = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
  return `${author}${year}${cap}`;
}

function renderTsSnippet(d: ContentSourceDraft): string {
  const supportsJson = JSON.stringify(d.supports, null, 2);
  return `const ${contentSourceVarName(d.id)}: ContentSource = {
  id: "${d.id}",
  citation: ${JSON.stringify(d.citation)},
  url: "${d.url}",
  source_kind: "${d.source_kind}",
  evidence_level: "${d.evidence_level}",
  supports: ${supportsJson.replace(/\n/g, "\n  ")},
};`;
}

async function main() {
  const argKey = process.argv[2];
  const path = argKey
    ? `/api/users/0/items/${argKey}?format=json`
    : `/api/users/0/items?limit=100&format=json&itemType=-attachment%20-note`;
  const items = await fetchJson<ZoteroItem | ZoteroItem[]>(path);
  const arr = Array.isArray(items) ? items : [items];

  if (arr.length === 0) {
    console.error("Zotero 库内无条目。先在 Zotero 用 DOI/网页抓取录入文献。");
    process.exitCode = 1;
    return;
  }

  const drafts = arr.map(toContentSourceDraft);

  console.log("=== Source register (markdown) ===\n");
  console.log(renderMarkdownRegister(drafts));
  console.log("\n\n=== ContentSource snippets (TypeScript, DRAFT — 不落库) ===\n");
  for (const d of drafts) {
    console.log(renderTsSnippet(d));
    console.log("");
  }
  console.log("=== Zotero ↔ Syrtag 映射 ===");
  for (const d of drafts) {
    console.log(`  Zotero key ${d._zoteroKey} | BBT citekey ${d._bbtCitekey} → Syrtag ContentSource.id "${d.id}"`);
  }
}

main().catch((e) => {
  console.error("导出失败：", e.message);
  console.error("确认 Zotero 运行中且 Settings → Advanced → “Allow other applications...” 已勾选。");
  process.exitCode = 1;
});
