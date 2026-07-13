-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "disciplines" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_zh" TEXT,
    "description_en" TEXT,
    "description_zh" TEXT,
    "overview_en" TEXT,
    "overview_zh" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "disciplines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fields" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_zh" TEXT,
    "description_en" TEXT,
    "description_zh" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),
    "discipline_id" TEXT NOT NULL,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_zh" TEXT,
    "subtitle_en" TEXT,
    "subtitle_zh" TEXT,
    "summary_en" TEXT,
    "summary_zh" TEXT,
    "content_jsonb" JSONB NOT NULL DEFAULT '{}',
    "depth" TEXT NOT NULL DEFAULT 'D1',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "theories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theory_genealogy" (
    "id" TEXT NOT NULL,
    "source_theory_id" TEXT NOT NULL,
    "target_theory_id" TEXT NOT NULL,
    "relation_type" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_zh" TEXT,
    "strength" INTEGER NOT NULL DEFAULT 3,
    "key_scholar_id" TEXT,
    "key_work_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "theory_genealogy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholars" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title_en" TEXT,
    "title_zh" TEXT,
    "bio_en" TEXT,
    "bio_zh" TEXT,
    "content_jsonb" JSONB NOT NULL DEFAULT '{}',
    "photo_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "scholars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholar_scholar" (
    "source_scholar_id" TEXT NOT NULL,
    "target_scholar_id" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "description_en" TEXT,
    "description_zh" TEXT,

    CONSTRAINT "scholar_scholar_pkey" PRIMARY KEY ("source_scholar_id","target_scholar_id")
);

-- CreateTable
CREATE TABLE "works" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_zh" TEXT,
    "authors" JSONB NOT NULL DEFAULT '[]',
    "year" INTEGER,
    "publisher" TEXT,
    "doi" TEXT,
    "isbn" TEXT,
    "content_jsonb" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "works_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concepts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "term_en" TEXT NOT NULL,
    "term_zh" TEXT,
    "definition_en" TEXT,
    "definition_zh" TEXT,
    "content_jsonb" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "concepts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "question_en" TEXT NOT NULL,
    "question_zh" TEXT,
    "content_jsonb" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frameworks" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_zh" TEXT,
    "description_en" TEXT,
    "description_zh" TEXT,
    "content_jsonb" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "frameworks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discipline_theory" (
    "discipline_id" TEXT NOT NULL,
    "theory_id" TEXT NOT NULL,
    "relevance" TEXT NOT NULL DEFAULT 'primary',

    CONSTRAINT "discipline_theory_pkey" PRIMARY KEY ("discipline_id","theory_id")
);

-- CreateTable
CREATE TABLE "field_theory" (
    "field_id" TEXT NOT NULL,
    "theory_id" TEXT NOT NULL,
    "relevance" TEXT NOT NULL DEFAULT 'primary',

    CONSTRAINT "field_theory_pkey" PRIMARY KEY ("field_id","theory_id")
);

-- CreateTable
CREATE TABLE "theory_scholar" (
    "theory_id" TEXT NOT NULL,
    "scholar_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "theory_scholar_pkey" PRIMARY KEY ("theory_id","scholar_id")
);

-- CreateTable
CREATE TABLE "theory_work" (
    "theory_id" TEXT NOT NULL,
    "work_id" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,

    CONSTRAINT "theory_work_pkey" PRIMARY KEY ("theory_id","work_id")
);

-- CreateTable
CREATE TABLE "theory_concept" (
    "theory_id" TEXT NOT NULL,
    "concept_id" TEXT NOT NULL,
    "importance" TEXT NOT NULL DEFAULT 'core',

    CONSTRAINT "theory_concept_pkey" PRIMARY KEY ("theory_id","concept_id")
);

-- CreateTable
CREATE TABLE "topic_theory" (
    "topic_id" TEXT NOT NULL,
    "theory_id" TEXT NOT NULL,
    "suitability" TEXT NOT NULL,
    "suitability_notes_en" TEXT,
    "suitability_notes_zh" TEXT,
    "risk_notes_en" TEXT,
    "risk_notes_zh" TEXT,
    "recommendation" TEXT,

    CONSTRAINT "topic_theory_pkey" PRIMARY KEY ("topic_id","theory_id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "field_path" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "sources" JSONB NOT NULL DEFAULT '[]',
    "notes" TEXT,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "disciplines_slug_key" ON "disciplines"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "fields_slug_key" ON "fields"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "theories_slug_key" ON "theories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "scholars_slug_key" ON "scholars"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "works_slug_key" ON "works"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "concepts_slug_key" ON "concepts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "topics_slug_key" ON "topics"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "frameworks_slug_key" ON "frameworks"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "verifications_entity_type_entity_id_field_path_key" ON "verifications"("entity_type", "entity_id", "field_path");

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fields_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "disciplines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theory_genealogy" ADD CONSTRAINT "theory_genealogy_source_theory_id_fkey" FOREIGN KEY ("source_theory_id") REFERENCES "theories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theory_genealogy" ADD CONSTRAINT "theory_genealogy_target_theory_id_fkey" FOREIGN KEY ("target_theory_id") REFERENCES "theories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theory_genealogy" ADD CONSTRAINT "theory_genealogy_key_scholar_id_fkey" FOREIGN KEY ("key_scholar_id") REFERENCES "scholars"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theory_genealogy" ADD CONSTRAINT "theory_genealogy_key_work_id_fkey" FOREIGN KEY ("key_work_id") REFERENCES "works"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scholar_scholar" ADD CONSTRAINT "scholar_scholar_source_scholar_id_fkey" FOREIGN KEY ("source_scholar_id") REFERENCES "scholars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scholar_scholar" ADD CONSTRAINT "scholar_scholar_target_scholar_id_fkey" FOREIGN KEY ("target_scholar_id") REFERENCES "scholars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discipline_theory" ADD CONSTRAINT "discipline_theory_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "disciplines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discipline_theory" ADD CONSTRAINT "discipline_theory_theory_id_fkey" FOREIGN KEY ("theory_id") REFERENCES "theories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_theory" ADD CONSTRAINT "field_theory_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_theory" ADD CONSTRAINT "field_theory_theory_id_fkey" FOREIGN KEY ("theory_id") REFERENCES "theories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theory_scholar" ADD CONSTRAINT "theory_scholar_theory_id_fkey" FOREIGN KEY ("theory_id") REFERENCES "theories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theory_scholar" ADD CONSTRAINT "theory_scholar_scholar_id_fkey" FOREIGN KEY ("scholar_id") REFERENCES "scholars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theory_work" ADD CONSTRAINT "theory_work_theory_id_fkey" FOREIGN KEY ("theory_id") REFERENCES "theories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theory_work" ADD CONSTRAINT "theory_work_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theory_concept" ADD CONSTRAINT "theory_concept_theory_id_fkey" FOREIGN KEY ("theory_id") REFERENCES "theories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theory_concept" ADD CONSTRAINT "theory_concept_concept_id_fkey" FOREIGN KEY ("concept_id") REFERENCES "concepts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_theory" ADD CONSTRAINT "topic_theory_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_theory" ADD CONSTRAINT "topic_theory_theory_id_fkey" FOREIGN KEY ("theory_id") REFERENCES "theories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Full-text search vectors are generated by PostgreSQL so ranking queries use
-- the same weighted document representation that is covered by the GIN index.
ALTER TABLE "theories" ADD COLUMN "search_vector_en" tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce("title_en", '')), 'A') ||
  setweight(to_tsvector('english', coalesce("summary_en", '')), 'B') ||
  setweight(to_tsvector('english', coalesce("content_jsonb"::text, '')), 'C')
) STORED;
CREATE INDEX "theories_search_idx" ON "theories" USING GIN ("search_vector_en");

ALTER TABLE "scholars" ADD COLUMN "search_vector_en" tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce("name", '')), 'A') ||
  setweight(to_tsvector('english', coalesce("title_en", '')), 'A') ||
  setweight(to_tsvector('english', coalesce("bio_en", '')), 'B') ||
  setweight(to_tsvector('english', coalesce("content_jsonb"::text, '')), 'C')
) STORED;
CREATE INDEX "scholars_search_idx" ON "scholars" USING GIN ("search_vector_en");

ALTER TABLE "works" ADD COLUMN "search_vector_en" tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
  setweight(to_tsvector('english', coalesce("content_jsonb"::text, '')), 'C')
) STORED;
CREATE INDEX "works_search_idx" ON "works" USING GIN ("search_vector_en");

ALTER TABLE "topics" ADD COLUMN "search_vector_en" tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce("question_en", '')), 'A') ||
  setweight(to_tsvector('english', coalesce("content_jsonb"::text, '')), 'C')
) STORED;
CREATE INDEX "topics_search_idx" ON "topics" USING GIN ("search_vector_en");
