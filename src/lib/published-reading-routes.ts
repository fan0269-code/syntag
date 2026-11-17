/**
 * Editorial reading routes over the published education and sociology set.
 * These are navigation prompts. They are not new entities, new graph edges,
 * or claims that one theory forbids another.
 */

export type ReadingRoute = {
  slug: string;
  heading: string;
  prompt: string;
};

export const THEORY_READING_ROUTES: readonly ReadingRoute[] = [
  {
    slug: "teacher-professional-identity",
    heading: "Classroom identity",
    prompt: "Start here when the study asks how teachers interpret themselves in their work. The 2004 review names four features in journal pages 122–123, section 6.1. Those features are the authors' summary of studies they read. They are not a validated scale and not a causal experiment.",
  },
  {
    slug: "situated-learning-legitimate-peripheral-participation",
    heading: "Participation and newcomers",
    prompt: "Start here when the materials follow someone moving toward fuller participation in a practice. The visible Cambridge description of the 1991 book supports that focus. If the question is instead an ongoing shared enterprise, also open the 1998 book. The two descriptions are different readings, not a ban on either book.",
  },
  {
    slug: "communities-of-practice-1998",
    heading: "Shared enterprise",
    prompt: "Start here when the unit is an informal community people form while pursuing a shared enterprise over time. That unit is what the visible 1998 Cambridge description states. It does not replace the 1991 account of legitimate peripheral participation.",
  },
  {
    slug: "life-course-perspective",
    heading: "Life trajectory",
    prompt: "Start here when the question is how a life, including a school pathway, sits in historical time. The opened Routledge page dates Children of the Great Depression to 1974 and describes one Oakland cohort of 167 people born in 1920–1921. That cohort is not a law for every later group.",
  },
  {
    slug: "multiple-streams-education-policy",
    heading: "Policy agenda",
    prompt: "Start here when the question is how a subject reaches officials and how a governmental agenda is set. The Pearson catalog lists separate chapters for problems, the policy primeval soup, the political stream, and the policy window. This route does not add education-application findings: the 2010 article was not reread for this revision.",
  },
];

export const SCHOLAR_READING_ROUTES: readonly ReadingRoute[] = [
  {
    slug: "douwe-beijaard",
    heading: "2004 review, first author",
    prompt: "Open this record to attribute the 2004 review, not to assign Douwe Beijaard a personal theory of teacher identity. The TU/e profile titles him Full Professor emeritus. An ORCID employment line is a different record and does not replace that title.",
  },
  {
    slug: "etienne-wenger-flagship",
    heading: "1998 author and 1991 coauthor",
    prompt: "Open this record for the spelling and author role on the 1998 monograph and the 1991 coauthored book. No current appointment is stated. Database rows that use another surname were not checked against each other, so this page does not decide whether they name one person.",
  },
  {
    slug: "glen-h-elder-jr-flagship",
    heading: "Cohort study and life-course research",
    prompt: "Open this record for the UNC appointment and for Children of the Great Depression as a cohort study. The page's own wording calls him a prominent figure in life-course research. That is not a law and not a claim that he alone created the perspective.",
  },
  {
    slug: "jean-lave-flagship",
    heading: "1991 coauthor",
    prompt: "Open this record to keep Jean Lave on the 1991 book. The Berkeley directory and a 2011 lecture page name department wording at different times. They are not treated here as one current-title dispute.",
  },
  {
    slug: "john-w-kingdon-flagship",
    heading: "Agenda-setting book author",
    prompt: "Open this record for the political-science emeritus line on the University of Michigan Press page and for authorship of Agendas, Alternatives, and Public Policies. Education applications belong on the theory page. This page does not supply a full biography.",
  },
];

export const WORK_READING_ROUTES: readonly ReadingRoute[] = [
  {
    slug: "lave-and-wenger-1991-situated-learning",
    heading: "1991 coauthored book",
    prompt: "Read this before assigning the book to one author. The Cambridge description supports situated learning as a social process and legitimate peripheral participation as its central characteristic, then breaks off. It is not a full-book reading and not the 1998 monograph.",
  },
  {
    slug: "wenger-1998-communities-of-practice",
    heading: "1998 sole-authored book",
    prompt: "Use this record to separate the 1998 book from the 1991 book. The visible description supports learning through social practice and an informal community around a shared enterprise. Chapter vocabulary beyond that description was not read.",
  },
  {
    slug: "beijaard-meijer-verloop-2004-reconsidering",
    heading: "2004 review article",
    prompt: "Use this record to check that a citation is the review by Beijaard, Meijer, and Verloop, pages 107–128, with a legal open-access PDF. The four features are argued on the theory page from journal pages 122–123. This page does not treat the article as an experiment.",
  },
  {
    slug: "elder-children-of-the-great-depression",
    heading: "Cohort study, several dated layers",
    prompt: "Use this record to keep 1974, the 1999 anniversary layer, and the 2018 Routledge DOI apart. The first-edition publisher is not verified from an opened title page. The cohort description cannot be generalized into a result for other cohorts.",
  },
  {
    slug: "kingdon-agendas-alternatives-and-public-policies",
    heading: "Edition layers, not a full-book argument",
    prompt: "Use this record to separate 1984, 1995, 2011, and the 2013–2014 Pearson update. The first-edition publisher stays unresolved. The Pearson chapter list is a catalog, not a reading of the 1984 book, and it is not an education-study result.",
  },
];

export function routesForSlugs(routes: readonly ReadingRoute[], slugs: ReadonlySet<string>) {
  return routes.filter((route) => slugs.has(route.slug));
}
