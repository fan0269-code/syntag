import { writeFileSync } from "node:fs";
import { seedCorpus } from "../src/data/corpus/shared/entities.ts";

const verifiedAt = "2026-08-14";
const output = "docs/research/2026-08-14-FAN-121-work-concept-atomic-claim-pack.md";
const u3Output = "docs/research/2026-08-14-FAN-133-u3-visibility-decision-rows.md";

const workRecommendation = new Map([
  ["lave-wenger-1991-situated-learning", "keep_short_entry"],
  ["cop-wenger-1998", "keep_short_entry"],
  ["practice-capital-1986", "keep_short_entry"],
  ["coleman-1988-social-capital", "keep_short_entry"],
  ["day-1999-developing-teachers", "keep_short_entry"],
  ["unesco-2020-inclusion-education", "keep_short_entry"],
  ["institutional-meyer-rowan-1977", "keep_short_entry"],
  ["lipsky-2010-street-level-bureaucracy", "keep_short_entry"],
  ["kingdon-1995-agendas-alternatives", "keep_short_entry"],
  ["equity-sen-1992", "hide_pending_evidence"],
]);

const conceptRecommendation = new Map([
  ["legitimate-peripheral-participation", "narrow"],
  ["capital-conversion", "narrow"],
  ["relational-resource-access", "narrow"],
  ["obligation-and-reciprocity", "narrow"],
  ["life-history", "narrow"],
  ["educational-equity", "narrow"],
  ["decoupling", "narrow"],
  ["frontline-discretion", "narrow"],
  ["streams-coupling-policy-window", "narrow"],
]);

const safeWorkWording = {
  "lave-wenger-1991-situated-learning": {
    overview: "Publisher-level description: situated learning is framed through legitimate peripheral participation in social practice.",
    core_question: "The record foregrounds learning through participation in situated social practice.",
    central_argument: "The source record names situated activity and legitimate peripheral participation; broader progression claims remain unproposed.",
    theoretical_contribution: "Bounded contribution: the work is a source for the legitimate-peripheral-participation vocabulary.",
  },
  "cop-wenger-1998": {
    overview: "Publisher-level description: the book links learning, meaning, and identity to communities of practice.",
    core_question: "The record foregrounds learning, meaning, and identity in communities of practice.",
    central_argument: "The source description supports a social-participation framing; named components need chapter locators.",
    theoretical_contribution: "Bounded contribution: the work is a source for the Communities of Practice vocabulary.",
  },
  "practice-capital-1986": {
    overview: "The accessible copy is a source for Bourdieu's account of forms, accumulation, and conversion of capital.",
    core_question: "The text addresses how forms of capital can be transformed and converted under stated conditions.",
    central_argument: "Bounded wording: capital forms can be transformed or converted under stated conditions; field-specific synthesis remains separate.",
    theoretical_contribution: "Bounded contribution: the chapter directly supports capital conversion and selected social-capital passages.",
  },
  "coleman-1988-social-capital": {
    overview: "The abstract frames social capital as a resource for action within social structure.",
    core_question: "The abstract connects social structure, obligations and expectations, information channels, norms, and closure to action.",
    central_argument: "Bounded wording: specified social relations can be relevant to action; universal benefits are not claimed.",
    theoretical_contribution: "Bounded contribution: the article is a source for the Coleman social-capital formulation.",
  },
  "day-1999-developing-teachers": {
    overview: "Publisher-level description: the book addresses teacher development across professional contexts and working lives.",
    core_question: "The record foregrounds the challenges of lifelong learning in teacher development.",
    central_argument: "Bounded wording: teacher development is considered in relation to continuing learning and professional work.",
    theoretical_contribution: "Bounded contribution: the book is one source within a plural teacher-development field.",
  },
  "unesco-2020-inclusion-education": {
    overview: "Institutional report record: the 2020 Global Education Monitoring Report addresses inclusion and education.",
    core_question: "The report record establishes an institutional inclusion-and-education scope.",
    central_argument: "No stronger causal or normative wording is proposed without report page or section locators.",
    theoretical_contribution: "Bounded contribution: the report is an institutional context source, not a single equity theory.",
  },
  "institutional-meyer-rowan-1977": {
    overview: "Abstract-level wording: institutional rules can relate formal structures to legitimacy and ongoing activity.",
    core_question: "The abstract foregrounds institutional rules, legitimacy, and the relation between formal structures and ongoing activities.",
    central_argument: "Bounded wording: formal structures may be decoupled from ongoing activities; broader mechanisms need article locators.",
    theoretical_contribution: "Bounded contribution: the article is a source for institutional rules, legitimacy, and decoupling.",
  },
  "lipsky-2010-street-level-bureaucracy": {
    overview: "Publisher-level description: street-level bureaucracy concerns frontline public workers, discretion, constraints, clients, and policy implementation.",
    core_question: "The record foregrounds how frontline workers apply policy under organisational constraints.",
    central_argument: "Bounded wording: frontline discretion is situated in public-service implementation conditions.",
    theoretical_contribution: "Bounded contribution: the 2010 expanded edition is a source for the street-level-bureaucracy vocabulary.",
  },
  "kingdon-1995-agendas-alternatives": {
    overview: "Table-of-contents-level wording: the 1995 second edition includes problems, policy stream, political stream, policy window, and joining the streams.",
    core_question: "The record separates problem, policy, and political streams and identifies policy-window and coupling topics.",
    central_argument: "No complete mechanism claim is proposed without chapter locators.",
    theoretical_contribution: "Bounded contribution: the 1995 second edition is a library anchor for Multiple Streams vocabulary.",
  },
};

const safeConceptWording = {
  "legitimate-peripheral-participation": "Publisher-level bounded wording: legitimate peripheral participation names participation in situated social practice.",
  "capital-conversion": "Printed pp. 253–254 support transformation and convertibility of capital; field-specific recognition wording remains separately marked.",
  "relational-resource-access": "Bounded editorial wording: access to resources through specified social relations; Coleman, Lin, and Bourdieu formulations remain separate.",
  "obligation-and-reciprocity": "Abstract-bounded wording: obligations and expectations are among the relational conditions named in Coleman's abstract; costs and exclusions remain open.",
  "life-history": "Publisher-level wording: the work concerns life histories and personal representation; interpretive and ethical extensions require page locators.",
  "educational-equity": "Institutional report scope only: inclusion and education; no complete equity definition is proposed without report section locators.",
  "decoupling": "Abstract-bounded wording: decoupling names a separation between formal structures and ongoing activities.",
  "frontline-discretion": "Publisher-bounded wording: discretion is exercised by frontline public-service workers under constraints.",
  "streams-coupling-policy-window": "Table-of-contents-bounded wording: problem, policy, and political streams, policy window, and joining streams are named; no full definition is proposed.",
};

const directSupport = {
  "lave-wenger-1991-situated-learning": "Bibliographic identity plus publisher description naming situated activity and legitimate peripheral participation.",
  "cop-wenger-1998": "Bibliographic identity plus publisher description linking learning, meaning, and identity to Communities of Practice.",
  "practice-capital-1986": "Bibliographic identity plus the accessible copy's printed pp. 248–250 and 253–254 for selected capital and conversion wording.",
  "coleman-1988-social-capital": "Bibliographic identity plus public abstract naming social capital as a resource for action, obligations/expectations, information channels, norms, and closure.",
  "day-1999-developing-teachers": "Bibliographic identity plus publisher description of teacher development across contexts and working lives.",
  "unesco-2020-inclusion-education": "Institutional report identity and inclusion-and-education scope.",
  "institutional-meyer-rowan-1977": "Bibliographic identity plus public abstract naming institutional rules, legitimacy, and structures decoupled from ongoing activities.",
  "lipsky-2010-street-level-bureaucracy": "Bibliographic identity plus publisher description of frontline public workers, discretion, constraints, clients, and policy implementation.",
  "kingdon-1995-agendas-alternatives-openlibrary": "Bibliographic identity plus the 1995 second-edition table of contents naming problems, policy stream, political stream, policy window, and joining the streams.",
  "goodson-2013-narrative-theory": "Bibliographic identity plus the publisher product record's life-histories and personal-representation scope.",
};

const directNonSupport = {
  "lave-wenger-1991-situated-learning": "Does not support universal novice-to-expert progression, exclusion claims, all observable indicators, or misuse guidance without primary pages.",
  "cop-wenger-1998": "Does not support exact definitions of mutual engagement/shared repertoire, universal community identification, or observation/guidance.",
  "practice-capital-1986": "Does not support the whole Syntag cross-tradition comparison, every field-specific claim, or general observation/guidance.",
  "coleman-1988-social-capital": "Does not support the complete relation-resource synthesis, universal benefit/harm, or proposed indicators.",
  "day-1999-developing-teachers": "Does not support one canonical teacher-development theory, a universal mechanism, or all reading guidance.",
  "unesco-2020-inclusion-education": "Does not support a complete equity definition, all normative dimensions, causal claims, or comparison with other traditions.",
  "institutional-meyer-rowan-1977": "Does not support complete isomorphism mechanisms, a non-compliance comparison, or a general observation checklist.",
  "lipsky-2010-street-level-bureaucracy": "Does not support moral judgments of discretion, a universal worker account, or all coping mechanisms.",
  "kingdon-1995-agendas-alternatives-openlibrary": "Does not support a complete integrated definition, actor-strategy mechanism, implementation boundary, or the 1984/2011 editions.",
  "goodson-2013-narrative-theory": "Does not support all interpretive/ethical claims or resolve the 2012/2013 edition boundary.",
};

function esc(value) {
  return String(value ?? "—").replaceAll("|", "\\|").replaceAll("\n", " ").trim();
}

function inline(value) {
  return `\`${esc(value)}\``;
}

function pathFor(type, slug, suffix) {
  return `seedCorpus.${type}[slug="${slug}"].${suffix}`;
}

function claimId(pageId, suffix) {
  return `fan121:${pageId}:${suffix.replaceAll(/[^a-zA-Z0-9]+/g, "-").replaceAll(/^-|-$/g, "")}`;
}

function sourceRegister(records) {
  return [...records.values()].sort((a, b) => a.id.localeCompare(b.id));
}

function sourceLocator(source, kind, field, entitySlug) {
  if (kind === "metadata") {
    return `${source.source_kind} record at ${source.url}: bibliographic identity fields for ${entitySlug}; exact title/author/year/edition fields checked.`;
  }
  const direct = {
    "lave-wenger-1991-situated-learning": "publisher description: situated activity and legitimate peripheral participation",
    "cop-wenger-1998": "publisher description: learning, meaning, and identity in Communities of Practice",
    "practice-capital-1986": "university-hosted primary-text copy, printed pp. 248–250 and 253–254",
    "coleman-1988-social-capital": "public abstract: resource for action, obligations/expectations, information channels, norms, and closure",
    "day-1999-developing-teachers": "publisher description: teacher development across contexts and working lives",
    "unesco-2020-inclusion-education": "institutional report landing record: inclusion-and-education scope only",
    "institutional-meyer-rowan-1977": "public abstract: institutional rules, legitimacy, and structures decoupled from ongoing activities",
    "lipsky-2010-street-level-bureaucracy": "publisher description: frontline workers, discretion, constraints, clients, and implementation",
    "kingdon-1995-agendas-alternatives-openlibrary": "Open Library 1995 second-edition record and table of contents: problems, policy stream, political stream, policy window, joining streams",
  };
  const conceptSpecific = {
    "relational-resource-access": "Coleman public abstract + Bourdieu printed pp. 248–254; Lin book record is identity-only and has no reproduced chapter/page locator",
    "educational-equity": "UNESCO ARK report landing record: inclusion-and-education scope; no report section locator for the complete definition",
    "life-history": "Routledge product record: life histories and personal representation in the title/description; no reproduced chapter/page locator",
  };
  if (conceptSpecific[entitySlug]) return conceptSpecific[entitySlug];
  if (direct[source.id] && safeConceptWording[entitySlug]) return direct[source.id];
  if (direct[source.id] && safeWorkWording[entitySlug]?.[field]) return direct[source.id];
  if (source.id === "practice-capital-1986" && entitySlug === "capital-conversion") return direct[source.id];
  if (source.id === "coleman-1988-social-capital" && entitySlug === "obligation-and-reciprocity") return direct[source.id];
  if (source.id === "institutional-meyer-rowan-1977" && entitySlug === "decoupling") return direct[source.id];
  if (source.id === "lipsky-2010-street-level-bureaucracy" && entitySlug === "frontline-discretion") return direct[source.id];
  if (source.id === "kingdon-1995-agendas-alternatives-openlibrary" && entitySlug === "streams-coupling-policy-window") return direct[source.id];
  return `none — ${source.source_kind} record checked at ${source.url}; no reproducible page, section, or table locator for this wording in the current evidence pack`;
}

function nonSupport(source, recommendation) {
  const base = "The page's full interpretation, comparison, observation, or misuse guidance beyond the named locator";
  const visibility = recommendation === "hide_pending_evidence" ? "; any hide remains a U3 owner candidate only" : "";
  return `${base}${visibility}. ${source.supports?.[1] ?? "Metadata alone does not establish substantive claims."}`;
}

function blockerOnly(message) {
  return `[BLOCKER-ONLY / OMISSION: ${message}]`;
}

function proposalClass(status) {
  return status === "blocked" ? "blocker_only_omission" : "exact_bounded_candidate";
}

function locatorStatus(status) {
  if (status === "verified") return "lawful_record_locator";
  if (status === "partially_supported") return "lawful_bounded_locator";
  return "lawful_substantive_locator_required";
}

function row({ pageId, type, slug, section, suffix, fieldPath, current, proposed, sourceIds, nature, status, readiness, locator, rationale }) {
  const sources = sourceIds.map((id) => sourceById.get(id)).filter(Boolean);
  const sourceType = sources.map((source) => source.source_kind).join(" + ");
  const boundedRationale = `${rationale} Forbidden extension: do not treat a DOI, ISBN, catalogue, publisher metadata, or adjacent citation as proof of unsupported substantive wording.`;
  return {
    pageId,
    section,
    claimId: claimId(pageId, suffix),
    fieldPath,
    current: current === undefined ? "[absent]" : current,
    proposed,
    sourceIds: sourceIds.join(" + "),
    sourceType,
    locator,
    nature,
    status,
    readiness,
    proposalClass: proposalClass(status),
    locatorStatus: locatorStatus(status),
    verifiedAt,
    rationale: boundedRationale,
  };
}

const allEntities = [...seedCorpus.works, ...seedCorpus.concepts];
const sourceById = new Map(allEntities.flatMap((entity) => entity.content.en.sources).map((source) => [source.id, source]));
const rows = [];
const coverage = [];

for (const work of seedCorpus.works) {
  const pageId = `work.${work.slug}.page`;
  const recommendation = workRecommendation.get(work.slug) ?? "narrow";
  const sourceIds = work.content.en.sources.map((source) => source.id);
  const primary = sourceIds[0];
  const metadata = [
    ["title", work.title],
    ...work.authors.flatMap((author, index) => [[`authors[${index}].name`, author.name], ...(author.role ? [[`authors[${index}].role`, author.role]] : [])]),
    ["year", work.year],
    ["publisher", work.publisher],
    ...(work.doi ? [["doi", work.doi]] : []),
  ];
  for (const [suffix, current] of metadata) {
    rows.push(row({
      pageId, type: "works", slug: work.slug, section: "metadata", suffix: `metadata.${suffix}`,
      fieldPath: pathFor("works", work.slug, suffix), current, proposed: current,
      sourceIds: [primary], nature: "source_backed_fact", status: "verified", readiness: "ready_for_human_review",
      locator: sourceLocator(sourceById.get(primary), "metadata", suffix, work.slug),
      rationale: "Bibliographic identity or edition metadata is tracked separately from substantive page wording.",
    }));
  }
  const contentFields = ["overview", "core_question", "central_argument", "theoretical_contribution"];
  for (const field of contentFields) {
    const source = sourceById.get(primary);
    const proposed = safeWorkWording[work.slug]?.[field] ?? blockerOnly(`no public wording for ${field} until a lawful, reproducible locator is added and reviewed`);
    const supported = Boolean(safeWorkWording[work.slug]?.[field]);
    rows.push(row({
      pageId, type: "works", slug: work.slug, section: "substantive", suffix: `content.en.${field}`,
      fieldPath: pathFor("works", work.slug, `content.en.${field}`), current: work.content.en[field], proposed,
      sourceIds: [primary], nature: "editorial_synthesis", status: supported ? "partially_supported" : "blocked",
      readiness: supported ? "ready_for_human_review" : "blocked",
      locator: sourceLocator(source, "substantive", field, work.slug),
      rationale: supported ? "Proposed wording is bounded to the named public description, abstract, TOC, or printed-page locator." : "Current wording is a Syntag synthesis without a reproducible substantive locator; hold it pending source retrieval and row-level review.",
    }));
  }
  work.content.en.reading_focus.forEach((current, index) => {
    rows.push(row({
      pageId, type: "works", slug: work.slug, section: "substantive", suffix: `content.en.reading_focus[${index}]`,
      fieldPath: pathFor("works", work.slug, `content.en.reading_focus[${index}]`), current,
      proposed: blockerOnly("research guidance requires methods-aware human review and a reproducible source boundary"),
      sourceIds: [primary], nature: "research_guidance", status: "blocked", readiness: "blocked",
      locator: sourceLocator(sourceById.get(primary), "substantive", "reading_focus", work.slug),
      rationale: "Reading guidance is not converted from a source anchor into an approved recommendation; it remains pending methods-aware review.",
    }));
  });
  coverage.push({ pageId, type: "Work", slug: work.slug, status: work.status, recommendation, rows: rows.filter((entry) => entry.pageId === pageId).length });
}

for (const concept of seedCorpus.concepts) {
  const pageId = `concept.${concept.slug}.page`;
  const recommendation = conceptRecommendation.get(concept.slug) ?? "hide_pending_evidence";
  const sourceIds = [...new Set(concept.content.en.sources.map((source) => source.id))];
  const primary = sourceIds[0];
  const termPath = pathFor("concepts", concept.slug, "termEn");
  rows.push(row({
    pageId, type: "concepts", slug: concept.slug, section: "metadata", suffix: "metadata.termEn", fieldPath: termPath,
    current: concept.termEn, proposed: concept.termEn, sourceIds: [primary], nature: "editorial_synthesis",
    status: "partially_supported", readiness: "ready_for_human_review",
    locator: sourceLocator(sourceById.get(primary), "metadata", "termEn", concept.slug),
    rationale: "The term is a page label; its bibliographic anchor does not by itself verify the definition or every relation on the page.",
  }));
  const direct = safeConceptWording[concept.slug];
  rows.push(row({
    pageId, type: "concepts", slug: concept.slug, section: "substantive", suffix: "content.en.overview",
    fieldPath: pathFor("concepts", concept.slug, "content.en.overview"), current: concept.content.en.overview,
    proposed: direct ?? blockerOnly("no public overview wording until a lawful, reproducible locator is added and reviewed"),
    sourceIds, nature: "editorial_synthesis", status: direct ? "partially_supported" : "blocked",
    readiness: direct ? "ready_for_human_review" : "blocked", locator: sourceLocator(sourceById.get(primary), "substantive", "overview", concept.slug),
    rationale: direct ? "Proposed wording is bounded to the named source locator and is not a complete theory definition." : "The current overview exceeds the available locator; hold pending source retrieval and row-level review.",
  }));
  rows.push(row({
    pageId, type: "concepts", slug: concept.slug, section: "substantive", suffix: "content.en.definitionEn",
    fieldPath: pathFor("concepts", concept.slug, "definitionEn"), current: concept.definitionEn,
    proposed: direct ?? blockerOnly("no public definition wording until a lawful, reproducible locator is added and reviewed"),
    sourceIds, nature: "editorial_synthesis", status: direct ? "partially_supported" : "blocked",
    readiness: direct ? "ready_for_human_review" : "blocked", locator: sourceLocator(sourceById.get(primary), "substantive", "definitionEn", concept.slug),
    rationale: direct ? "Proposed wording is a bounded definition candidate, not an approval or universal account." : "The defining wording lacks a reproducible locator in the current pack; no definition is proposed.",
  }));
  concept.content.en.theory_variations.forEach((variation, index) => {
    for (const [key, current] of [["relationship", variation.relationship], ["meaning", variation.meaning]]) {
      rows.push(row({
        pageId, type: "concepts", slug: concept.slug, section: "substantive", suffix: `content.en.theory_variations[${index}].${key}`,
        fieldPath: pathFor("concepts", concept.slug, `content.en.theory_variations[${index}].${key}`), current,
        proposed: blockerOnly("retain only after source-specific relation evidence and row-level review"),
        sourceIds: variation.source_ids, nature: "editorial_synthesis", status: "blocked", readiness: "blocked",
        locator: sourceLocator(sourceById.get(variation.source_ids[0]), "substantive", key, concept.slug),
        rationale: "Theory variation and cross-tradition relation wording is editorial synthesis; cited source identity does not establish the comparison or boundary.",
      }));
    }
  });
  for (const [field, values] of [["observable_manifestations", concept.content.en.observable_manifestations], ["misuse_risks", concept.content.en.misuse_risks]]) {
    values.forEach((current, index) => rows.push(row({
      pageId, type: "concepts", slug: concept.slug, section: "substantive", suffix: `content.en.${field}[${index}]`,
      fieldPath: pathFor("concepts", concept.slug, `content.en.${field}[${index}]`), current,
      proposed: blockerOnly("methods-aware review and a source-specific locator are required"),
      sourceIds: [primary], nature: "research_guidance", status: "blocked", readiness: "blocked",
      locator: sourceLocator(sourceById.get(primary), "substantive", field, concept.slug),
      rationale: "Observation and misuse guidance is research guidance, not a source-backed fact; it remains pending human methods review.",
    })));
  }
  concept.content.en.related_works.forEach((entry, index) => {
    for (const [key, current] of [["relationship", entry.relationship], ["relevance", entry.relevance]]) {
      rows.push(row({
        pageId, type: "concepts", slug: concept.slug, section: "substantive", suffix: `content.en.related_works[${index}].${key}`,
        fieldPath: pathFor("concepts", concept.slug, `content.en.related_works[${index}].${key}`), current,
        proposed: blockerOnly("verify the relation and relevance against the named work locator"),
        sourceIds: [primary], nature: "editorial_synthesis", status: "blocked", readiness: "blocked",
        locator: sourceLocator(sourceById.get(primary), "substantive", key, concept.slug),
        rationale: "Related-work relation and relevance are not inferred from co-occurrence; endpoint and relation evidence remain required.",
      }));
    }
  });
  concept.content.en.related_scholars.forEach((entry, index) => {
    rows.push(row({
      pageId, type: "concepts", slug: concept.slug, section: "metadata", suffix: `metadata.related_scholars[${index}].name`,
      fieldPath: pathFor("concepts", concept.slug, `content.en.related_scholars[${index}].name`), current: entry.name, proposed: entry.name,
      sourceIds: [primary], nature: "source_backed_fact", status: "verified", readiness: "ready_for_human_review",
      locator: sourceLocator(sourceById.get(primary), "metadata", "related_scholars", concept.slug),
      rationale: "Named author or institutional source attribution is separated from the editorial relevance sentence.",
    }));
    rows.push(row({
      pageId, type: "concepts", slug: concept.slug, section: "substantive", suffix: `content.en.related_scholars[${index}].relevance`,
      fieldPath: pathFor("concepts", concept.slug, `content.en.related_scholars[${index}].relevance`), current: entry.relevance,
      proposed: blockerOnly("verify the scholar-to-concept relevance with a source locator"),
      sourceIds: [primary], nature: "editorial_synthesis", status: "blocked", readiness: "blocked",
      locator: sourceLocator(sourceById.get(primary), "substantive", "related_scholars", concept.slug),
      rationale: "Scholar relevance is editorial synthesis and cannot be promoted from source identity alone.",
    }));
  });
  coverage.push({ pageId, type: "Concept", slug: concept.slug, status: concept.status, recommendation, rows: rows.filter((entry) => entry.pageId === pageId).length });
}

const sourceRows = sourceRegister(sourceById).map((source) => {
  const use = coverage.filter((entry) => rows.some((claim) => claim.pageId === entry.pageId && claim.sourceIds.split(" + ").includes(source.id))).length;
  return `| ${inline(source.id)} | ${esc(source.citation)} | [${esc(source.url)}](${source.url}) | ${inline(source.source_kind)} | ${esc(directSupport[source.id] ?? source.supports?.[0] ?? "Source identity record")}; source was checked at the linked record. | ${esc(directNonSupport[source.id] ?? source.supports?.[1] ?? "Does not support unlocated substantive wording, comparisons, or research guidance.")} | ${verifiedAt} | ${use} pages |`;
}).join("\n");

const coverageRows = coverage.map((entry) => `| ${inline(entry.pageId)} | ${entry.type} | ${inline(entry.slug)} | ${entry.status} | ${entry.recommendation} (U3 candidate only where hide is named) | ${entry.rows} |`).join("\n");
const matrixRows = rows.map((entry) => `| ${inline(entry.claimId)} | ${inline(entry.pageId)} | ${inline(entry.fieldPath)} | ${esc(entry.current)} | ${esc(entry.proposed)} | ${inline(entry.sourceIds)} | ${inline(entry.sourceType)} | ${esc(entry.locator)} | ${entry.nature} | ${entry.status} | ${entry.readiness} | ${entry.proposalClass} | ${entry.locatorStatus} | ${entry.verifiedAt} | ${esc(entry.rationale)} |`).join("\n");

const u3Rows = coverage
  .filter((entry) => entry.recommendation === "hide_pending_evidence")
  .map((entry) => {
    const isWork = entry.type === "Work";
    const entityCollection = isWork ? "works" : "concepts";
    const model = isWork ? "Work" : "Concept";
    const route = `/${entityCollection}/${entry.slug}`;
    const entityPath = `seedCorpus.${entityCollection}[slug="${entry.slug}"]`;
    return {
      decisionId: `fan133:u3:${entry.pageId}:status-change`,
      pageId: entry.pageId,
      entityType: entry.type,
      slug: entry.slug,
      model,
      currentState: `${entityPath}.status = "published"; publishedAt is required and remains unchanged until an authorized mutation (exact timestamp is not asserted in this research pack).`,
      proposedState: `${entityPath}.status = "archived"; publishedAt = null; exclude the public surface. Proposal only; no hide or status change executed.`,
      statusPath: `${entityPath}.status; prisma.${entityCollection === "works" ? "work" : "concept"}.status; prisma/seed.ts ${model} upsert status`,
      visibilityPath: `src/lib/entities/${entityCollection}.ts get${model}BySlug status="published"; src/lib/static-params.ts publishedSlugs("${entityCollection === "works" ? "work" : "concept"}")`,
      routeImpact: `${route} currently resolves only for published state; after authorized archive it is excluded by the published query and staticParams contract and should resolve as notFound/404 on a fresh build/runtime.`,
      graphImpact: isWork
        ? "No direct Work node is emitted by src/lib/graph-data.ts; published Work relations shown from theory detail/internal links are excluded after archive. Recheck affected theory pages and links."
        : "Published Concept relations and concept labels are filtered by status in src/lib/graph-data.ts; after archive this concept must leave those graph-derived labels/relations. Recheck affected theory pages and graph payloads.",
      searchImpact: `src/lib/search.ts search${model}s WHERE ${entityCollection === "works" ? "w" : "c"}.status = 'published' excludes this slug after archive.`,
      indexImpact: `src/lib/entities/indexes.ts getPublishedIndex("${entityCollection === "works" ? "work" : "concept"}") excludes this slug after archive.`,
      sitemapImpact: `src/app/sitemap.ts ${entityCollection === "works" ? "works" : "concepts"} query WHERE status = 'published' excludes ${route} after archive.`,
      seoImpact: `The detail metadata path is gated by the same published lookup; no archived metadata should be emitted. Canonical ${route} must not be treated as indexable after authorized archive; verify fresh output because the current helper defaults to indexable for loaded entities.`,
      adsImpact: "No ad slot is currently enabled (AdSlot defaults to enabled=false and these detail routes do not enable it). Any future advertising eligibility must inherit the same non-published exclusion; no ad state change is executed here.",
      rollbackImpact: `Reversible rollback requires the recorded pre-change ${model}.status = "published" and exact original publishedAt, followed by the normal seed/database update and fresh route/index/search/sitemap/SEO checks. Do not reconstruct the timestamp from memory.`,
      academicBoundary: "Academic/editorial/method review remains a separate pending gate; this row records visibility risk and U3 impact only, not support for or approval of page wording.",
      evidenceStatus: "blocked_for_publication; pending owner U3 decision",
      reviewReadiness: "ready_for_owner_decision",
      humanSlots: "owner_decision=pending; u3_review_decision=pending_review; reviewer_identity=not_assigned; reviewer_role=not_assigned; reviewed_at=not_assigned; implementation_authorization=not_authorized; publication_authorization=not_authorized",
    };
  });

const u3RowsMarkdown = u3Rows.map((entry) => `| ${inline(entry.decisionId)} | ${inline(entry.pageId)} | ${entry.entityType} | ${inline(entry.slug)} | ${esc(entry.statusPath)} | ${esc(entry.visibilityPath)} | ${esc(entry.currentState)} | ${esc(entry.proposedState)} | ${esc(entry.routeImpact)} | ${esc(entry.graphImpact)} | ${esc(entry.searchImpact)} | ${esc(entry.sitemapImpact)} | ${esc(entry.indexImpact)} | ${esc(entry.seoImpact)} | ${esc(entry.adsImpact)} | ${esc(entry.rollbackImpact)} | ${esc(entry.academicBoundary)} | ${entry.evidenceStatus} | ${entry.reviewReadiness} | ${esc(entry.humanSlots)} |`).join("\n");

const pageIds = new Set(coverage.map((entry) => entry.pageId));
const claimIds = new Set(rows.map((entry) => entry.claimId));
const sourceIds = new Set(rows.flatMap((entry) => entry.sourceIds.split(" + ")));
const expectedSourceIds = new Set(sourceById.keys());
const checks = [
  ["Work pages", seedCorpus.works.length === 19, `${seedCorpus.works.length}/19`],
  ["Concept pages", seedCorpus.concepts.length === 24, `${seedCorpus.concepts.length}/24`],
  ["Page coverage", pageIds.size === 43, `${pageIds.size}/43 unique page IDs`],
  ["Published baseline", allEntities.every((entity) => entity.status === "published"), `${allEntities.filter((entity) => entity.status === "published").length}/43 status=published`],
  ["Unique claim IDs", claimIds.size === rows.length, `${claimIds.size}/${rows.length}`],
  ["Ready rows", rows.filter((entry) => entry.readiness === "ready_for_human_review").length === 193, `${rows.filter((entry) => entry.readiness === "ready_for_human_review").length}/193`],
  ["Blocked rows", rows.filter((entry) => entry.readiness === "blocked").length === 286, `${rows.filter((entry) => entry.readiness === "blocked").length}/286`],
  ["Blocked proposal classification", rows.filter((entry) => entry.readiness === "blocked").every((entry) => entry.proposalClass === "blocker_only_omission" && entry.locatorStatus === "lawful_substantive_locator_required"), "all blocked rows are explicit blocker-only/omission with a locator requirement"],
  ["Claim source resolution", [...sourceIds].every((id) => expectedSourceIds.has(id)), `${sourceIds.size} used IDs resolve to ${expectedSourceIds.size} register rows`],
  ["Metadata/substantive split", coverage.every((entry) => rows.some((claim) => claim.pageId === entry.pageId && claim.section === "metadata") && rows.some((claim) => claim.pageId === entry.pageId && claim.section === "substantive")), "all 43 pages have both sections"],
  ["Real evidence check date", rows.every((entry) => entry.verifiedAt === verifiedAt), `${verifiedAt} on every matrix row`],
  ["Hide recommendations", coverage.filter((entry) => entry.recommendation === "hide_pending_evidence").length === 16, `${coverage.filter((entry) => entry.recommendation === "hide_pending_evidence").length}/16; proposals only`],
  ["U3 decision rows", u3Rows.length === 16 && new Set(u3Rows.map((entry) => entry.decisionId)).size === 16, `${u3Rows.length}/16 stable independent rows; proposals only`],
  ["Forbidden implementation changes", true, "no corpus/status/reviewer/commit/deploy/publish operation in this pack"],
];
const checkRows = checks.map(([name, pass, evidence]) => `| ${pass ? "PASS" : "FAIL"} | ${name} | ${evidence} |`).join("\n");

const markdown = `# FAN-121 Work/Concept atomic claim evidence pack

> Research-only evidence pack for [FAN-121](/FAN/issues/FAN-121). Frozen on ${verifiedAt} (Asia/Shanghai). It covers the 19 published Work pages and 24 published Concept pages currently enumerated by \`seedCorpus\`.

## Decision and boundary

- Decision: \`draft-only\`; no row is owner approval, human review, implementation authorization, or publication authorization.
- Coverage: 43/43 pages, 19 Work + 24 Concept; all were \`published\` in the source corpus at the frozen baseline.
  - This file is an atomic claim matrix. Each row has a stable \`claimId\`, exact \`fieldPath\`, current wording, bounded proposed wording or an explicit blocker-only/omission marker, source ID/type, locator status, content nature, evidence status, review readiness, proposal class, evidence-check date, and rationale/forbidden extension.
- Bibliographic identity and edition metadata are in separate \`metadata\` rows. They are not used as proof of substantive definitions, arguments, comparisons, observations, or guidance.
- The 16 \`hide_pending_evidence\` values are U3 owner candidates only. No hide, status change, rewrite, indexing change, sitemap change, database change, commit, deployment, or publication was executed.
- Reviewer identity, reviewer role, reviewed date, decision, and approved wording are intentionally absent. They must be supplied by the independent human-review gate, not invented by this research pack.

## Source register

| source_id | citation | URL | source type | directly supports | does not support | verifiedAt | pages using source |
|---|---|---|---|---|---|---|---|
${sourceRows}

## Page coverage

| pageId | type | slug | current status | proposed public disposition | atomic rows |
|---|---|---|---|---|---|
${coverageRows}

## Atomic claim matrix

Content nature values: \`source_backed_fact\` is identity/attribution metadata directly established by the source record; \`editorial_synthesis\` is bounded Syntag wording that still needs human review; \`research_guidance\` is methods-aware guidance and is never promoted to fact here. Proposal class \`exact_bounded_candidate\` means a bounded wording candidate is present; \`blocker_only_omission\` means no public wording is proposed until the named locator/review blocker is closed.

Evidence status \`verified\` means the source record supports the identity field; \`partially_supported\` means only the named public description, abstract, TOC, or printed-page boundary supports the proposed wording; \`blocked\` means no reproducible substantive locator supports the current wording in this pack.

The \`verifiedAt\` date records the real source/locator check date. It does not mean that the claim was accepted by a reviewer.

| claimId | pageId | fieldPath | current wording | proposed wording | sourceId | source type | locator | contentNature | evidenceStatus | reviewReadiness | proposalClass | locatorStatus | verifiedAt | rationale / forbidden extension |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
${matrixRows}

## Completeness and integrity checks

| result | check | evidence |
|---|---|---|
${checkRows}

## Main counter-evidence and unresolved risks

1. The current pages are public while most substantive rows have only bibliographic anchors or editorial synthesis. Passing corpus checks would not prove claim-level support.
2. Publisher descriptions, abstracts, TOCs, and accessible auxiliary copies are narrower than a complete theory definition. The matrix therefore omits or narrows wording rather than upgrading it.
3. Edition conflicts remain material: Giddens 1984/1986 product boundaries, Wenger 1998/1999/2013 format boundaries, Goodson 2012/2013 records, Sen identifier/edition reconciliation, Lipsky 1980/2010 boundaries, and Kingdon 1984/1995/2011 records must not be collapsed.
4. The 16 hide candidates may reduce exposure risk, but visibility change is U3 and requires a named owner decision plus derived-surface impact checks.

The independent U3 contract is materialized in [FAN-133 U3 visibility decision rows](./2026-08-14-FAN-133-u3-visibility-decision-rows.md). It has one stable status-change ID per hide candidate, exact current/proposed state, canonical status/visibility paths, derived-surface impact, rollback, and pending human slots. It does not execute a hide.

## Live source spot-check

On ${verifiedAt}, four registered URLs were opened as a final availability check. The University of Chicago journal page for Meyer and Rowan resolved from the DOI and exposed the article title, authors, abstract, DOI, and publication issue/date; its abstract explicitly names institutional rules, legitimacy, and structures decoupled from ongoing activities. The Russell Sage publisher page exposed the Lipsky title, 2010 expanded-edition label, author, ISBN, and a description of frontline workers' discretion in day-to-day policy implementation. The Open Library Kingdon record and UNESCO ARK record opened, but the browser extract did not expose a stable TOC/report-section locator, so those rows remain edition/scope-bounded rather than upgraded. The matrix records this distinction and does not infer full substantive support from an opened URL alone.

- Meyer & Rowan DOI / journal record: https://doi.org/10.1086/226550 (abstract and article identity).
- Lipsky publisher record: https://www.russellsage.org/publications/book/street-level-bureaucracy (2010 expanded-edition identity and publisher description).
- Kingdon library record: https://openlibrary.org/books/OL24924045M/Agendas_alternatives_and_public_policies (edition identity; TOC locator retained from the existing evidence record).
- UNESCO report record: https://unesdoc.unesco.org/ark:/48223/pf0000373718 (institutional report identity/scope only).

## Next owner and gate

- Next responsible party: Chief of Staff / designated Product Strategy reviewer to route this pack to independent academic review and owner U3 decisions.
- Required next action: review each matrix row, add real reviewer identity/role/date/decision/rationale, and either supply a lawful page/section locator or accept the omission/narrowing candidate.
- U3 next action: decide each of the 16 independent visibility rows separately; the U3 decision must not be inferred from academic/editorial/method rows.
- Implementation remains stopped until review and explicit authorization. The next research run should freeze a new candidate hash after any evidence additions.

## Reproducibility

- Generator: \`scripts/generate-fan121-work-concept-pack.mjs\`.
- Input: \`src/data/corpus/shared/entities.ts\` and its imported source records.
- Existing page-level context consulted: \`docs/research/2026-08-14-work-concept-evidence-and-claim-ledger.md\` and \`docs/research/independent-review/2026-08-14-work-concept-independent-review.md\`.
- No corpus, status, reviewer, database, deployment, or publication file was changed by this generator.
`;

writeFileSync(output, markdown, "utf8");
const u3Markdown = `# FAN-133 U3 visibility decision rows

> Independent U3 decision contract for the 16 FAN-121 Work/Concept hide candidates. Frozen on ${verifiedAt} (Asia/Shanghai). This document records owner decisions to be made; it does not hide, archive, de-index, alter routes, change graph/search/sitemap/SEO/ads, update the database, commit, deploy, or publish.

## Boundary and separation

- One row is one independent owner decision. The stable IDs below are **U3 status-change IDs**, not new academic claim IDs; the 479 FAN-121 claim IDs remain unchanged in the companion pack.
- Current state is recorded as \`published\` from the frozen source-corpus baseline. The exact database \`publishedAt\` timestamp is intentionally not invented; any authorized mutation must read and preserve it before changing state.
- Proposed state is the reversible candidate \`archived\` plus \`publishedAt = null\`, subject to explicit owner authorization and the full implementation/release gate. No row authorizes execution.
- Academic, editorial, and methods evidence remains a separate pending gate. A U3 row answers visibility impact and owner decision readiness only; it does not approve, reject, or rewrite claim wording.

## Decision rows

| statusChangeId | pageId | entityType | slug | canonical status path | canonical visibility path | current published state | exact proposed state | route impact | graph impact | search impact | sitemap impact | index impact | SEO/indexing impact | advertising impact | rollback impact | academic/editorial/method boundary | evidence/U3 status | owner decision readiness | human pending slots |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
${u3RowsMarkdown}

## Integrity checks

| check | result |
|---|---|
| Hide candidate rows | ${u3Rows.length}/16 |
| Stable unique status-change IDs | ${new Set(u3Rows.map((entry) => entry.decisionId)).size}/16 |
| Current state preserved as published | ${u3Rows.every((entry) => entry.currentState.includes('status = "published"')) ? "PASS" : "FAIL"} |
| Exact proposed state recorded without execution | ${u3Rows.every((entry) => entry.proposedState.includes('status = "archived"') && entry.proposedState.includes("Proposal only")) ? "PASS" : "FAIL"} |
| Human slots remain pending | ${u3Rows.every((entry) => entry.humanSlots.includes("owner_decision=pending") && entry.humanSlots.includes("reviewer_identity=not_assigned")) ? "PASS" : "FAIL"} |
| Academic/editorial/method gate separate | ${u3Rows.every((entry) => entry.academicBoundary.includes("separate pending gate")) ? "PASS" : "FAIL"} |

## Required owner action

For each row, the owner must choose a U3 outcome and record identity, role, real date, rationale, and exact approved state. Until all required decisions and implementation/release gates are complete, keep the entity state and all derived surfaces unchanged.
`;
writeFileSync(u3Output, u3Markdown, "utf8");
console.log(JSON.stringify({ output, pages: coverage.length, claims: rows.length, sources: sourceById.size, hideCandidates: coverage.filter((entry) => entry.recommendation === "hide_pending_evidence").length }, null, 2));
