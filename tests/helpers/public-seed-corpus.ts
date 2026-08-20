import { seedCorpus as contractedSeedCorpus, type SeedCorpus } from "../../src/data/seed-content.ts";
import {
  FAN_247_ARCHIVED_CONCEPT_SLUGS,
  FAN_247_ARCHIVED_DISCIPLINE_SLUGS,
  FAN_247_ARCHIVED_FIELD_SLUGS,
  FAN_247_ARCHIVED_SCHOLAR_SLUGS,
  FAN_247_ARCHIVED_THEORY_SLUGS,
  FAN_247_ARCHIVED_TOPIC_SLUGS,
  FAN_247_ARCHIVED_WORK_SLUGS,
} from "../../src/lib/fan247-visibility.ts";

/**
 * Generic publication-boundary tests need a positive public fixture. The
 * production seed remains the contracted corpus; this fixture restores only
 * FAN-247 targets and never changes the 16 U3 or 7 draft boundaries.
 */
export const seedCorpus: SeedCorpus = structuredClone(contractedSeedCorpus);
const publishedAt = "2026-07-12T00:00:00.000Z";

const restore = <T extends { slug: string; status: "draft" | "published" | "archived"; publishedAt?: string }>(
  records: T[],
  slugs: readonly string[],
) => {
  const targets = new Set(slugs);
  for (const record of records) {
    if (targets.has(record.slug)) {
      record.status = "published";
      record.publishedAt = publishedAt;
    }
  }
};

restore(seedCorpus.disciplines, FAN_247_ARCHIVED_DISCIPLINE_SLUGS);
restore(seedCorpus.fields, FAN_247_ARCHIVED_FIELD_SLUGS);
restore(seedCorpus.theories, FAN_247_ARCHIVED_THEORY_SLUGS);
restore(seedCorpus.works, FAN_247_ARCHIVED_WORK_SLUGS);
restore(seedCorpus.concepts, FAN_247_ARCHIVED_CONCEPT_SLUGS);
restore(seedCorpus.scholars, FAN_247_ARCHIVED_SCHOLAR_SLUGS);
restore(seedCorpus.topics, FAN_247_ARCHIVED_TOPIC_SLUGS);
