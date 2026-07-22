import type { ContentSource } from "../../templates/theory-template.ts";

// 以下三条 ContentSource 来自 docs/research/2026-07-20-life-course-evidence-r2.md §5
// 全部经 Crossref 核验通过，L1

const elder1996HumanLivesChangingSocieties: ContentSource = {
  id: "elder-1996-human-lives-changing-societies",
  citation: "Elder, G. H. (1996). Human lives in changing societies: Life course and developmental insights. In Developmental Science (pp. 31–62). Cambridge University Press.",
  url: "https://doi.org/10.1017/cbo9780511571114.004",
  source_kind: "doi",
  evidence_level: "L1",
  supports: [
    "Glen H. Elder authored the 1996 chapter 'Human Lives in Changing Societies'",
    "Published by Cambridge University Press in Developmental Science, pages 31–62",
    "ISBN 9780521794596 (print); ISBN 9780511571114 (electronic)",
  ],
};

const elder2000LifeCourseTheoryEncyclopedia: ContentSource = {
  id: "elder-2000-life-course-theory-encyclopedia",
  citation: "Elder, G. H. (2000). Life course theory. In Encyclopedia of Psychology, Vol. 5 (pp. 50–52). Oxford University Press.",
  url: "https://doi.org/10.1037/10520-020",
  source_kind: "doi",
  evidence_level: "L1",
  supports: [
    "Glen H. Elder authored the 2000 encyclopedia entry 'Life course theory'",
    "Published by Oxford University Press in Encyclopedia of Psychology Vol. 5, pages 50–52",
  ],
};

const elder1999ChildrenOfTheGreatDepression25th: ContentSource = {
  id: "elder-1999-children-of-the-great-depression-25th",
  citation: "Elder, G. H. (1999). Children of the Great Depression: Social Change in Life Experience (25th Anniversary Ed.). Westview Press / Routledge.",
  url: "https://www.routledge.com/Children-Of-The-Great-Depression-25th-Anniversary-Edition/Elder/p/book/9780813333427",
  source_kind: "publisher",
  evidence_level: "L1",
  supports: [
    "1999 Westview Press 25th Anniversary Edition, 472 pp., includes new Chapter 11",
    "Original publication year 1974; this edition is not the original",
  ],
};

export interface LifeCourseEvidenceR2Batch {
  sources: ContentSource[];
}

export function createLifeCourseEvidenceR2Batch(): LifeCourseEvidenceR2Batch {
  return {
    sources: [
      elder1996HumanLivesChangingSocieties,
      elder2000LifeCourseTheoryEncyclopedia,
      elder1999ChildrenOfTheGreatDepression25th,
    ],
  };
}
