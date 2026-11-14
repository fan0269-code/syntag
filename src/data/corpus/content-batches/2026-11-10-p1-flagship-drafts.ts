import type { ContentSource, VerificationEntry } from "../../templates/theory-template.ts";
import type {
  SeedScholar,
  SeedTheory,
  SeedTheoryDiscipline,
  SeedTheoryScholar,
  SeedTheoryWork,
  SeedWork,
} from "../shared/entities.ts";

/**
 * P1 flagship pages for gap-table items #1–#8.
 * Publication gate 2026-11-10 (Asia/Shanghai): 审查员 (Lin Wen Senior Researcher 七岗),
 * conditional pass. These eight rows are published with the life-course wording
 * rewrite and the human-review fields below. Item #9 is not in this batch.
 * These slugs are outside the FAN-247 archive list, so the older archived
 * records stay archived. Publishing these pages is not an advertising application.
 * 2026-11-11 recheck: verification dates move to the day the same URLs were
 * opened again. Companion work and scholar pages, when published, are linked
 * by slug and are not the archived records.
 */
export const P1_FLAGSHIP_DRAFT_VERIFIED_AT = "2026-11-11T00:00:00.000Z";
export const P1_FLAGSHIP_PUBLISHED_AT = "2026-11-10T00:00:00.000Z";

/**
 * Catalog scope only. Education and sociology landing pages stay archived
 * under FAN-247; these links keep the flagship theories inside that scope.
 */
export const P1_FLAGSHIP_DISCIPLINE_THEORIES: SeedTheoryDiscipline[] = [
  { disciplineSlug: "education", theorySlug: "teacher-professional-identity", relevance: "primary" },
  { disciplineSlug: "education", theorySlug: "communities-of-practice-1998", relevance: "primary" },
  { disciplineSlug: "sociology", theorySlug: "communities-of-practice-1998", relevance: "primary" },
  { disciplineSlug: "education", theorySlug: "situated-learning-legitimate-peripheral-participation", relevance: "primary" },
  { disciplineSlug: "sociology", theorySlug: "situated-learning-legitimate-peripheral-participation", relevance: "primary" },
  { disciplineSlug: "education", theorySlug: "life-course-perspective", relevance: "primary" },
  { disciplineSlug: "sociology", theorySlug: "life-course-perspective", relevance: "primary" },
];

export const P1_FLAGSHIP_DRAFT_THEORY_SLUGS = [
  "teacher-professional-identity",
  "communities-of-practice-1998",
  "situated-learning-legitimate-peripheral-participation",
  "life-course-perspective",
] as const;

export const P1_FLAGSHIP_DRAFT_SCHOLAR_SLUGS = [
  "douwe-beijaard",
  "etienne-wenger-flagship",
  "glen-h-elder-jr-flagship",
] as const;

export const P1_FLAGSHIP_DRAFT_WORK_SLUG = "beijaard-meijer-verloop-2004-reconsidering";

const verifiedAt = P1_FLAGSHIP_DRAFT_VERIFIED_AT;

const beijaardDoi: ContentSource = {
  id: "p1-beijaard-meijer-verloop-2004-doi",
  citation: "Beijaard, D., Meijer, P. C., & Verloop, N. (2004). Reconsidering research on teachers' professional identity. Teaching and Teacher Education, 20(2), 107-128.",
  url: "https://doi.org/10.1016/j.tate.2003.07.001",
  source_kind: "doi",
  evidence_level: "L1",
  supports: [
    "DOI for the 2004 journal article",
    "A resolving DOI is not treated as open Elsevier or ScienceDirect full text",
  ],
};

const beijaardCrossref: ContentSource = {
  id: "p1-beijaard-meijer-verloop-2004-crossref",
  citation: "Crossref work record for 10.1016/j.tate.2003.07.001.",
  url: "https://api.crossref.org/works/10.1016/j.tate.2003.07.001",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: [
    "Bibliographic record: authors, journal, volume 20, issue 2, pages 107-128, issued February 2004, publisher Elsevier BV",
    "Metadata layer only; the Crossref record is not used as a substitute for the article argument",
  ],
};

const beijaardLeiden: ContentSource = {
  id: "p1-beijaard-meijer-verloop-2004-leiden",
  citation: "Leiden University Scholarly Publications. Reconsidering research on teachers' professional identity. Handle 1887/11190.",
  url: "https://scholarlypublications.universiteitleiden.nl/handle/1887/11190",
  source_kind: "university",
  evidence_level: "L1",
  supports: [
    "Repository HTML for title, authors Beijaard, D., Meijer, P. C., and Verloop, N., year 2004, and Teaching and Teacher Education 20: 107-128",
    "Repository copy read for the review's own framing; the unstable download query is not the public source URL",
  ],
};

const beijaardOpenAlex: ContentSource = {
  id: "p1-beijaard-meijer-verloop-2004-openalex",
  citation: "OpenAlex work record for DOI 10.1016/j.tate.2003.07.001.",
  url: "https://api.openalex.org/works/https://doi.org/10.1016/j.tate.2003.07.001",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: [
    "Discovery-layer check of title, year, and author display names",
    "Not a substantive source and not a citation-count conclusion",
  ],
};

const tueBeijaard: ContentSource = {
  id: "p1-beijaard-tue-portal",
  citation: "Eindhoven University of Technology research portal. Douwe Beijaard.",
  url: "https://research.tue.nl/p/en/persons/douwe-beijaard",
  source_kind: "university",
  evidence_level: "L1",
  supports: [
    "Institutional profile title Full Professor emeritus on the page checked 2026-11-11",
    "Does not by itself fix every earlier job title",
  ],
};

const orcidBeijaard: ContentSource = {
  id: "p1-beijaard-orcid",
  citation: "ORCID. Douwe Beijaard. 0000-0002-0065-1810.",
  url: "https://orcid.org/0000-0002-0065-1810",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: ["Public ORCID identifier for the person record"],
};

const orcidBeijaardApi: ContentSource = {
  id: "p1-beijaard-orcid-api",
  citation: "ORCID Public API v3.0. 0000-0002-0065-1810.",
  url: "https://pub.orcid.org/v3.0/0000-0002-0065-1810",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: [
    "JSON name given Douwe, family Beijaard",
    "Employment summary: Professor, Eindhoven University of Technology, start year 2007, no end year in that record",
  ],
};

const openAlexBeijaard: ContentSource = {
  id: "p1-beijaard-openalex-author",
  citation: "OpenAlex author A5022795212. Douwe Beijaard.",
  url: "https://openalex.org/A5022795212",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: [
    "Discovery-layer display name Douwe Beijaard and the same ORCID",
    "Not a substantive biographical source and not a citation-count conclusion",
  ],
};

const copDoi: ContentSource = {
  id: "p1-wenger-1998-doi",
  citation: "Wenger, E. (1998). Communities of practice: Learning, meaning, and identity. Cambridge University Press.",
  url: "https://doi.org/10.1017/CBO9780511803932",
  source_kind: "doi",
  evidence_level: "L1",
  supports: ["DOI for the 1998 monograph", "A resolving DOI is not treated as an open full text of the book"],
};

const copCrossref: ContentSource = {
  id: "p1-wenger-1998-crossref",
  citation: "Crossref work record for 10.1017/CBO9780511803932.",
  url: "https://api.crossref.org/works/10.1017/CBO9780511803932",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: [
    "Bibliographic record: author Etienne Wenger, title Communities of Practice, publisher Cambridge University Press, issued 28 July 1998, monograph",
  ],
};

const copAspire: ContentSource = {
  id: "p1-wenger-1998-aspire",
  citation: "Cambridge Aspire. Communities of Practice: Learning, Meaning, and Identity.",
  url: "https://www.cambridge.org/highereducation/books/communities-of-practice/724C22A03B12D11DFC345EEF0AD3F22A",
  source_kind: "publisher",
  evidence_level: "L1",
  supports: [
    "Publisher page for the 1998 book, including the visible description of a social theory of learning",
    "The page description is truncated in the public HTML and is not treated as the whole book",
  ],
};

const copOpenAlex: ContentSource = {
  id: "p1-wenger-1998-openalex",
  citation: "OpenAlex work W4210702550.",
  url: "https://openalex.org/W4210702550",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: ["Discovery-layer work record only", "Not a substantive source and not a citation-count conclusion"],
};

const lppDoi: ContentSource = {
  id: "p1-lave-wenger-1991-doi",
  citation: "Lave, J., & Wenger, E. (1991). Situated learning: Legitimate peripheral participation. Cambridge University Press.",
  url: "https://doi.org/10.1017/CBO9780511815355",
  source_kind: "doi",
  evidence_level: "L1",
  supports: ["DOI for the 1991 monograph", "A resolving DOI is not treated as an open full text of the book"],
};

const lppCrossref: ContentSource = {
  id: "p1-lave-wenger-1991-crossref",
  citation: "Crossref work record for 10.1017/CBO9780511815355.",
  url: "https://api.crossref.org/works/10.1017/CBO9780511815355",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: [
    "Bibliographic record: authors Jean Lave and Etienne Wenger, title Situated Learning, publisher Cambridge University Press, issued 27 September 1991, monograph",
  ],
};

const lppAspire: ContentSource = {
  id: "p1-lave-wenger-1991-aspire",
  citation: "Cambridge Aspire. Situated Learning: Legitimate Peripheral Participation.",
  url: "https://www.cambridge.org/highereducation/books/situated-learning/6915ABD21C8E4619F750A4D4ACA616CD",
  source_kind: "publisher",
  evidence_level: "L1",
  supports: [
    "Publisher page for the 1991 book, including the visible description of situated learning and legitimate peripheral participation",
    "Occupational labels on that page are the publisher's wording, not a current CV",
  ],
};

const lppOpenAlex: ContentSource = {
  id: "p1-lave-wenger-1991-openalex",
  citation: "OpenAlex work W4245961435.",
  url: "https://openalex.org/W4245961435",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: ["Discovery-layer work record only", "Not a substantive source and not a citation-count conclusion"],
};

const openAlexWenger: ContentSource = {
  id: "p1-wenger-openalex-author",
  citation: "OpenAlex author A5018954657. Étienne Wenger.",
  url: "https://openalex.org/A5018954657",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: [
    "Discovery-layer display name Étienne Wenger with an empty ORCID field",
    "This row is not merged with another unchecked author row. A different surname is not treated here as proof of a different person",
    "Not a citation-count conclusion and not an institutional CV",
  ],
};

const elderRoutledge: ContentSource = {
  id: "p1-elder-children-routledge-25th",
  citation: "Routledge. Children of the Great Depression: 25th Anniversary Edition. Glen H. Elder, Jr.",
  url: "https://www.routledge.com/Children-Of-The-Great-Depression-25th-Anniversary-Edition/Elder/p/book/9780813333427",
  source_kind: "publisher",
  evidence_level: "L1",
  supports: [
    "Product page for the 25th anniversary edition",
    "Page statement that the work was first published in 1974, plus the Oakland cohort description visible on the page",
  ],
};

const elderDoi: ContentSource = {
  id: "p1-elder-children-doi-2018",
  citation: "Elder, G. H. Children of the Great Depression. Routledge. DOI 10.4324/9780429501739.",
  url: "https://doi.org/10.4324/9780429501739",
  source_kind: "doi",
  evidence_level: "L1",
  supports: [
    "DOI layer rechecked as resolving on 2026-11-11",
    "This DOI is not treated as identical to the 1974 printing or to every later reprint",
  ],
};

const elderCrossref: ContentSource = {
  id: "p1-elder-children-crossref",
  citation: "Crossref work record for 10.4324/9780429501739.",
  url: "https://api.crossref.org/works/10.4324/9780429501739",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: [
    "Bibliographic record: author Glen H. Elder, title Children of the Great Depression, publisher Routledge, type book, issued 8 October 2018, ISBN 9780429501739",
  ],
};

const lifeCourseHandbook: ContentSource = {
  id: "p1-handbook-life-course-2003",
  citation: "Mortimer, J. T., & Shanahan, M. J. (Eds.). Handbook of the life course. Springer US.",
  url: "https://link.springer.com/book/10.1007/b100507",
  source_kind: "publisher",
  evidence_level: "L1",
  supports: [
    "Handbook bibliographic page: editors Jeylan T. Mortimer and Michael J. Shanahan, Springer, handbook-level year 2003",
    "Visible overview of perspectives and methods for studying lives across age phases",
    "Publisher HTML is not treated as an open full text of the handbook",
  ],
};

const lifeCourseHandbookCrossref: ContentSource = {
  id: "p1-handbook-life-course-crossref",
  citation: "Crossref work record for 10.1007/b100507.",
  url: "https://api.crossref.org/works/10.1007/b100507",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: [
    "Handbook-level issued year 2003, publisher Springer US, series Handbooks of Sociology and Social Research",
  ],
};

const pallasChapter: ContentSource = {
  id: "p1-pallas-educational-transitions-chapter",
  citation: "Pallas, A. M. Educational transitions, trajectories, and pathways. In J. T. Mortimer & M. J. Shanahan (Eds.), Handbook of the life course.",
  url: "https://link.springer.com/chapter/10.1007/978-0-306-48247-2_8",
  source_kind: "publisher",
  evidence_level: "L1",
  supports: [
    "Chapter page: Aaron M. Pallas, title Educational Transitions, Trajectories, and Pathways, pages 165-184 in the handbook",
    "Visible chapter abstract on educational paths, the changes that mark them, and the common routes that shape them",
    "Crossref chapter-level issued was empty on 2026-11-11, so no separate chapter date is stated",
    "Publisher HTML is not treated as an open full text",
  ],
};

const pallasCrossref: ContentSource = {
  id: "p1-pallas-chapter-crossref",
  citation: "Crossref work record for 10.1007/978-0-306-48247-2_8.",
  url: "https://api.crossref.org/works/10.1007/978-0-306-48247-2_8",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: [
    "Chapter bibliographic record with an empty issued date-part",
    "Author Aaron M. Pallas, container Handbook of the Life Course, pages 165-184",
  ],
};

const elderAbout: ContentSource = {
  id: "p1-elder-unc-about",
  citation: "University of North Carolina at Chapel Hill. About Glen H. Elder, Jr.",
  url: "https://elder.web.unc.edu/about/",
  source_kind: "university",
  evidence_level: "L1",
  supports: [
    "Page title and appointment wording checked 2026-11-11",
    "Page account of how Elder describes his path into life-course research, including the 1974/1999 book dating on that page",
  ],
};

const elderBooks: ContentSource = {
  id: "p1-elder-unc-books",
  citation: "University of North Carolina at Chapel Hill. Books by Glen H. Elder, Jr.",
  url: "https://elder.web.unc.edu/books/",
  source_kind: "university",
  evidence_level: "L1",
  supports: [
    "Books page dating: 1999 record marked published 1974, ISBN 978-0813333427",
    "Page description of the Oakland cohort and of what the anniversary edition adds",
  ],
};

const elderCpc: ContentSource = {
  id: "p1-elder-cpc-bib-943",
  citation: "Carolina Population Center. Children of the Great Depression: Social Change in Life Experience. Bibliography 943.",
  url: "https://www.cpc.unc.edu/resources/publications/bib/943/",
  source_kind: "university",
  evidence_level: "L1",
  supports: [
    "Bibliography record: Elder, Glen H., Jr. (1999), Westview Press, Boulder",
  ],
};

const openAlexElder: ContentSource = {
  id: "p1-elder-openalex-author",
  citation: "OpenAlex author A5110302150. Glen H. Elder.",
  url: "https://openalex.org/A5110302150",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: [
    "Discovery-layer display name Glen H. Elder with an empty ORCID field",
    "Not a substantive biographical source and not a citation-count conclusion",
  ],
};

const publicationReview = {
  reviewerRole: "publication_editor" as const,
  reviewDecision: "approved" as const,
};

function l1(claimId: string, fieldPath: string, claim: string, sourceId: string, locator: string): VerificationEntry {
  return {
    claimId,
    fieldPath,
    claim,
    evidence_level: "L1",
    source_id: sourceId,
    status: "verified",
    locator,
    contentNature: "source_backed_fact",
    evidenceStatus: "source_verified",
    verifiedAt,
    ...publicationReview,
  };
}

function l2(claimId: string, fieldPath: string, claim: string): VerificationEntry {
  return {
    claimId,
    fieldPath,
    claim,
    evidence_level: "L2",
    status: "editorial",
    contentNature: "editorial_synthesis",
    verifiedAt,
    ...publicationReview,
  };
}

function l3(claimId: string, fieldPath: string, claim: string): VerificationEntry {
  return {
    claimId,
    fieldPath,
    claim,
    evidence_level: "L3",
    status: "proposed",
    contentNature: "research_guidance",
    verifiedAt,
    ...publicationReview,
  };
}

export interface P1FlagshipDraftBatch {
  theories: SeedTheory[];
  works: SeedWork[];
  scholars: SeedScholar[];
  theoryWorks: SeedTheoryWork[];
  theoryScholars: SeedTheoryScholar[];
}

export function createP1FlagshipDraftBatch(): P1FlagshipDraftBatch {
  const identitySlug = "teacher-professional-identity";
  const copSlug = "communities-of-practice-1998";
  const lppSlug = "situated-learning-legitimate-peripheral-participation";
  const lifeSlug = "life-course-perspective";

  const theories: SeedTheory[] = [
    {
      slug: identitySlug,
      primary: false,
      depth: "D2",
      titleEn: "Teacher professional identity",
      summaryEn: "Use this page when a study claims to examine how teachers interpret themselves in their work. Beijaard, Meijer, and Verloop's 2004 review sorts that research and, in journal pages 122–123 section 6.1, names four features. Those features are the authors' reading of other studies. They are not a validated scale, not a causal experiment, and not one person's theory.",
      status: "published",
      publishedAt: P1_FLAGSHIP_PUBLISHED_AT,
      content: {
        en: {
          theory_nature: {
            kind: "framework",
            label: "Research construct / framework family",
            explanation: "This page groups a family of research uses. It does not present one closed theory, and it does not treat Beijaard as the owner of that family.",
            source_ids: [beijaardLeiden.id, beijaardCrossref.id],
          },
          what_is_it: "Decide whether a study is actually using teacher professional identity, and which evidence each feature requires. In the legal open-access PDF of Beijaard, Meijer, and Verloop (2004), section 6.1 on journal pages 122–123 states four features the authors regard as essential, drawn from formation studies and story studies, after they report that the studies they reviewed defined the construct incompatibly or not at all. Professional identity is an ongoing process of interpreting and reinterpreting experience, so it is not a fixed possession. It involves both the person and the context. It can include sub-identities that may align or conflict. Agency matters because teachers take an active part in making sense of themselves as teachers. The same review says many of the studies were really about personal practical knowledge, and that the link to professional identity was often assumed. These are the authors' features of a review. They are not a scale this page has validated, and they are not a causal law for every teacher. Locator: Leiden OA PDF, journal pages 122–123, section 6.1 (https://scholarlypublications.universiteitleiden.nl/handle/1887/11190).",
          origins: "Crossref records the article as issued in February 2004, in Teaching and Teacher Education, volume 20, issue 2, pages 107-128, with authors Douwe Beijaard, Paulien C. Meijer, and Nico Verloop, and publisher Elsevier BV. The Leiden repository copy, whose public record is handle 1887/11190, shows the same title, authors, year, journal, and pages, and its first page gives receipt in May 2002, revision in June 2003, and acceptance in July 2003. Those dates are not the same fact as the February 2004 issue date. This page uses the 2004 article as the flagship work. It does not substitute an earlier Beijaard article for that work.",
          core_concepts: [
            {
              name: "Ongoing interpretation",
              definition: "In the review's section 6.1, professional identity is treated as a continuing process of interpreting and reinterpreting experience, including a question about who a teacher is trying to become, rather than as a stable trait.",
              relevance: "A study that needs a one-time label for a teacher is using a different construct.",
            },
            {
              name: "Person and context",
              definition: "The same section says professional identity involves both the person and the context: teachers are expected to take up professional characteristics, but they do not do so in one identical way.",
              relevance: "Context has to be specified. A purely private self-description is outside this feature.",
            },
            {
              name: "Sub-identities",
              definition: "The review says a teacher's professional identity can include sub-identities tied to different contexts and relationships, and that those parts may harmonize or conflict.",
              relevance: "Conflict during training or during a change in the workplace is part of the construct, not a failure to have an identity.",
            },
            {
              name: "Agency",
              definition: "The review treats agency as teachers' active part in professional development, and as the use of identity to make sense of oneself as a teacher in relation to other people and contexts.",
              relevance: "The construct is something teachers do in explanation and justification, not only something they possess.",
            },
          ],
          genealogy: [
            {
              related_theory: copSlug,
              relationship: "distinct_from",
              description: "Shared practice can matter for how teachers understand their work, but the 1998 communities-of-practice book and this identity construct are different pages. Participation in a practice is not, by itself, the 2004 review's account of professional identity.",
              source_ids: [beijaardLeiden.id, copAspire.id],
            },
            {
              related_theory: lifeSlug,
              relationship: "compared_with",
              description: "A life-course question about timing, cohort, and educational pathways is a different question from how teachers interpret a professional self. The two pages can be read together only when a study actually asks both.",
              source_ids: [beijaardLeiden.id, pallasChapter.id],
            },
          ],
          applicable_topics: [
            {
              topic: "How student teachers or practising teachers interpret who they are in the work",
              rationale: "The 2004 review's formation and story studies are about that interpretive process, including biography and the question of who a teacher is trying to become.",
            },
            {
              topic: "Identity tension when a sub-identity conflicts with another, or with a changed workplace",
              rationale: "Section 6.1 treats conflict among sub-identities as part of the construct, including during initial training and during educational or workplace change.",
            },
            {
              topic: "What a study means by the word professional in 'professional identity'",
              rationale: "The review explicitly says later research needs to say what counts as professional, rather than leaving the adjective undefined.",
            },
          ],
          inapplicable_topics: [
            {
              topic: "Everyday self-identity with no teaching-work referent",
              rationale: "This page is a research construct about teachers' professional identity. It is not a general theory of personal identity.",
            },
            {
              topic: "A claim that one scholar founded the whole field, or that a 2000 article is the flagship experiment",
              rationale: "The flagship work on this page is the 2004 review. The review presents itself as a reconsideration of research, not as a founding field experiment, and the construct is not a single Beijaard theory.",
            },
          ],
          misuse_risks: [
            "Calling any personal self-description a finding about teacher professional identity.",
            "Treating the 2004 article as a field experiment that established one identity process.",
            "Quoting or pasting the article's abstract, or a database abstract, in place of a paraphrase.",
            "Treating the DOI landing page as an open full text. Elsevier HTML was not used as an open source.",
          ],
          analysis_dimensions: [
            "Which of the review's three study types the project actually resembles",
            "Whether identity is being treated as a process, a trait, or a list of characteristics",
            "How person and context are both evidenced",
            "Whether sub-identities and agency are observed or only named",
          ],
          data_collection: [
            {
              dimension: "Interpretive process",
              indicators: ["Accounts of how a teacher re-reads an experience", "A stated contrast between a current and a hoped-for professional self"],
              collection_prompt: "Ask for a specific experience the teacher has reinterpreted, and for who they say they are trying to become in the work. Do not score a single adjective as the identity.",
            },
            {
              dimension: "Sub-identities in context",
              indicators: ["Named work relationships or settings", "A described alignment or conflict among those positions"],
              collection_prompt: "Ask which work relationships pull in different directions, and whether that conflict is costly because the position is central to the teacher.",
            },
            {
              dimension: "Agency in explanation",
              indicators: ["Justifications offered to other people", "Resources the teacher says are available for a professional aim"],
              collection_prompt: "Ask how the teacher explains a decision to someone else, and what they could actually use to pursue the aim they name.",
            },
          ],
          chapter_structure: [
            {
              chapter: "Construct and limits",
              purpose: "Say that the page is a research construct and a review, and state what it does not claim.",
              theory_use: "Separate the 2004 review from everyday identity and from a single-author theory.",
            },
            {
              chapter: "Literature",
              purpose: "Place the study against the review's three kinds of project.",
              theory_use: "Say which kind the study extends, and whether a definition is being supplied where the reviewed literature omitted one.",
            },
            {
              chapter: "Methods",
              purpose: "Show how process, context, sub-identities, and agency will be evidenced.",
              theory_use: "Do not treat a survey label as a substitute for those features unless the instrument is shown to capture them.",
            },
            {
              chapter: "Interpretation",
              purpose: "Report where the features fit and where they do not.",
              theory_use: "Keep personal practical knowledge distinct unless the study explains the link the review said was often only assumed.",
            },
          ],
          fit_writing: [
            "Use this construct when the question is how teachers interpret themselves in professional work over time, in context, and in relation to other people.",
            "Name the feature the study can evidence before claiming that the 2004 review frames the design.",
          ],
          explanatory_mechanisms: [
            {
              mechanism: "Reinterpretation of experience",
              process: "The review treats professional identity as changing when teachers interpret and reinterpret experience, rather than as a possession that stays fixed.",
              evidence_focus: "Repeated or revised accounts, not a one-time trait score.",
              source_ids: [beijaardLeiden.id],
            },
            {
              mechanism: "Sub-identity conflict",
              process: "Different work contexts can pull sub-identities apart. The review says the more central a sub-identity is, the more costly it is to change or lose it.",
              evidence_focus: "A named conflict and a judgment about how central the threatened position is.",
              source_ids: [beijaardLeiden.id],
            },
          ],
          analysis_unit: "A teacher's professional self-interpretation in specified work contexts, including possible sub-identities.",
          theory_comparisons: [
            {
              theory: "Communities of practice (1998)",
              role: "main_candidate",
              shared_focus: "Both can be used when teachers' work is social rather than only private.",
              difference: "The 1998 book, on its Cambridge page, is a social theory of learning whose unit is informal communities formed around shared enterprises. This page is a review construct about professional identity.",
              when_prefer: "Prefer the 1998 page when the question is learning through a shared practice, and this page when the question is professional self-interpretation.",
              source_ids: [beijaardLeiden.id, copAspire.id],
            },
            {
              theory: "Life course perspective",
              role: "alternative",
              shared_focus: "Both can use biography and time.",
              difference: "The life-course page asks how lives, including educational pathways, unfold in historical and institutional time. It is not an account of teachers' professional self-interpretation.",
              when_prefer: "Prefer the life-course page when cohort, timing, or a schooling trajectory is the object.",
              source_ids: [pallasChapter.id, elderRoutledge.id],
            },
          ],
          boundary_conditions: [
            {
              condition: "The study cannot show both a person and a context.",
              implication: "The review's second feature is not evidenced, and the construct should not be claimed in full.",
              source_ids: [beijaardLeiden.id],
            },
            {
              condition: "The only available text is a publisher or database abstract.",
              implication: "Do not paste it. Use the Leiden handle, the DOI, and the Crossref record, and keep argument claims inside what those sources support.",
              source_ids: [beijaardDoi.id, beijaardLeiden.id],
            },
          ],
          sources: [beijaardDoi, beijaardCrossref, beijaardLeiden, beijaardOpenAlex, copAspire, pallasChapter, elderRoutledge],
          reading_path: [
            { order: 1, level: "Level 1 · Bibliographic identity", title: "Crossref record", purpose: "Check authors, journal, volume, issue, pages, and the February 2004 issue date.", source_id: beijaardCrossref.id },
            { order: 2, level: "Level 1 · Repository copy", title: "Leiden handle 1887/11190", purpose: "Read the repository copy for the three study types and section 6.1. Do not cite the unstable download query as the public URL.", source_id: beijaardLeiden.id },
            { order: 3, level: "Level 2 · Page boundary", title: "This page's limits", purpose: "Keep the page a research construct and a review, not a Beijaard theory and not an open ScienceDirect text.", source_id: beijaardDoi.id },
            { order: 4, level: "Level 3 · Design", title: "Fit against the four features", purpose: "Decide which feature the study can evidence before adopting the construct.", source_id: beijaardLeiden.id },
          ],
          verification: [
            l1("p1-tpi-biblio", `theories[slug="${identitySlug}"].content.en.origins`, "Crossref lists Douwe Beijaard, Paulien C. Meijer, and Nico Verloop as authors of Reconsidering research on teachers' professional identity, issued February 2004 in Teaching and Teacher Education 20(2), pages 107-128, publisher Elsevier BV.", beijaardCrossref.id, "Crossref message fields title, author, container-title, issued, volume, issue, page, publisher; checked 2026-11-11"),
            l1("p1-tpi-three-kinds", `theories[slug="${identitySlug}"].content.en.what_is_it`, "The 2004 review sorts the studies it read into formation studies, characteristic-identification studies, and studies that present professional identity through teachers' stories.", beijaardLeiden.id, "Repository copy of handle 1887/11190, opening review statement and the paragraph introducing the three categories before section 3; read 2026-11-11"),
            l1("p1-tpi-four-features", `theories[slug="${identitySlug}"].content.en.core_concepts`, "Section 6.1 of the review presents four features: an ongoing interpretive process, person and context, sub-identities that may harmonize or conflict, and agency.", beijaardLeiden.id, "Repository copy, section 6.1, running header page 122 of Teaching and Teacher Education 20 (2004) 107-128; read 2026-11-11"),
            l1("p1-tpi-acceptance-dates", `theories[slug="${identitySlug}"].content.en.origins`, "The repository copy prints receipt in May 2002, revision in June 2003, and acceptance in July 2003, which are not the Crossref issue date of February 2004.", beijaardLeiden.id, "First page of the repository copy, received/revised/accepted line; read 2026-11-11"),
            l2("p1-tpi-boundary", `theories[slug="${identitySlug}"].content.en.theory_nature`, "The page calls itself a research construct and a review. That label is editorial. The article is not presented here as a founding experiment or as a theory owned by one author."),
            l2("p1-tpi-summary-limit", `theories[slug="${identitySlug}"].content.en.misuse_risks`, "The summary paraphrases the review's framing. It does not reproduce the abstract, and it does not claim that later research agrees with the four features."),
            l3("p1-tpi-guidance", `theories[slug="${identitySlug}"].content.en.fit_writing`, "Using the four features as a design checklist is conditional on the question, the evidence a study can actually collect, and human review. It is not a required method."),
          ],
        },
      },
    },
    {
      slug: copSlug,
      primary: false,
      depth: "D2",
      titleEn: "Communities of practice",
      summaryEn: "Use this page when the question is how people come to know by taking part in an informal community organized around a shared enterprise. The visible Cambridge description of Etienne Wenger's 1998 book supports that unit (DOI 10.1017/CBO9780511803932) and then breaks off. It does not forbid a reader from also using the 1991 book.",
      status: "published",
      publishedAt: P1_FLAGSHIP_PUBLISHED_AT,
      content: {
        en: {
          theory_nature: {
            kind: "framework",
            label: "1998 social theory of learning",
            explanation: "This page is limited to the 1998 book as a publisher and Crossref record. It is not a popularization, and it is not the same page as situated learning.",
            source_ids: [copCrossref.id, copAspire.id],
          },
          what_is_it: "Ask whether the materials show an informal community pursuing a shared enterprise over time, and whether learning is evidenced as participation in that enterprise. The Cambridge Aspire page for the 1998 book (https://doi.org/10.1017/CBO9780511803932) says engagement in social practice is how people come to know and become who they are, and that the unit is neither the isolated person nor formal institutions but the informal communities of practice people form around shared enterprises. The public HTML then breaks off. This page does not fill the missing sentences and does not invent chapter vocabulary. An editorial reading suggestion: if the materials instead follow a newcomer moving toward fuller participation, read the 1991 page as well. That suggestion is not a theoretical ban. The subtitle on the publisher page is Learning, Meaning, and Identity.",
          origins: "Crossref records a monograph titled Communities of Practice, author Etienne Wenger, publisher Cambridge University Press, issued 28 July 1998, DOI 10.1017/CBO9780511803932. The same author name, without an accent, is the Crossref given name. OpenAlex author A5018954657 displays Étienne Wenger and has an empty ORCID. This page does not merge that row with another unchecked author row, and it does not treat a different surname as proof of a different person. No institutional CV was verified for this scholar in the source ledger.",
          core_concepts: [
            {
              name: "Social practice as the learning process",
              definition: "The Cambridge page describes engagement in social practice as the process through which people come to know and become who they are.",
              relevance: "Learning, on this page, is not introduced as a private mental event alone.",
            },
            {
              name: "Informal community of practice",
              definition: "The page says the primary unit is the informal community people form as they pursue shared enterprises over time.",
              relevance: "A named department, cohort, or platform is not automatically that unit.",
            },
            {
              name: "Shared enterprise over time",
              definition: "The visible description ties the community to a shared enterprise pursued over time, not to a single meeting.",
              relevance: "Duration and a shared pursuit have to be argued, not assumed from a label.",
            },
            {
              name: "Page boundary with the 1991 book",
              definition: "The 1991 book is a different Crossref record, coauthored with Jean Lave, issued in 1991, and described on its own Cambridge page through legitimate peripheral participation.",
              relevance: "Readers should leave this page for the situated-learning page when the question is about newcomers' participation.",
            },
          ],
          genealogy: [
            {
              related_theory: lppSlug,
              relationship: "distinct_from",
              description: "The 1991 and 1998 books share a series and an author, but they are different works. This page does not collapse legitimate peripheral participation into the 1998 theory.",
              source_ids: [copCrossref.id, lppCrossref.id],
            },
            {
              related_theory: identitySlug,
              relationship: "distinct_from",
              description: "The 1998 subtitle includes identity, and the 2004 identity review is a different literature. A community-of-practice design does not by itself answer the review's questions about professional identity.",
              source_ids: [copAspire.id, beijaardLeiden.id],
            },
          ],
          applicable_topics: [
            {
              topic: "Learning that the study locates in participation in a shared enterprise",
              rationale: "That is the process the Cambridge page puts at the start of the 1998 theory.",
            },
            {
              topic: "A workplace or teacher-learning setting where the unit is an informal community rather than a formal team",
              rationale: "The page explicitly sets the unit apart from the individual and from social institutions.",
            },
            {
              topic: "A comparison that must keep the 1998 book separate from the 1991 book",
              rationale: "The two DOIs, author lists, and years are different, and the publisher descriptions emphasize different terms.",
            },
          ],
          inapplicable_topics: [
            {
              topic: "A management or consulting use of the phrase with no shared enterprise or social theory of learning",
              rationale: "A buzzword is not the 1998 framework. This page refuses that substitution.",
            },
            {
              topic: "Newcomers moving toward fuller participation as the main object",
              rationale: "That question is the 1991 book's visible focus. This page's editorial suggestion is to read the 1991 page first. It is not a claim that the 1998 description forbids the newcomer question.",
            },
          ],
          misuse_risks: [
            "Using 'community of practice' for any team, network, workshop, or online group.",
            "Do not merge an unchecked OpenAlex row for Etienne Wenger with a row that uses another surname. This page did not compare those rows, and it does not conclude that they name different people.",
            "Treating the 1991 coauthored book as if it were the 1998 monograph.",
            "Treating the Cambridge description, which breaks off in the public HTML, as a full chapter summary.",
          ],
          analysis_dimensions: [
            "Whether the unit is an informal community or a formal membership list",
            "What the shared enterprise is, and over what period",
            "How learning is evidenced as participation rather than as attendance",
            "Whether the study is actually about the 1991 participation process instead",
          ],
          data_collection: [
            {
              dimension: "Shared enterprise",
              indicators: ["A pursuit participants can describe in common", "Evidence that the pursuit continues beyond one event"],
              collection_prompt: "Ask what people are pursuing together and how long that pursuit has been sustained. Do not accept the group's official name as the answer.",
            },
            {
              dimension: "Informal community versus institution",
              indicators: ["Practices that are not identical to the formal rules", "Participants who count as part of the practice without a matching job title"],
              collection_prompt: "Separate the formal unit from the people who actually pursue the enterprise together.",
            },
            {
              dimension: "Learning as participation",
              indicators: ["Changes in what a person can do in the practice", "Accounts of coming to know through taking part"],
              collection_prompt: "Ask what someone can do in the practice now that they could not do before, and tie that change to participation rather than to a course title.",
            },
          ],
          chapter_structure: [
            {
              chapter: "Which book",
              purpose: "Identify the 1998 monograph and refuse the 1991 collapse.",
              theory_use: "Cite the 1998 DOI and author before using the phrase.",
            },
            {
              chapter: "Unit of analysis",
              purpose: "Define the informal community and the shared enterprise.",
              theory_use: "Show why the unit is not the individual and not the formal institution.",
            },
            {
              chapter: "Evidence of learning",
              purpose: "Connect participation to coming to know.",
              theory_use: "Do not infer the 1998 theory from a community label alone.",
            },
            {
              chapter: "Misuse check",
              purpose: "State the management-slogan boundary in the case at hand.",
              theory_use: "If the case fails the boundary, say so and choose another lens.",
            },
          ],
          fit_writing: [
            "Use the 1998 framework when the question is how people learn by pursuing a shared enterprise together over time.",
            "If the materials only show a formal team or a training label, do not call that a community of practice.",
          ],
          explanatory_mechanisms: [
            {
              mechanism: "Participation in a shared enterprise",
              process: "The Cambridge page presents engagement in social practice, organized as an informal community around a shared enterprise, as the process by which people come to know and become who they are.",
              evidence_focus: "The enterprise, the participants, and a change in knowing or becoming that is tied to that participation.",
              source_ids: [copAspire.id],
            },
            {
              mechanism: "Unit shift away from the individual and the institution",
              process: "The page says the theory's primary unit is neither the individual nor social institutions.",
              evidence_focus: "A contrast between the informal practice and both the single person and the formal organization.",
              source_ids: [copAspire.id],
            },
          ],
          analysis_unit: "An informal community of practice organized around a shared enterprise over time.",
          theory_comparisons: [
            {
              theory: "Situated learning / legitimate peripheral participation",
              role: "main_candidate",
              shared_focus: "Both Cambridge pages are in Learning in Doing and both treat learning as social.",
              difference: "The 1991 page centers legitimate peripheral participation by newcomers. The 1998 page centers communities of practice as the unit of a social theory of learning, and Crossref lists Wenger alone.",
              when_prefer: "Prefer the 1991 page for newcomer participation. Prefer this page for the 1998 unit of analysis.",
              source_ids: [copCrossref.id, lppAspire.id],
            },
            {
              theory: "Teacher professional identity",
              role: "alternative",
              shared_focus: "Both can appear in studies of teachers' work.",
              difference: "The identity page is a 2004 review construct about professional self-interpretation. It is not this book's theory of learning.",
              when_prefer: "Prefer the identity page when the question is who teachers understand themselves to be in the work.",
              source_ids: [beijaardLeiden.id, copAspire.id],
            },
          ],
          boundary_conditions: [
            {
              condition: "The opened publisher description breaks off before a chapter-level vocabulary.",
              implication: "This page does not add mutual-engagement or repertoire claims that were not on the opened page.",
              source_ids: [copAspire.id],
            },
            {
              condition: "The source for the scholar is only an OpenAlex author row.",
              implication: "Do not invent an employer, degree, or personal site. The ledger left a fuller institutional CV unresolved.",
              source_ids: [openAlexWenger.id],
            },
          ],
          sources: [copDoi, copCrossref, copAspire, copOpenAlex, lppCrossref, lppAspire, openAlexWenger, beijaardLeiden],
          reading_path: [
            { order: 1, level: "Level 1 · Bibliographic identity", title: "Crossref 10.1017/CBO9780511803932", purpose: "Check the 1998 author, publisher, and issue date.", source_id: copCrossref.id },
            { order: 2, level: "Level 1 · Publisher description", title: "Cambridge Aspire page", purpose: "Read the visible description and stop where the HTML breaks off.", source_id: copAspire.id },
            { order: 3, level: "Level 2 · Page boundary", title: "Separate the 1991 book", purpose: "Keep this page off the situated-learning page. Do not decide that another database surname is a different person.", source_id: lppCrossref.id },
            { order: 4, level: "Level 3 · Design", title: "Test the unit", purpose: "Do not apply the phrase to a formal team that lacks a shared enterprise.", source_id: copAspire.id },
          ],
          verification: [
            l1("p1-cop-biblio", `theories[slug="${copSlug}"].content.en.origins`, "Crossref records Communities of Practice as a Cambridge University Press monograph by Etienne Wenger, issued 28 July 1998.", copCrossref.id, "Crossref message title, author, publisher, issued, type; checked 2026-11-11"),
            l1("p1-cop-unit", `theories[slug="${copSlug}"].content.en.what_is_it`, "The Cambridge Aspire page describes learning through engagement in social practice and names informal communities of practice, formed around shared enterprises over time, as the primary unit rather than the individual or social institutions.", copAspire.id, "Visible description on the Aspire HTML, checked 2026-11-11; the sentence is truncated on the page"),
            l1("p1-cop-wenger-name", `theories[slug="${copSlug}"].content.en.origins`, "OpenAlex A5018954657 displays Étienne Wenger and returns an empty ORCID. This page does not treat that row as an institutional CV.", openAlexWenger.id, "OpenAlex author JSON display_name and orcid; checked 2026-11-11"),
            l2("p1-cop-misuse", `theories[slug="${copSlug}"].content.en.misuse_risks`, "The management-slogan boundary is editorial. The 1998 publisher record does not license every later use of the phrase."),
            l2("p1-cop-not-lpp", `theories[slug="${copSlug}"].content.en.genealogy`, "Keeping the 1998 book distinct from the 1991 book is an editorial page boundary supported by the two different Crossref records."),
            l3("p1-cop-guidance", `theories[slug="${copSlug}"].content.en.fit_writing`, "Refusing a formal team as a community of practice is design guidance. It depends on the evidence the study can show."),
          ],
        },
      },
    },
    {
      slug: lppSlug,
      primary: false,
      depth: "D2",
      titleEn: "Situated learning / legitimate peripheral participation",
      summaryEn: "Use this page when the question is how a newcomer takes part in a practice and moves toward fuller participation. The 1991 book is by Jean Lave and Etienne Wenger (DOI 10.1017/CBO9780511815355). The visible Cambridge description supports that process and then breaks off. The 1998 book is a different reading, not a forbidden one.",
      status: "published",
      publishedAt: P1_FLAGSHIP_PUBLISHED_AT,
      content: {
        en: {
          theory_nature: {
            kind: "framework",
            label: "1991 situated-learning account",
            explanation: "The page is the 1991 book, identified by Crossref and the Cambridge Aspire page. Legitimate peripheral participation is the process that page puts at the center.",
            source_ids: [lppCrossref.id, lppAspire.id],
          },
          what_is_it: "Ask what would count as a change in participation, and which book you are actually citing. The Cambridge Aspire page for the 1991 book (https://doi.org/10.1017/CBO9780511815355) says Jean Lave and Etienne Wenger treat learning as fundamentally social, and legitimate peripheral participation as the central characteristic of learning viewed as situated activity. Learners take part in communities of practitioners and move toward fuller participation. The sentence about relations between newcomers then breaks off. This page does not complete it. An editorial check, not an author finding: name the practice, who grants access, and what changes as participation becomes fuller. If the unit in your materials is an ongoing shared enterprise rather than that movement, read the 1998 page as a different focus. The publisher's occupational labels stay inside that page. They are not a current CV. Crossref lists both authors, Cambridge University Press, and 27 September 1991.",
          origins: "The 1991 monograph is a different Crossref work from Wenger's 1998 Communities of Practice. Both publisher pages place the books in Learning in Doing: Social, Cognitive and Computational Perspectives. Shared series and a shared author are not identity of argument. Jean Lave remains a coauthor on this page and has a separate scholar page. This page does not replace that scholar page.",
          core_concepts: [
            {
              name: "Situated learning",
              definition: "On the Cambridge page, situated learning is the claim that learning is fundamentally a social process.",
              relevance: "A purely individual skills account is a different starting point.",
            },
            {
              name: "Legitimate peripheral participation",
              definition: "The page says this process is the central defining characteristic of learning viewed as situated activity.",
              relevance: "The term is doing definitional work. It is not a decorative synonym for internship.",
            },
            {
              name: "Movement toward fuller participation",
              definition: "The visible description says learners participate in communities of practitioners and move toward fuller participation in the community's practices.",
              relevance: "Access and a change in participation have to be shown.",
            },
            {
              name: "Newcomer relations",
              definition: "The page begins a point about relations between newcomers and then the public HTML breaks off.",
              relevance: "This page does not invent the rest of that sentence.",
            },
          ],
          genealogy: [
            {
              related_theory: copSlug,
              relationship: "distinct_from",
              description: "The 1998 book develops communities of practice as a social theory of learning with Wenger as sole Crossref author. This page stays with the 1991 coauthored account of legitimate peripheral participation.",
              source_ids: [lppCrossref.id, copCrossref.id],
            },
            {
              related_theory: identitySlug,
              relationship: "distinct_from",
              description: "Movement toward fuller participation in a practice is not the 2004 review's account of teacher professional identity.",
              source_ids: [lppAspire.id, beijaardLeiden.id],
            },
          ],
          applicable_topics: [
            {
              topic: "How newcomers learn by taking part in an existing practice",
              rationale: "That is the process the Cambridge page names as central.",
            },
            {
              topic: "Access, legitimacy, and a change from more peripheral to fuller participation",
              rationale: "The visible description requires participation in a community of practitioners and movement toward fuller participation.",
            },
            {
              topic: "A study that must not be filed under the 1998 book by mistake",
              rationale: "The author list and year differ, and the publisher pages emphasize different terms.",
            },
          ],
          inapplicable_topics: [
            {
              topic: "Any placement, induction, or observation labelled an apprenticeship without participation evidence",
              rationale: "The page's process is specific. A label is not the process.",
            },
            {
              topic: "A sole-authored 1998 theory of communities of practice",
              rationale: "That is the other page. Lave is a coauthor of the 1991 book, not an absent name to be dropped.",
            },
          ],
          misuse_risks: [
            "Using legitimate peripheral participation as a slogan for any training placement.",
            "Dropping Jean Lave from the 1991 author list. The published scholar page for Lave is separate from this theory page. That separation does not remove her from the book.",
            "Reading the publisher's occupational labels as a verified current CV.",
            "Completing the truncated newcomer sentence with unstated book chapters.",
          ],
          analysis_dimensions: [
            "What practice the newcomer is joining",
            "In what sense the participation is legitimate rather than merely present",
            "What changes as participation becomes fuller",
            "Whether the study has drifted into the 1998 unit of analysis",
          ],
          data_collection: [
            {
              dimension: "Practice joined",
              indicators: ["The community of practitioners", "The activities a newcomer is allowed to take part in"],
              collection_prompt: "Name the practice and the people who already carry it. Do not substitute a course code.",
            },
            {
              dimension: "Legitimacy and periphery",
              indicators: ["Who grants access", "Which tasks are available early and which are not"],
              collection_prompt: "Ask what the newcomer may do, what they may not do yet, and who treats that limit as legitimate.",
            },
            {
              dimension: "Fuller participation",
              indicators: ["A later set of tasks or responsibilities", "A change in relations with practitioners"],
              collection_prompt: "Compare an earlier and a later episode. The Cambridge page's visible text supports movement toward fuller participation, not a universal endpoint.",
            },
          ],
          chapter_structure: [
            {
              chapter: "1991, not 1998",
              purpose: "Fix the book, the two authors, and the year.",
              theory_use: "Send 1998 questions to the communities-of-practice page.",
            },
            {
              chapter: "The process",
              purpose: "Define legitimate peripheral participation from the publisher page, and mark the truncation.",
              theory_use: "Do not add chapter claims the opened page does not show.",
            },
            {
              chapter: "Access and change",
              purpose: "Show legitimacy, periphery, and movement in the materials.",
              theory_use: "If movement cannot be shown, do not claim the process.",
            },
            {
              chapter: "Author boundary",
              purpose: "Keep Lave as coauthor without creating a flagship scholar page.",
              theory_use: "The published Wenger scholar page carries the 1998 author role. It does not drop Lave from the 1991 book.",
            },
          ],
          fit_writing: [
            "Use this page when the question is how newcomers learn by participating, legitimately and at first peripherally, in a community of practitioners.",
            "Do not use it as a synonym for the 1998 communities-of-practice book.",
          ],
          explanatory_mechanisms: [
            {
              mechanism: "Legitimate peripheral participation",
              process: "The Cambridge page says learning understood as situated activity has this process as its central characteristic: learners take part and move toward fuller participation.",
              evidence_focus: "Access, the community of practitioners, and a change in how fully the person participates.",
              source_ids: [lppAspire.id],
            },
            {
              mechanism: "Learning as a social process",
              process: "The same page introduces situated learning as the view that learning is fundamentally social.",
              evidence_focus: "Participation with practitioners, not an unsupported shift to a private trait.",
              source_ids: [lppAspire.id],
            },
          ],
          analysis_unit: "A newcomer's changing participation in a community of practitioners.",
          theory_comparisons: [
            {
              theory: "Communities of practice (1998)",
              role: "main_candidate",
              shared_focus: "Social learning, a shared Cambridge series, and Wenger as an author of both books.",
              difference: "1991 is coauthored and centers legitimate peripheral participation. 1998 is a sole-authored Crossref record and centers the community of practice as the unit.",
              when_prefer: "Prefer 1998 when the unit of analysis is the community and the shared enterprise, not the newcomer's path.",
              source_ids: [lppCrossref.id, copCrossref.id],
            },
            {
              theory: "Teacher professional identity",
              role: "alternative",
              shared_focus: "Both can be proposed for studies of teachers.",
              difference: "The identity page is about professional self-interpretation in the 2004 review. It is not a theory of newcomer participation.",
              when_prefer: "Prefer the identity page when the object is the teacher's interpretation of a professional self.",
              source_ids: [beijaardLeiden.id, lppAspire.id],
            },
          ],
          boundary_conditions: [
            {
              condition: "The publisher HTML truncates the newcomer sentence.",
              implication: "Claims about the rest of that argument stay off this page.",
              source_ids: [lppAspire.id],
            },
            {
              condition: "A reader looks for a separate Jean Lave author record.",
              implication: "Use the published Jean Lave scholar page for the author record. This theory page does not replace it, and it does not drop Lave from the 1991 author list.",
              source_ids: [lppCrossref.id],
            },
          ],
          sources: [lppDoi, lppCrossref, lppAspire, lppOpenAlex, copCrossref, copAspire, beijaardLeiden],
          reading_path: [
            { order: 1, level: "Level 1 · Bibliographic identity", title: "Crossref 10.1017/CBO9780511815355", purpose: "Check both authors, the 1991 issue date, and the publisher.", source_id: lppCrossref.id },
            { order: 2, level: "Level 1 · Publisher description", title: "Cambridge Aspire page", purpose: "Read the visible account of situated learning and legitimate peripheral participation, and stop at the truncation.", source_id: lppAspire.id },
            { order: 3, level: "Level 2 · Page boundary", title: "Separate the 1998 book", purpose: "Use the communities-of-practice page for the later monograph.", source_id: copCrossref.id },
            { order: 4, level: "Level 3 · Design", title: "Evidence the process", purpose: "Require access and a change in participation before using the term.", source_id: lppAspire.id },
          ],
          verification: [
            l1("p1-lpp-biblio", `theories[slug="${lppSlug}"].content.en.origins`, "Crossref records Situated Learning as a Cambridge University Press monograph by Jean Lave and Etienne Wenger, issued 27 September 1991.", lppCrossref.id, "Crossref message title, author, publisher, issued, type; checked 2026-11-11"),
            l1("p1-lpp-process", `theories[slug="${lppSlug}"].content.en.what_is_it`, "The Cambridge Aspire page describes situated learning as a social process and legitimate peripheral participation as its central characteristic, with learners moving toward fuller participation in a community's practices.", lppAspire.id, "Visible Aspire description, checked 2026-11-11; occupational labels are the page's own wording"),
            l2("p1-lpp-not-cop", `theories[slug="${lppSlug}"].content.en.genealogy`, "The page split from the 1998 book is editorial. It follows the two Crossref records rather than a claim that one book contains the other."),
            l2("p1-lpp-no-lave-page", `theories[slug="${lppSlug}"].content.en.misuse_risks`, "The 1991 book page and this theory page do not replace the Jean Lave scholar page. That separation is editorial. It does not remove Lave from the 1991 author list."),
            l3("p1-lpp-guidance", `theories[slug="${lppSlug}"].content.en.fit_writing`, "Requiring evidence of access and changing participation is design guidance, not a finding of the publisher page."),
          ],
        },
      },
    },
    {
      slug: lifeSlug,
      primary: false,
      depth: "D2",
      titleEn: "Life course perspective",
      summaryEn: "Use this page when the question is how a life, including a school pathway, sits in historical time. The opened Routledge page says Children of the Great Depression was first published in 1974 and describes 167 people born in 1920–1921 in Oakland. That cohort is not a universal causal law. The 2018 DOI is a later bibliographic layer.",
      status: "published",
      publishedAt: P1_FLAGSHIP_PUBLISHED_AT,
      content: {
        en: {
          theory_nature: {
            kind: "framework",
            label: "Perspective, not a law",
            explanation: "This page uses 'perspective' because the handbook presents a family of perspectives and methods, and because Elder's book is a cohort study rather than a named law.",
            source_ids: [lifeCourseHandbook.id, elderRoutledge.id],
          },
          what_is_it: "Ask whether the study is about a life or a school pathway in historical time, and whether one cohort can stand in for every later group. The Routledge page for the 25th anniversary edition (https://www.routledge.com/Children-Of-The-Great-Depression-25th-Anniversary-Edition/Elder/p/book/9780813333427) says Children of the Great Depression was first published in 1974 and describes a longitudinal study of 167 people born in 1920-1921, followed from elementary school in Oakland, California, into the 1960s. That page cannot by itself prove a 1974 publisher title page, and it does not license a universal causal law. Edition layers belong on the work page. For an education question, the public abstract of Aaron M. Pallas's chapter Educational Transitions, Trajectories, and Pathways says it draws on the life course concern with age, aging, and historical time. The Springer page showed a subscription preview, not the chapter. This page does not add models, samples, or findings from the unread chapter. Editorial prompt, not an author result: name the cohort, the historical period, and the transition you can actually observe.",
          origins: "Version detail for choosing an edition is on the work page. The facts kept here are the ones a theory choice needs. The Routledge page says the book was first published in 1974 and describes the Oakland cohort of 167 people born in 1920-1921, followed from elementary school into the 1960s, and says the anniversary edition adds a chapter on the war years. The UNC books page lists a 1999 record marked published 1974, ISBN 978-0813333427. The Carolina Population Center bibliography records a 1999 Westview Press edition. Crossref dates DOI 10.4324/9780429501739 to 8 October 2018 and names Routledge. None of those opened pages displays a 1974 publisher title page, so this page does not name one. Crossref records the Handbook of the Life Course, edited by Jeylan T. Mortimer and Michael J. Shanahan, as issued in 2003. That handbook record is not a reading of the Pallas chapter. The UNC about page's 'prominent figure' wording is not a law and not a claim of sole origin.",
          core_concepts: [
            {
              name: "Lives across age phases",
              definition: "The handbook page presents the field as the study of lives across age phases, using more than one perspective and method.",
              relevance: "A single cross-section with no temporal question is a weak fit.",
            },
            {
              name: "Transitions and trajectories",
              definition: "The public abstract of the Pallas chapter names educational transitions, trajectories, and pathways in relation to age, aging, and historical time. The chapter body was not opened, so this page does not restate chapter findings.",
              relevance: "This is the education wording this page uses.",
            },
            {
              name: "Historical cohort",
              definition: "The Routledge page specifies a Depression cohort born in 1920-1921 in Oakland, followed into the 1960s, rather than a timeless individual.",
              relevance: "The classic study is historical. It is not a template to paste onto every cohort.",
            },
            {
              name: "Edition layers",
              definition: "1974 first publication, a 1999 record, a Westview 1999 bibliography line, and a 2018 Routledge DOI are different bibliographic layers.",
              relevance: "Citing the DOI does not cite the 1974 printing.",
            },
          ],
          genealogy: [
            {
              related_theory: identitySlug,
              relationship: "compared_with",
              description: "Teacher professional identity asks how teachers interpret a professional self. The life-course perspective asks how lives and educational pathways unfold in time. Shared interest in biography is not the same question.",
              source_ids: [pallasChapter.id, beijaardLeiden.id],
            },
            {
              related_theory: copSlug,
              relationship: "distinct_from",
              description: "A community of practice is a unit of social learning in the 1998 book. It is not a life-course trajectory.",
              source_ids: [copAspire.id, lifeCourseHandbook.id],
            },
          ],
          applicable_topics: [
            {
              topic: "How a schooling sequence, and the transitions inside it, relates to later parts of a life",
              rationale: "That is the question the opened Pallas chapter page can support.",
            },
            {
              topic: "A historically located cohort, where time and place are part of the design",
              rationale: "The Routledge page's Oakland study is this kind of design, not a universal biography.",
            },
            {
              topic: "A comparison of perspectives and methods for studying lives across age",
              rationale: "The handbook page presents itself as that overview, at handbook level in 2003.",
            },
          ],
          inapplicable_topics: [
            {
              topic: "A search for Elder's law or a single life-course equation",
              rationale: "The opened sources present a perspective, a handbook, and a cohort study. They do not present a law.",
            },
            {
              topic: "An inequality estimate that the study has not designed",
              rationale: "The education anchor supports trajectories, transitions, and later outcomes. It does not supply a result the chapter page did not show.",
            },
          ],
          misuse_risks: [
            "Writing 'Elder's law' or treating the perspective as one falsifiable sentence.",
            "Citing DOI 10.4324/9780429501739 as if it were the 1974 printing.",
            "Inventing a chapter publication date for Pallas when the Crossref chapter issued field was empty.",
            "Treating Springer or Taylor & Francis HTML as an open full text because the page returned HTTP 200.",
            "Using an OpenAlex or Crossref citation count as a scholarly conclusion.",
          ],
          analysis_dimensions: [
            "Which edition of Children of the Great Depression is being cited",
            "Whether the education question is a trajectory and its transitions",
            "What historical time and place are specified",
            "Which later outcome is actually in the design",
          ],
          data_collection: [
            {
              dimension: "Educational trajectory",
              indicators: ["Ordered school transitions", "Timing of those transitions"],
              collection_prompt: "Build the sequence of educational transitions before interpreting a later outcome. The Pallas page supports that object. It does not hand over a ready inequality model.",
            },
            {
              dimension: "Historical location",
              indicators: ["Birth years", "Place", "The historical event the study claims mattered"],
              collection_prompt: "If the design cites Elder's Oakland study, keep its cohort, place, and period attached. Do not generalize the 167-person study without a new design.",
            },
            {
              dimension: "Edition used",
              indicators: ["ISBN or DOI", "Year printed on the copy", "Whether a later chapter is included"],
              collection_prompt: "Record which layer was read: 1974 first publication as stated by Routledge, the 1999 records, or the 2018 DOI.",
            },
          ],
          chapter_structure: [
            {
              chapter: "Perspective, not law",
              purpose: "Say what kind of claim the page allows.",
              theory_use: "Refuse a single-author law.",
            },
            {
              chapter: "Education question",
              purpose: "Anchor the schooling question to the Pallas chapter and state the handbook year only.",
              theory_use: "Do not date the chapter separately.",
            },
            {
              chapter: "Classic study and editions",
              purpose: "Separate 1974, 1999, Westview, and the 2018 DOI.",
              theory_use: "Quote the edition that was actually used.",
            },
            {
              chapter: "Design limits",
              purpose: "Say what would count as a trajectory finding and what would overclaim inequality.",
              theory_use: "Match the claim to the opened chapter wording.",
            },
          ],
          fit_writing: [
            "Use this perspective when the question needs lives in historical time, or educational trajectories and transitions, and the study can specify timing and context.",
            "Do not use the Oakland cohort as a general result about educational inequality.",
          ],
          explanatory_mechanisms: [
            {
              mechanism: "Educational transitions inside a trajectory",
              process: "The Pallas page treats movement through schooling as a sequence of transitions that can be studied both as an outcome and as something that shapes later parts of a life.",
              evidence_focus: "The sequence, the transitions, and the later outcome the study is actually able to observe.",
              source_ids: [pallasChapter.id],
            },
            {
              mechanism: "Historical disruption in a located cohort",
              process: "The Routledge page presents the Depression study as following a named Oakland birth cohort and assessing how the economic crisis entered their lives.",
              evidence_focus: "Cohort, place, period, and the life-course outcome named in that design.",
              source_ids: [elderRoutledge.id],
            },
          ],
          analysis_unit: "A life or cohort pathway in historical time, including an educational trajectory when that is the question.",
          theory_comparisons: [
            {
              theory: "Teacher professional identity",
              role: "main_candidate",
              shared_focus: "Biography and change can appear in both.",
              difference: "The identity page interprets a professional self. This page interprets pathways, transitions, and historical location.",
              when_prefer: "Prefer the identity page when the object is professional self-interpretation rather than a life pathway.",
              source_ids: [beijaardLeiden.id, pallasChapter.id],
            },
            {
              theory: "Communities of practice (1998)",
              role: "alternative",
              shared_focus: "Both can be proposed for studies of learning.",
              difference: "The 1998 page is a social theory of learning whose unit is an informal community. It does not date a cohort or an educational trajectory.",
              when_prefer: "Prefer the 1998 page when shared practice, not a life pathway, is the object.",
              source_ids: [copAspire.id, lifeCourseHandbook.id],
            },
          ],
          boundary_conditions: [
            {
              condition: "Crossref's chapter-level issued field is empty.",
              implication: "Write the handbook year 2003 only. Do not invent a Pallas chapter date, even where a publisher citation line prints 2003.",
              source_ids: [pallasCrossref.id, lifeCourseHandbookCrossref.id],
            },
            {
              condition: "The 1974 publisher is not named on the opened Routledge, UNC, CPC, or Crossref records.",
              implication: "State first publication in 1974 without naming a press.",
              source_ids: [elderRoutledge.id, elderBooks.id],
            },
          ],
          sources: [
            elderRoutledge,
            elderDoi,
            elderCrossref,
            lifeCourseHandbook,
            lifeCourseHandbookCrossref,
            pallasChapter,
            pallasCrossref,
            elderBooks,
            elderCpc,
            elderAbout,
            beijaardLeiden,
            copAspire,
          ],
          reading_path: [
            { order: 1, level: "Level 1 · Handbook", title: "Handbook of the Life Course", purpose: "Check the 2003 handbook-level record and the overview of perspectives.", source_id: lifeCourseHandbookCrossref.id },
            { order: 2, level: "Level 1 · Education chapter", title: "Pallas chapter page", purpose: "Use the trajectory wording, and do not add a chapter date.", source_id: pallasChapter.id },
            { order: 3, level: "Level 1 · Editions", title: "Routledge 25th, DOI, UNC books, CPC", purpose: "Keep 1974, 1999, Westview, and the 2018 DOI apart.", source_id: elderRoutledge.id },
            { order: 4, level: "Level 2 · Not a law", title: "Perspective boundary", purpose: "Read Elder's UNC about-page role as a contributor's page, not as a law.", source_id: elderAbout.id },
            { order: 5, level: "Level 3 · Design", title: "Match the question", purpose: "Use the education anchor only for trajectories, transitions, and later outcomes the design can support.", source_id: pallasChapter.id },
          ],
          verification: [
            l1("p1-lc-handbook-year", `theories[slug="${lifeSlug}"].content.en.origins`, "Crossref records Handbook of the Life Course, editors Jeylan T. Mortimer and Michael J. Shanahan, publisher Springer US, issued 2003.", lifeCourseHandbookCrossref.id, "Crossref issued date-parts and editor array; checked 2026-11-11"),
            l1("p1-lc-pallas-wording", `theories[slug="${lifeSlug}"].content.en.what_is_it`, "The Springer chapter page presents Pallas's chapter as a study of how schooling unfolds, including the paths people take, the changes that mark those paths, and the common routes that shape them, and as a study of movement through schooling that can also shape later outcomes.", pallasChapter.id, "Springer chapter abstract; re-read 2026-11-11. The abstract continues through the common-routes clause."),
            l1("p1-lc-pallas-issued-empty", `theories[slug="${lifeSlug}"].content.en.boundary_conditions`, "Crossref's issued field for the Pallas chapter was an empty date-part on 2026-11-11. This page therefore states only the handbook year.", pallasCrossref.id, "Crossref message.issued.date-parts; checked 2026-11-11"),
            l1("p1-lc-1974", `theories[slug="${lifeSlug}"].content.en.origins`, "The Routledge 25th-anniversary page says the work was first published in 1974 and describes the Oakland cohort of 167 people born in 1920-1921.", elderRoutledge.id, "Routledge product description; checked 2026-11-11"),
            l1("p1-lc-doi-2018", `theories[slug="${lifeSlug}"].content.en.origins`, "Crossref records DOI 10.4324/9780429501739 as a Routledge book by Glen H. Elder issued 8 October 2018, ISBN 9780429501739.", elderCrossref.id, "Crossref issued, publisher, ISBN; checked 2026-11-11"),
            l1("p1-lc-unc-1999", `theories[slug="${lifeSlug}"].content.en.origins`, "The UNC books page lists a 1999 record of Children of the Great Depression marked published 1974, with ISBN 978-0813333427.", elderBooks.id, "UNC books page entry for the 25th anniversary record; checked 2026-11-11"),
            l1("p1-lc-cpc-1999", `theories[slug="${lifeSlug}"].content.en.origins`, "The Carolina Population Center bibliography records Elder, Glen H., Jr. (1999), Children of the Great Depression: Social Change in Life Experience, Westview Press, Boulder.", elderCpc.id, "CPC bib 943; checked 2026-11-11"),
            l2("p1-lc-not-law", `theories[slug="${lifeSlug}"].content.en.theory_nature`, "Calling the page a perspective rather than a law is editorial. The UNC about page's phrase 'prominent figure in the development' is not rewritten here as sole authorship of a paradigm."),
            l2("p1-lc-inequality-limit", `theories[slug="${lifeSlug}"].content.en.inapplicable_topics`, "The education-inequality question is limited to the trajectory and later-outcome wording on the opened Pallas page. A stronger inequality claim is not sourced on this page."),
            l3("p1-lc-guidance", `theories[slug="${lifeSlug}"].content.en.fit_writing`, "Refusing to generalize the Oakland cohort is design guidance. It is not a result reported by the publisher page."),
          ],
        },
      },
    },
  ];

  const works: SeedWork[] = [
    {
      slug: P1_FLAGSHIP_DRAFT_WORK_SLUG,
      title: "Reconsidering research on teachers' professional identity",
      authors: [
        { name: "Douwe Beijaard" },
        { name: "Paulien C. Meijer" },
        { name: "Nico Verloop" },
      ],
      year: 2004,
      publisher: "Elsevier BV",
      doi: "10.1016/j.tate.2003.07.001",
      status: "published",
      publishedAt: P1_FLAGSHIP_PUBLISHED_AT,
      content: {
        en: {
          overview: "A 2004 review article in Teaching and Teacher Education by Douwe Beijaard, Paulien C. Meijer, and Nico Verloop, journal pages 107–128. Use this page to confirm you are citing that review, to see how it sorts the studies, and to open the legal PDF. The four features are explained on the theory page from journal pages 122–123, section 6.1. This article is not an experiment and not an open ScienceDirect text.",
          card_summary: "2004 review by Beijaard, Meijer, and Verloop, pages 107–128. It sorts studies into three kinds and is not an experiment. The legal PDF is the Leiden repository copy. Feature-by-feature reading is on the theory page, journal pages 122–123.",
          argument_heading: "Review type and coverage",
          core_question: "Is the citation this 2004 review, which study type does it match, and where are the four features actually printed?",
          central_argument: "The review sorts the studies it read into formation studies, studies that try to identify characteristics, and studies that present identity through teachers' stories. It says definitions were inconsistent or missing. From the formation and story studies it names four features in section 6.1: an ongoing interpretive process, person and context, sub-identities, and agency. The feature-by-feature account, tied to journal pages 122–123 of the legal PDF, is on the theory page so this page does not repeat it. The review also says that many of the studies were really about personal practical knowledge, and that the link to professional identity was often assumed. Check a citation against that sorting before treating a quotation as one of the four features.",
          theoretical_contribution: "The article is a review and reconceptualization. Its contribution on this page is that sorting, those four features, and the list of problems it says later work should face, including the relation of self and identity, the role of context, what counts as professional, and perspectives other than a cognitive one. It is not presented as the founding experiment of a field, and it is not a substitute for a 2000 article.",
          reading_focus: [
            "Read the three study types before adopting a definition the review says was often missing.",
            "Read section 6.1 for the four features, and keep them as the review's proposal rather than as a settled consensus.",
            "Keep the February 2004 issue date distinct from the 2002-2003 receipt and acceptance dates on the repository copy.",
            "Use the Leiden handle and the DOI. Do not paste an abstract, and do not treat Elsevier HTML as open full text.",
          ],
          legal_access: [
            {
              label: "DOI",
              guidance: "The DOI is the stable identifier. A resolving DOI is not an open copy of the Elsevier HTML.",
              source_id: beijaardDoi.id,
            },
            {
              label: "Crossref",
              guidance: "Use the Crossref record for authors, journal, volume, issue, pages, and the February 2004 issue date.",
              source_id: beijaardCrossref.id,
            },
            {
              label: "Leiden repository handle",
              guidance: "The public bibliographic URL is the handle HTML. The repository copy was read for the argument. The unstable download query is not listed as the source URL.",
              source_id: beijaardLeiden.id,
            },
          ],
          sources: [beijaardDoi, beijaardCrossref, beijaardLeiden, beijaardOpenAlex],
          verification: [
            l1("p1-work-2004-biblio", `works[slug="${P1_FLAGSHIP_DRAFT_WORK_SLUG}"].title`, "The work is the 2004 article by Beijaard, Meijer, and Verloop in Teaching and Teacher Education 20(2), 107-128.", beijaardCrossref.id, "Crossref bibliographic fields; checked 2026-11-11"),
            l1("p1-work-2004-argument", `works[slug="${P1_FLAGSHIP_DRAFT_WORK_SLUG}"].content.en.central_argument`, "The repository copy supports the three study types and the four features in section 6.1.", beijaardLeiden.id, "Handle 1887/11190 repository copy, section 6.1; read 2026-11-11"),
            l2("p1-work-2004-not-experiment", `works[slug="${P1_FLAGSHIP_DRAFT_WORK_SLUG}"].content.en.theoretical_contribution`, "Calling the article a review and reconceptualization, rather than a founding experiment, is the editorial boundary required for this flagship work."),
            l3("p1-work-2004-reading", `works[slug="${P1_FLAGSHIP_DRAFT_WORK_SLUG}"].content.en.reading_focus`, "The reading order is guidance for using the review. It is not part of the article's own instructions."),
          ],
        },
      },
    },
  ];

  const scholars: SeedScholar[] = [
    {
      slug: "douwe-beijaard",
      name: "Douwe Beijaard",
      bioEn: "Coauthor of the 2004 review of research on teachers' professional identity, with Paulien C. Meijer and Nico Verloop. The TU/e profile says Full Professor emeritus. An ORCID employment line is a different record and does not replace that title.",
      status: "published",
      publishedAt: P1_FLAGSHIP_PUBLISHED_AT,
      content: {
        en: {
          overview: "Read this page to attribute the 2004 review, not to give Douwe Beijaard a personal theory of teacher identity. He is a coauthor with Paulien C. Meijer and Nico Verloop. The TU/e research portal titles the profile Full Professor emeritus. The ORCID public record 0000-0002-0065-1810 returns the name Douwe Beijaard and an employment summary of Professor at Eindhoven University of Technology from 2007 with no end year. Those are two records. This page does not collapse them into one title, and it does not use a social-media biography.",
          academic_identity: {
            discipline: "Education research",
            role: "Full Professor emeritus on the TU/e portal checked 2026-11-11; ORCID employment summary says Professor at Eindhoven University of Technology from 2007 with no end year",
            source_ids: [tueBeijaard.id, orcidBeijaardApi.id],
          },
          theory_relationships: [
            {
              theory_slug: identitySlug,
              relationship: "Key contributor to the flagship review",
              description: "Beijaard is the first author of the 2004 review that this page uses as the flagship text for the teacher-professional-identity construct. The relation is not a founder claim.",
              source_ids: [beijaardCrossref.id, tueBeijaard.id],
            },
          ],
          representative_works: [
            {
              title: "Reconsidering research on teachers' professional identity",
              work_slug: P1_FLAGSHIP_DRAFT_WORK_SLUG,
              contribution: "Coauthored 2004 review. The Crossref author order is Douwe Beijaard, Paulien C. Meijer, Nico Verloop.",
              source_ids: [beijaardCrossref.id],
            },
          ],
          scholarly_relations: [
            {
              kind: "collaboration",
              description: "Crossref lists Paulien C. Meijer and Nico Verloop as coauthors of this specific 2004 article. That is coauthorship of one article, not a map of a career network. This page does not turn the coauthors into separate theory owners.",
              source_ids: [beijaardCrossref.id],
            },
          ],
          attribution_boundaries: [
            "Do not call teacher professional identity a Beijaard theory.",
            "Do not treat the 2004 article as a founding field experiment.",
            "Do not replace the 2004 flagship work with a different Beijaard article.",
            "Do not merge the TU/e emeritus label and the ORCID employment summary into one unverified current-status sentence.",
          ],
          reading_path: [
            { order: 1, title: "TU/e research portal", purpose: "Check the emeritus title on the institutional page.", source_id: tueBeijaard.id },
            { order: 2, title: "ORCID public API", purpose: "Check the name and the 2007 employment summary, including the absent end year.", source_id: orcidBeijaardApi.id },
            { order: 3, title: "2004 review", purpose: "Read the flagship work before attributing a theory.", source_id: beijaardLeiden.id },
          ],
          sources: [tueBeijaard, orcidBeijaard, orcidBeijaardApi, openAlexBeijaard, beijaardDoi, beijaardCrossref, beijaardLeiden],
          verification: [
            l1("p1-beijaard-name", "scholars[slug=\"douwe-beijaard\"].name", "ORCID public API returns given name Douwe and family name Beijaard for 0000-0002-0065-1810.", orcidBeijaardApi.id, "ORCID person.name; checked 2026-11-11"),
            l1("p1-beijaard-emeritus", "scholars[slug=\"douwe-beijaard\"].content.en.academic_identity.role", "The TU/e portal page titles the profile Full Professor emeritus.", tueBeijaard.id, "Portal HTML title and profile heading; checked 2026-11-11"),
            l1("p1-beijaard-employment", "scholars[slug=\"douwe-beijaard\"].content.en.academic_identity.role", "The ORCID employment summary lists Professor at Eindhoven University of Technology starting in 2007, with no end year in that summary.", orcidBeijaardApi.id, "activities-summary employments; checked 2026-11-11"),
            l2("p1-beijaard-not-founder", "scholars[slug=\"douwe-beijaard\"].content.en.attribution_boundaries", "The key-contributor wording and the refusal of a founder claim are editorial."),
            l3("p1-beijaard-reading", "scholars[slug=\"douwe-beijaard\"].content.en.reading_path", "Reading the institutional page before the article is a suggested order, not a claim about the scholar."),
          ],
        },
      },
    },
    {
      slug: "etienne-wenger-flagship",
      name: "Etienne Wenger",
      bioEn: "Author of the 1998 book Communities of Practice and coauthor, with Jean Lave, of the 1991 book Situated Learning. This page states no current employer. It does not decide whether another database surname is the same person.",
      status: "published",
      publishedAt: P1_FLAGSHIP_PUBLISHED_AT,
      content: {
        en: {
          overview: "Read this page for the author of the 1998 book and a coauthor of the 1991 book. The public heading uses Etienne Wenger. Crossref gives that spelling, without an accent, for both monographs. OpenAlex author A5018954657 displays Étienne Wenger and has an empty ORCID field. No university about-page was in the verified source set, so this page states no current appointment, degree, or personal site. The Cambridge page for the 1991 book calls Wenger a computer scientist. That label stays the publisher's wording. It is not a CV. Jean Lave is the other Crossref author of the 1991 book and has her own scholar page. Another database surname was not compared with this row, so this page does not say it names a different person.",
          academic_identity: {
            discipline: "Learning theory, as the author of the cited books",
            role: "1998 Crossref author of Communities of Practice; 1991 Crossref coauthor of Situated Learning. No institutional appointment is stated.",
            source_ids: [copCrossref.id, lppCrossref.id, openAlexWenger.id],
          },
          theory_relationships: [
            {
              theory_slug: copSlug,
              relationship: "Author of the 1998 book",
              description: "Wenger is the sole Crossref author of the 1998 monograph this page uses for communities of practice. That is authorship of the book, not ownership of every later use of the phrase.",
              source_ids: [copCrossref.id],
            },
            {
              theory_slug: lppSlug,
              relationship: "Coauthor of the 1991 book",
              description: "Wenger is one of two Crossref authors of the 1991 book. The relation does not make the 1991 book a sole-authored theory.",
              source_ids: [lppCrossref.id],
            },
          ],
          representative_works: [
            {
              title: "Communities of Practice: Learning, Meaning, and Identity",
              work_slug: "wenger-1998-communities-of-practice",
              contribution: "1998 monograph. Crossref author: Etienne Wenger. Cambridge Aspire is the description used on the theory page.",
              source_ids: [copCrossref.id, copAspire.id],
            },
            {
              title: "Situated Learning: Legitimate Peripheral Participation",
              work_slug: "lave-and-wenger-1991-situated-learning",
              contribution: "1991 monograph coauthored with Jean Lave. This is not the 1998 book.",
              source_ids: [lppCrossref.id],
            },
          ],
          scholarly_relations: [
            {
              kind: "collaboration",
              description: "Crossref lists Jean Lave and Etienne Wenger as coauthors of the 1991 book only. This page does not infer a wider partnership. Lave's scholar page is a separate record.",
              source_ids: [lppCrossref.id],
            },
          ],
          attribution_boundaries: [
            "Do not merge OpenAlex author A5018954657 with another database row that was not checked. This page does not decide whether a different surname names a different person.",
            "Do not treat alias strings on the OpenAlex row as proof of the 1998 author identity.",
            "Do not describe Wenger as the sole author of the 1991 book.",
            "Do not invent an employer or an official personal site. That point was left unresolved in the source ledger.",
            "Do not equate a management slogan with the 1998 book.",
          ],
          reading_path: [
            { order: 1, title: "1998 Crossref and Cambridge page", purpose: "Start with the sole-authored book and its visible description.", source_id: copAspire.id },
            { order: 2, title: "1991 Crossref and Cambridge page", purpose: "Keep the coauthored book on the other theory page.", source_id: lppAspire.id },
            { order: 3, title: "OpenAlex author row", purpose: "Check the display name and the empty ORCID, and stop there.", source_id: openAlexWenger.id },
          ],
          sources: [copDoi, copCrossref, copAspire, lppDoi, lppCrossref, lppAspire, openAlexWenger],
          verification: [
            l1("p1-wenger-1998-author", "scholars[slug=\"etienne-wenger-flagship\"].content.en.academic_identity.role", "Crossref names Etienne Wenger as the author of the 1998 monograph Communities of Practice.", copCrossref.id, "Crossref author array; checked 2026-11-11"),
            l1("p1-wenger-1991-coauthor", "scholars[slug=\"etienne-wenger-flagship\"].content.en.scholarly_relations", "Crossref names Jean Lave and Etienne Wenger as the authors of the 1991 monograph Situated Learning.", lppCrossref.id, "Crossref author array; checked 2026-11-11"),
            l1("p1-wenger-openalex", "scholars[slug=\"etienne-wenger-flagship\"].content.en.overview", "OpenAlex A5018954657 displays Étienne Wenger and has no ORCID.", openAlexWenger.id, "Author JSON display_name and orcid; checked 2026-11-11"),
            l2("p1-wenger-no-merge", "scholars[slug=\"etienne-wenger-flagship\"].content.en.attribution_boundaries", "Refusing to merge an unchecked database row, and refusing to invent an employer or to decide that another surname is a different person, are editorial limits."),
            l3("p1-wenger-reading", "scholars[slug=\"etienne-wenger-flagship\"].content.en.reading_path", "The reading order is guidance for keeping the two books apart."),
          ],
        },
      },
    },
    {
      slug: "glen-h-elder-jr-flagship",
      name: "Glen H. Elder, Jr.",
      bioEn: "Sociologist identified on his UNC page as Howard W. Odum Distinguished Research Professor of Sociology and a Fellow of the Carolina Population Center. Use this record for that appointment and for the Children of the Great Depression cohort study. The page's 'prominent figure' wording is not a law.",
      status: "published",
      publishedAt: P1_FLAGSHIP_PUBLISHED_AT,
      content: {
        en: {
          overview: "Read this page when you need the author of the Oakland cohort study and the appointment on his UNC page, not a law of the life course. The UNC about page titles Glen H. Elder, Jr. Howard W. Odum Distinguished Research Professor of Sociology at the University of North Carolina at Chapel Hill and Fellow of the Carolina Population Center. It describes him as a prominent figure in the development of life-course theory, methods, and research. It says he came to the perspective after graduate work in sociology and psychology at UNC, dated 1961 on the page, and a faculty appointment at the University of California, Berkeley. An early book application is dated on that page as 1974/1999. Later collaborative studies on the same page, including the rural Midwest, Philadelphia, and a book with Rick Settersten and Lisa Pearce, stay inside that page's wording. This page does not add honors beyond the page, and it does not name a first-edition publisher for Children of the Great Depression. It does not call the perspective Elder's law. OpenAlex A5110302150 displays Glen H. Elder and has an empty ORCID. That row is a discovery check only.",
          academic_identity: {
            discipline: "Sociology",
            role: "Howard W. Odum Distinguished Research Professor of Sociology, University of North Carolina at Chapel Hill; Fellow, Carolina Population Center, as stated on the UNC about page",
            source_ids: [elderAbout.id],
          },
          theory_relationships: [
            {
              theory_slug: lifeSlug,
              relationship: "Key contributor",
              description: "Elder's Children of the Great Depression is the classic cohort study on this page, and the UNC page describes his role in developing life-course research. The relation is not a claim that he authored a law or every life-course tradition.",
              source_ids: [elderAbout.id, elderRoutledge.id],
            },
          ],
          representative_works: [
            {
              title: "Children of the Great Depression",
              work_slug: "elder-children-of-the-great-depression",
              contribution: "Cohort study. Routledge dates first publication to 1974 and describes the Oakland cohort. UNC lists a 1999 record marked published 1974. CPC lists a 1999 Westview edition. Crossref dates DOI 10.4324/9780429501739 to 8 October 2018. The first-edition publisher is not verified. 2018 is not the origin year.",
              source_ids: [elderRoutledge.id, elderBooks.id, elderCpc.id, elderCrossref.id],
            },
          ],
          scholarly_relations: [
            {
              kind: "collaboration",
              description: "The UNC books page names Rand D. Conger as coauthor of Children of the Land and names Richard A. Settersten Jr. and Lisa A. Pearce as coauthors of Living on the Edge. Those are title-specific coauthor credits, not a general network.",
              source_ids: [elderBooks.id],
            },
          ],
          attribution_boundaries: [
            "Do not write Elder's law or treat the life-course perspective as his sole creation.",
            "Do not cite the 2018 DOI as the 1974 printing.",
            "The first-edition publisher is not verified. The work page does not treat an internal bibliography as a 1974 title page.",
            "Do not use OpenAlex citation counts as evidence of influence.",
            "The archived scholar record with another slug is not this page and is not published by this batch.",
          ],
          reading_path: [
            { order: 1, title: "UNC about page", purpose: "Check the appointment and the page's own account of the perspective.", source_id: elderAbout.id },
            { order: 2, title: "Routledge 25th anniversary page", purpose: "Read the 1974 statement and the cohort description.", source_id: elderRoutledge.id },
            { order: 3, title: "UNC books and CPC bibliography", purpose: "Keep the 1999 records distinct from the 2018 DOI.", source_id: elderBooks.id },
            { order: 4, title: "Pallas chapter", purpose: "Use the education question on the theory page, not as a claim that Elder wrote that chapter.", source_id: pallasChapter.id },
          ],
          sources: [elderAbout, elderBooks, elderCpc, openAlexElder, elderRoutledge, elderDoi, elderCrossref, pallasChapter],
          verification: [
            l1("p1-elder-title", "scholars[slug=\"glen-h-elder-jr-flagship\"].content.en.academic_identity.role", "The UNC about page identifies Glen H. Elder, Jr. as Howard W. Odum Distinguished Research Professor of Sociology at UNC Chapel Hill and a Fellow of the Carolina Population Center.", elderAbout.id, "About page heading and appointment lines; checked 2026-11-11"),
            l1("p1-elder-perspective-wording", "scholars[slug=\"glen-h-elder-jr-flagship\"].content.en.overview", "The same page calls him a prominent figure in the development of life course theory, methods, and research, and dates graduate work at UNC to 1961 and an early book application to 1974/1999.", elderAbout.id, "About page narrative; checked 2026-11-11"),
            l1("p1-elder-openalex", "scholars[slug=\"glen-h-elder-jr-flagship\"].content.en.overview", "OpenAlex A5110302150 displays Glen H. Elder and has no ORCID.", openAlexElder.id, "Author JSON display_name and orcid; checked 2026-11-11"),
            l2("p1-elder-not-law", "scholars[slug=\"glen-h-elder-jr-flagship\"].content.en.attribution_boundaries", "Refusing a law claim and a sole-origin claim is editorial. The about page's 'prominent figure' wording is not rewritten as a founder verdict."),
            l3("p1-elder-reading", "scholars[slug=\"glen-h-elder-jr-flagship\"].content.en.reading_path", "The reading order is guidance for keeping editions and the Pallas chapter distinct."),
          ],
        },
      },
    },
  ];

  const theoryWorks: SeedTheoryWork[] = [
    {
      theorySlug: identitySlug,
      workSlug: P1_FLAGSHIP_DRAFT_WORK_SLUG,
      relationship: "synthesis",
      sourceUrls: [beijaardDoi.url, beijaardCrossref.url, beijaardLeiden.url],
      evidenceNotesEn: "The 2004 article is the review this page uses for the teacher-professional-identity construct. The relation is editorial and is not a claim that the article founded a field.",
    },
  ];

  const theoryScholars: SeedTheoryScholar[] = [
    {
      theorySlug: identitySlug,
      scholarSlug: "douwe-beijaard",
      role: "key_contributor",
      sourceUrls: [beijaardCrossref.url],
      evidenceNotesEn: "First author of the 2004 review. Key contributor is editorial and is narrower than founder.",
    },
    {
      theorySlug: copSlug,
      scholarSlug: "etienne-wenger-flagship",
      role: "key_contributor",
      sourceUrls: [copCrossref.url],
      evidenceNotesEn: "Sole Crossref author of the 1998 book. The role is not a claim over later uses of the phrase.",
    },
    {
      theorySlug: lppSlug,
      scholarSlug: "etienne-wenger-flagship",
      role: "key_contributor",
      sourceUrls: [lppCrossref.url],
      evidenceNotesEn: "Coauthor of the 1991 book. Jean Lave is the other author and has a separate scholar page. The 1991 book is not rewritten as a 1998 sole-authored book.",
    },
    {
      theorySlug: lifeSlug,
      scholarSlug: "glen-h-elder-jr-flagship",
      role: "key_contributor",
      sourceUrls: [elderRoutledge.url],
      evidenceNotesEn: "Author of the cohort study named on the Routledge page. The role is not a law and not sole ownership of the perspective.",
    },
  ];

  return { theories, works, scholars, theoryWorks, theoryScholars };
}
