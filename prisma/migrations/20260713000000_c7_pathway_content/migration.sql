ALTER TABLE "disciplines" ADD COLUMN "content_jsonb" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "fields" ADD COLUMN "content_jsonb" JSONB NOT NULL DEFAULT '{}';
