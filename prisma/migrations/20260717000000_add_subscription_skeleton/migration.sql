-- Phase 2/3 subscription and personal research skeleton.
-- Additive only so the previous application snapshot remains compatible.

CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'draft',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "status" TEXT NOT NULL DEFAULT 'active',
    "current_period_end" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "personal_research_projects" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_research_projects_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "personal_project_theories" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "theory_id" TEXT NOT NULL,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_project_theories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");
CREATE INDEX "personal_research_projects_user_id_idx" ON "personal_research_projects"("user_id");
CREATE UNIQUE INDEX "personal_project_theories_project_id_theory_id_key" ON "personal_project_theories"("project_id", "theory_id");
CREATE INDEX "personal_project_theories_theory_id_idx" ON "personal_project_theories"("theory_id");

ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "personal_research_projects" ADD CONSTRAINT "personal_research_projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "personal_project_theories" ADD CONSTRAINT "personal_project_theories_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "personal_research_projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "personal_project_theories" ADD CONSTRAINT "personal_project_theories_theory_id_fkey" FOREIGN KEY ("theory_id") REFERENCES "theories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
