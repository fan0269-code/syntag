import type {
  ChapterEntry,
  ContentSource,
  ReadingPathEntry,
  VerificationEntry,
} from "./theory-template.ts";

export interface WorkContent {
  overview: string;
  core_question: string;
  central_argument: string;
  contribution: string;
  associated_theories: string[];
  content_guide: string[];
  key_chapters: ChapterEntry[];
  lawful_access: Array<{
    label: string;
    url: string;
    access_type: "doi" | "publisher" | "library" | "open_access";
  }>;
  reading_path: ReadingPathEntry[];
  sources: ContentSource[];
  verification: VerificationEntry[];
}

export const LIFE_COURSE_DEVELOPMENTAL_THEORY_COMPACT_EXAMPLE: WorkContent = {
  overview:
    "This article presents the life course as a framework for relating individual development to social and historical context.",
  core_question:
    "How can research explain development by relating changing biographies to social and historical context?",
  central_argument:
    "Development is shaped by trajectories, transitions, linked lives, historical time and place, timing, and human agency.",
  contribution:
    "It offers a concise conceptual vocabulary for life-course analysis.",
  associated_theories: ["Life Course Theory"],
  content_guide: [
    "Start with the six principles, then identify which principle answers the study's research question.",
    "Separate the article's conceptual claims from a proposed dissertation design.",
  ],
  key_chapters: [
    {
      chapter: "Article-level guide: conceptual framing and six principles",
      purpose: "Use this article-level guide to trace the framework's principles and their relationship; it is not a chapter title.",
      theory_use: "Use as the conceptual foundation before adding a study-specific analytic design.",
    },
  ],
  lawful_access: [
    {
      label: "DOI landing page",
      url: "https://doi.org/10.1111/j.1467-8624.1998.tb06128.x",
      access_type: "doi",
    },
  ],
  reading_path: [
    {
      order: 1,
      title: "The life course as developmental theory",
      purpose: "Read before applying life-course concepts to a research question.",
      source_id: "elder-1998-life-course",
    },
  ],
  sources: [
    {
      id: "elder-1998-life-course",
      citation:
        "Elder, G. H., Jr. (1998). The life course as developmental theory. Child Development, 69(1), 1-12.",
      url: "https://doi.org/10.1111/j.1467-8624.1998.tb06128.x",
      source_kind: "doi",
      evidence_level: "L1",
      supports: ["Bibliographic details", "Article summary"],
    },
  ],
  verification: [
    {
      claim: "The article was published in Child Development in 1998.",
      evidence_level: "L1",
      source_id: "elder-1998-life-course",
      status: "verified",
    },
  ],
};
