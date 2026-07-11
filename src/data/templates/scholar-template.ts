import type {
  ContentSource,
  ReadingPathEntry,
  VerificationEntry,
} from "./theory-template.ts";

export interface ScholarContent {
  overview: string;
  academic_identity: {
    discipline: string;
    role: string;
  };
  contributions: string[];
  associated_theories: string[];
  key_works: string[];
  research_fit: string;
  reading_path: ReadingPathEntry[];
  sources: ContentSource[];
  verification: VerificationEntry[];
}

export const GLEN_ELDER_COMPACT_EXAMPLE: ScholarContent = {
  overview:
    "Glen H. Elder Jr. is a sociologist whose work helped establish modern life-course research.",
  academic_identity: {
    discipline: "Sociology",
    role: "Life-course researcher",
  },
  contributions: [
    "Connected individual development to historical change, social relationships, and age-graded institutions.",
  ],
  associated_theories: ["Life Course Theory"],
  key_works: ["Children of the Great Depression", "The Life Course as Developmental Theory"],
  research_fit:
    "Use Elder's life-course scholarship when a study needs to connect changing biographies to historical time, social relationships, and institutions.",
  reading_path: [
    {
      order: 1,
      title: "The life course as developmental theory",
      purpose: "Start with Elder's concise formulation of the framework.",
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
      supports: ["Author attribution", "Work citation"],
    },
  ],
  verification: [
    {
      claim: "Elder authored the cited 1998 article.",
      evidence_level: "L1",
      source_id: "elder-1998-life-course",
      status: "verified",
    },
  ],
};
