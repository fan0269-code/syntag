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
 * 2026-11-11 cluster batch. Owner 林文 approved the scope at 09:15 Asia/Shanghai.
 * Corpus status may be published so a later authorized import can select these
 * rows. This file does not import, seed, or write a database.
 * Archived slugs stay archived. Advertising stays off.
 */
export const CLUSTER_VERIFIED_AT = "2026-11-11T00:00:00.000Z";
export const CLUSTER_PUBLISHED_AT = "2026-11-11T00:00:00.000Z";

export const CLUSTER_WORK_SLUGS = [
  "wenger-1998-communities-of-practice",
  "lave-and-wenger-1991-situated-learning",
  "elder-children-of-the-great-depression",
  "kingdon-agendas-alternatives-and-public-policies",
] as const;

export const CLUSTER_THEORY_SLUG = "multiple-streams-education-policy";
export const CLUSTER_SCHOLAR_SLUG = "jean-lave-flagship";
export const KINGDON_WORK_SLUG = CLUSTER_WORK_SLUGS[3];
export const KINGDON_SCHOLAR_SLUG = "john-w-kingdon-flagship";

export const CLUSTER_DISCIPLINE_THEORIES: SeedTheoryDiscipline[] = [
  { disciplineSlug: "education", theorySlug: CLUSTER_THEORY_SLUG, relevance: "primary" },
];

const verifiedAt = CLUSTER_VERIFIED_AT;
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

const copDoi: ContentSource = {
  id: "c11-wenger-1998-doi",
  citation: "Wenger, E. (1998). Communities of practice: Learning, meaning, and identity. Cambridge University Press.",
  url: "https://doi.org/10.1017/CBO9780511803932",
  source_kind: "doi",
  evidence_level: "L1",
  supports: ["DOI for the 1998 monograph", "A resolving DOI is not an open full text"],
};

const copAspire: ContentSource = {
  id: "c11-wenger-1998-aspire",
  citation: "Cambridge Aspire. Communities of Practice: Learning, Meaning, and Identity.",
  url: "https://www.cambridge.org/highereducation/books/communities-of-practice/724C22A03B12D11DFC345EEF0AD3F22A",
  source_kind: "publisher",
  evidence_level: "L1",
  supports: [
    "Publisher page for the 1998 book",
    "The public description is not treated as the whole book",
  ],
};

const copCrossref: ContentSource = {
  id: "c11-wenger-1998-crossref",
  citation: "Crossref work record for 10.1017/CBO9780511803932.",
  url: "https://api.crossref.org/works/10.1017/CBO9780511803932",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: ["Bibliographic record: Etienne Wenger, Cambridge University Press, issued 28 July 1998, monograph"],
};

const lppDoi: ContentSource = {
  id: "c11-lave-wenger-1991-doi",
  citation: "Lave, J., & Wenger, E. (1991). Situated learning: Legitimate peripheral participation. Cambridge University Press.",
  url: "https://doi.org/10.1017/CBO9780511815355",
  source_kind: "doi",
  evidence_level: "L1",
  supports: ["DOI for the 1991 monograph", "A resolving DOI is not an open full text"],
};

const lppAspire: ContentSource = {
  id: "c11-lave-wenger-1991-aspire",
  citation: "Cambridge Aspire. Situated Learning: Legitimate Peripheral Participation.",
  url: "https://www.cambridge.org/highereducation/books/situated-learning/6915ABD21C8E4619F750A4D4ACA616CD",
  source_kind: "publisher",
  evidence_level: "L1",
  supports: [
    "Publisher page for the 1991 book",
    "The public description is not treated as the whole book",
  ],
};

const lppCrossref: ContentSource = {
  id: "c11-lave-wenger-1991-crossref",
  citation: "Crossref work record for 10.1017/CBO9780511815355.",
  url: "https://api.crossref.org/works/10.1017/CBO9780511815355",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: ["Bibliographic record: Jean Lave and Etienne Wenger, Cambridge University Press, issued 27 September 1991, monograph"],
};

const elderRoutledge: ContentSource = {
  id: "c11-elder-children-routledge",
  citation: "Routledge. Children of the Great Depression: 25th Anniversary Edition. Glen H. Elder, Jr.",
  url: "https://www.routledge.com/Children-Of-The-Great-Depression-25th-Anniversary-Edition/Elder/p/book/9780813333427",
  source_kind: "publisher",
  evidence_level: "L1",
  supports: [
    "Product page for the 25th anniversary edition",
    "Page statement that the work was first published in 1974",
    "The opened page does not print a 1974 University of Chicago Press title page",
  ],
};

const elderDoi: ContentSource = {
  id: "c11-elder-children-doi",
  citation: "Elder, G. H. Children of the Great Depression. Routledge. DOI 10.4324/9780429501739.",
  url: "https://doi.org/10.4324/9780429501739",
  source_kind: "doi",
  evidence_level: "L1",
  supports: [
    "DOI resolved on 2026-11-11 to the Taylor & Francis book page",
    "This DOI is the 2018 Routledge layer, not the 1974 printing",
  ],
};

const elderCrossref: ContentSource = {
  id: "c11-elder-children-crossref",
  citation: "Crossref work record for 10.4324/9780429501739.",
  url: "https://api.crossref.org/works/10.4324/9780429501739",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: ["Bibliographic record: type book, publisher Routledge, issued 8 October 2018, title Children of the Great Depression"],
};

const elderBooks: ContentSource = {
  id: "c11-elder-unc-books",
  citation: "University of North Carolina at Chapel Hill. Books by Glen H. Elder, Jr.",
  url: "https://elder.web.unc.edu/books/",
  source_kind: "university",
  evidence_level: "L1",
  supports: ["Books page dating: a 1999 record marked published 1974"],
};

const elderCpc: ContentSource = {
  id: "c11-elder-cpc-bib",
  citation: "Carolina Population Center. Children of the Great Depression: Social Change in Life Experience. Bibliography 943.",
  url: "https://www.cpc.unc.edu/resources/publications/bib/943/",
  source_kind: "university",
  evidence_level: "L1",
  supports: ["Bibliography record: Elder, Glen H., Jr. (1999), Westview Press, Boulder"],
};

const pearsonKingdon: ContentSource = {
  id: "c11-kingdon-pearson-catalog",
  citation: "Pearson. Agendas, Alternatives, and Public Policies, Update Edition, with an Epilogue on Health Care, Pearson New International Edition. John W. Kingdon.",
  url: "https://www.pearson.com/en-gb/subject-catalog/p/agendas-alternatives-and-public-policies-update-edition-with-an-epilogue-on-health-care-pearson-new-international-edition/P200000004628/9781292053875",
  source_kind: "publisher",
  evidence_level: "L1",
  supports: [
    "Catalog page for a Pearson New International update edition, author John W. Kingdon, published date 3 October 2013 on the page, copyright 2014",
    "Visible description places the book in interviews and documents about the U.S. federal government",
    "A catalog page is not an open full text and is not an education monograph",
  ],
};

const epaaDoi: ContentSource = {
  id: "c11-young-shepley-song-2010-doi",
  citation: "Young, T. V., Shepley, T. V., & Song, M. (2010). Understanding agenda setting in state educational policy. Education Policy Analysis Archives, 18(15).",
  url: "https://doi.org/10.14507/epaa.v18n15.2010",
  source_kind: "doi",
  evidence_level: "L1",
  supports: [
    "DOI for the 2010 education-policy article",
    "Resolved on 2026-11-11 to the EPAA article path /article/view/771",
  ],
};

const epaaArticle: ContentSource = {
  id: "c11-young-shepley-song-2010-epaa",
  citation: "Young, T. V., Shepley, T. V., & Song, M. (2010). Understanding agenda setting in state educational policy: An application of Kingdon's multiple streams model to the formation of state reading policy. Education Policy Analysis Archives.",
  url: "https://epaa.asu.edu/index.php/epaa/article/view/771",
  source_kind: "journal",
  evidence_level: "L1",
  supports: [
    "Article view 771: title, authors Tamara Viola Young, Thomas V. Shepley, and Mengli Song, published 2010-07-10",
    "Education-policy application of Kingdon's multiple streams model to state reading policy",
    "This path is not article view 757",
  ],
};

const epaaCrossref: ContentSource = {
  id: "c11-young-shepley-song-2010-crossref",
  citation: "Crossref work record for 10.14507/epaa.v18n15.2010.",
  url: "https://api.crossref.org/works/10.14507/epaa.v18n15.2010",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: ["Bibliographic record: journal article, issued 10 July 2010, authors Young, Shepley, and Song, container Education Policy Analysis Archives"],
};

const openAlexLave: ContentSource = {
  id: "c11-lave-openalex-api",
  citation: "OpenAlex author A5061396853. Jean Lave.",
  url: "https://api.openalex.org/authors/A5061396853",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: [
    "display_name Jean Lave, empty ORCID, last known institution University of California, Berkeley",
    "Not a citation-count conclusion and not a CV",
  ],
};

const africanStudiesLave: ContentSource = {
  id: "c11-lave-african-studies",
  citation: "UC Berkeley Center for African Studies. Jean Lave.",
  url: "https://africa.berkeley.edu/people/jean-lave",
  source_kind: "university",
  evidence_level: "L1",
  supports: [
    "Directory listing: Professor Emeritus, Department: Education, Role Emeritus, checked 2026-11-11",
    "The directory's faculty contact target was not a working page on that date and is not listed as a source",
  ],
};

const graduateLectureLave: ContentSource = {
  id: "c11-lave-graduate-lecture-2011",
  citation: "UC Berkeley Graduate Lectures. Everyday Life and Learning. Jean Lave. 3 November 2011.",
  url: "https://gradlectures.berkeley.edu/lecture/everyday-life-and-learning/",
  source_kind: "university",
  evidence_level: "L1",
  supports: [
    "2011 lecture introduction: Professor Emerita, Department of Geography, and Affiliate Professor, Departments of Geography, Anthropology, and the Energy Resources Group",
    "Lists Situated Learning (with E. Wenger, 1991) among books",
    "A 2011 lecture page is not a current department faculty homepage",
  ],
};

const lsaKingdonBibliography: ContentSource = {
  id: "c11-kingdon-lsa-bibliography",
  citation: "University of Michigan LSA Political Science. Agendas, Alternatives, and Public Policies. John W. Kingdon.",
  url: "https://lsa.umich.edu/polisci/people/emeriti/kingdon/Agendas-Alternatives-and-Public-Policies.html",
  source_kind: "university",
  evidence_level: "L1",
  supports: [
    "Opened with WebFetch on 2026-11-11. curl in this environment returned HTTP 403, a Cloudflare challenge page titled Just a moment. curl did not succeed",
    "The page names 1984 as the first publication, a 1995 reissue, and a 2011 Longman Classics edition with a new epilogue on health care reform from Clinton to Obama",
    "The page prints Publisher: Longman and Year of Publication: 1984. That line is not treated as the only verified 1984 imprint",
    "The page reprints a publisher description marked Pearson. This record does not copy that description",
  ],
};

const umPressKingdon: ContentSource = {
  id: "c11-kingdon-um-press",
  citation: "University of Michigan Press. John W. Kingdon.",
  url: "https://press.umich.edu/Contributors/K/Kingdon-John-W",
  source_kind: "publisher",
  evidence_level: "L1",
  supports: [
    "Author page opened by curl on 2026-11-11, HTTP 200",
    "Describes John W. Kingdon as Professor Emeritus of Political Science, University of Michigan",
    "Names a fellowship at Stanford University's Center for Advanced Study in Behavioral Sciences and a John Simon Guggenheim Fellowship",
    "The listed book entry is Congressmen's Voting Decisions. This page is not the bibliography for Agendas, Alternatives, and Public Policies",
  ],
};

const lsaKingdonFaculty: ContentSource = {
  id: "c11-kingdon-lsa-faculty",
  citation: "University of Michigan LSA Political Science. John Kingdon, Professor Emeritus.",
  url: "https://lsa.umich.edu/polisci/people/emeriti/kingdon.html",
  source_kind: "university",
  evidence_level: "L1",
  supports: [
    "Opened with WebFetch on 2026-11-11. curl in this environment returned HTTP 403, a Cloudflare challenge page titled Just a moment. curl did not succeed",
    "Professor Emeritus of Political Science at the University of Michigan in Ann Arbor",
    "Lists Agendas, Alternatives, and Public Policies (1984, 1995, 2011), America the Unusual (1999), and Congressmen's Voting Decisions (1973, 1981, 1989)",
    "Education/Degree lines: Ph.D., Political Science, University of Wisconsin - Madison, and B.A., Oberlin College. No degree years are printed",
    "Names the Stanford affiliation as the Center for Advanced Behavioral Studies at Stanford, which is not the same English name as the press page",
    "Also states an American Academy fellowship, a 1994 Aaron Wildavsky Award, department chair, Midwest Political Science Association presidency, and Brookings guest-scholar visits. Those sentences are faculty-page statements. The Academy person page, an awards page, and a Brookings page were not opened",
  ],
};

const openAlexKingdon: ContentSource = {
  id: "c11-kingdon-openalex-a5063257234",
  citation: "OpenAlex author A5063257234. John W. Kingdon.",
  url: "https://api.openalex.org/authors/A5063257234",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: [
    "API HTTP 200 on 2026-11-11. display_name John W. Kingdon. orcid null. last_known_institutions University of Michigan. homepage empty",
    "Human-readable record: https://openalex.org/authors/A5063257234",
    "Citation counts and the h-index on this record are not used as scholarly conclusions",
    "This is not a CV and not an ORCID",
  ],
};

const casbsLave: ContentSource = {
  id: "c11-lave-casbs-fellowship",
  citation: "Center for Advanced Study in the Behavioral Sciences. Jean C. Lave.",
  url: "https://casbs.stanford.edu/people/jean-c-lave",
  source_kind: "university",
  evidence_level: "L1",
  supports: [
    "Fellowship record: Anthropology, University of California, Berkeley, fellowship year 2000-01",
    "A fellowship line is not a full biography",
  ],
};

const copWorkSlug = CLUSTER_WORK_SLUGS[0];
const lppWorkSlug = CLUSTER_WORK_SLUGS[1];
const elderWorkSlug = CLUSTER_WORK_SLUGS[2];
const msaSlug = CLUSTER_THEORY_SLUG;
const laveSlug = CLUSTER_SCHOLAR_SLUG;
const kingdonWorkSlug = KINGDON_WORK_SLUG;
const kingdonScholarSlug = KINGDON_SCHOLAR_SLUG;

export interface ClusterBatch {
  theories: SeedTheory[];
  works: SeedWork[];
  scholars: SeedScholar[];
  theoryWorks: SeedTheoryWork[];
  theoryScholars: SeedTheoryScholar[];
}

export function createClusterBatch(): ClusterBatch {
  const works: SeedWork[] = [
    {
      slug: copWorkSlug,
      title: "Communities of Practice: Learning, Meaning, and Identity",
      authors: [{ name: "Etienne Wenger" }],
      year: 1998,
      publisher: "Cambridge University Press",
      doi: "10.1017/CBO9780511803932",
      status: "published",
      publishedAt: CLUSTER_PUBLISHED_AT,
      content: {
        en: {
          overview: "Etienne Wenger's 1998 monograph, recorded by Cambridge University Press and by Crossref as issued on 28 July 1998. This page is the book record for that monograph. It is not the 1991 book coauthored with Jean Lave, and it is not a management slogan.",
          core_question: "What social unit and learning process does the 1998 book put in place, as far as the publisher record and the visible Cambridge description support?",
          central_argument: "The Cambridge page describes learning as something that happens through participation in social practice, and it names informal communities formed around shared enterprises over time as the unit, rather than the isolated person or a formal institution. The public HTML does not carry a full chapter argument. This page stops at that visible description.",
          theoretical_contribution: "The book is the sole-authored 1998 statement used by the communities-of-practice theory page. Its contribution here is that unit and that learning process. It does not replace the 1991 account of legitimate peripheral participation, and it does not license later consulting uses of the phrase.",
          reading_focus: [
            "Confirm the 1998 author, publisher, and issue date before using the phrase.",
            "Read the visible Cambridge description and do not fill the truncated sentences from memory.",
            "Keep this book on a different page from the 1991 coauthored book.",
            "Use the DOI or the publisher page. Do not treat either as an open full text.",
          ],
          legal_access: [
            { label: "DOI", guidance: "The DOI is the stable identifier. A resolving DOI is not an open copy of the book.", source_id: copDoi.id },
            { label: "Cambridge Aspire", guidance: "The publisher page is the legal catalog record used for the visible description.", source_id: copAspire.id },
            { label: "Crossref", guidance: "Use the Crossref record for author, publisher, monograph type, and the 28 July 1998 issue date.", source_id: copCrossref.id },
          ],
          sources: [copDoi, copAspire, copCrossref],
          verification: [
            l1("c11-cop-work-biblio", `works[slug="${copWorkSlug}"].title`, "Crossref records Communities of Practice as a Cambridge University Press monograph by Etienne Wenger, issued 28 July 1998.", copCrossref.id, "Crossref message title, author, publisher, issued, type; URL https://api.crossref.org/works/10.1017/CBO9780511803932; type authoritative_web; checked 2026-11-11"),
            l1("c11-cop-work-description", `works[slug="${copWorkSlug}"].content.en.central_argument`, "The Cambridge Aspire page describes learning through engagement in social practice and names informal communities around shared enterprises as the unit rather than the individual or formal institutions.", copAspire.id, "Visible Aspire description; URL https://www.cambridge.org/highereducation/books/communities-of-practice/724C22A03B12D11DFC345EEF0AD3F22A; type publisher; checked 2026-11-11; description is truncated"),
            l2("c11-cop-work-boundary", `works[slug="${copWorkSlug}"].content.en.theoretical_contribution`, "Keeping this book separate from the 1991 book and from a management slogan is an editorial page boundary. Editorial synthesis."),
            l3("c11-cop-work-reading", `works[slug="${copWorkSlug}"].content.en.reading_focus`, "The reading order is research guidance for using the catalog record. It is not an instruction printed in the book."),
          ],
        },
      },
    },
    {
      slug: lppWorkSlug,
      title: "Situated Learning: Legitimate Peripheral Participation",
      authors: [{ name: "Jean Lave" }, { name: "Etienne Wenger" }],
      year: 1991,
      publisher: "Cambridge University Press",
      doi: "10.1017/CBO9780511815355",
      status: "published",
      publishedAt: CLUSTER_PUBLISHED_AT,
      content: {
        en: {
          overview: "The 1991 monograph by Jean Lave and Etienne Wenger, recorded by Cambridge University Press and by Crossref as issued on 27 September 1991. This is a work page. It does not replace a scholar page for Jean Lave, and it is not the 1998 communities-of-practice monograph.",
          core_question: "How does the 1991 publisher record describe situated learning and legitimate peripheral participation, and who are the recorded authors?",
          central_argument: "Crossref names two authors, Jean Lave and Etienne Wenger. The Cambridge page describes situated learning as a social process and legitimate peripheral participation as its central characteristic, with learners moving toward fuller participation in a community's practices. Occupational labels on that page are the publisher's wording. They are not a current CV for either author.",
          theoretical_contribution: "The book is the 1991 source for the situated-learning theory page. Its contribution here is the participation process named on the publisher page. It is not evidence that one coauthor owns the later 1998 framework.",
          reading_focus: [
            "Read the two-author Crossref record before attributing the book to one person.",
            "Use the Cambridge description for the participation process, and stop where the public page stops.",
            "Leave the 1998 monograph on its own work page.",
            "Use the scholar page for Jean Lave when the question is about the person rather than this book.",
          ],
          legal_access: [
            { label: "DOI", guidance: "The DOI is the stable identifier. A resolving DOI is not an open copy of the book.", source_id: lppDoi.id },
            { label: "Cambridge Aspire", guidance: "The publisher page is the legal catalog record used for the visible description.", source_id: lppAspire.id },
            { label: "Crossref", guidance: "Use the Crossref record for both authors, the publisher, and the 27 September 1991 issue date.", source_id: lppCrossref.id },
          ],
          sources: [lppDoi, lppAspire, lppCrossref],
          verification: [
            l1("c11-lpp-work-authors", `works[slug="${lppWorkSlug}"].authors`, "Crossref names Jean Lave and Etienne Wenger as authors of Situated Learning, a Cambridge University Press monograph issued 27 September 1991.", lppCrossref.id, "Crossref author array, publisher, issued, type; URL https://api.crossref.org/works/10.1017/CBO9780511815355; type authoritative_web; checked 2026-11-11"),
            l1("c11-lpp-work-process", `works[slug="${lppWorkSlug}"].content.en.central_argument`, "The Cambridge Aspire page describes situated learning as a social process and legitimate peripheral participation as its central characteristic.", lppAspire.id, "Visible Aspire description; URL https://www.cambridge.org/highereducation/books/situated-learning/6915ABD21C8E4619F750A4D4ACA616CD; type publisher; checked 2026-11-11"),
            l2("c11-lpp-work-not-scholar", `works[slug="${lppWorkSlug}"].content.en.overview`, "Calling this a work page that cannot replace a scholar page is editorial. Editorial synthesis."),
            l3("c11-lpp-work-reading", `works[slug="${lppWorkSlug}"].content.en.reading_focus`, "The reading order is research guidance. It is not a table of contents."),
          ],
        },
      },
    },
    {
      slug: elderWorkSlug,
      title: "Children of the Great Depression",
      authors: [{ name: "Glen H. Elder, Jr." }],
      year: 1974,
      publisher: "University of Chicago Press (1974 first-edition layer). Later records name a 1999 edition and the 2018 Routledge DOI layer.",
      doi: "10.4324/9780429501739",
      status: "published",
      publishedAt: CLUSTER_PUBLISHED_AT,
      content: {
        en: {
          overview: "Glen H. Elder, Jr.'s Children of the Great Depression, layered by date rather than collapsed into one imprint. The year on this record is 1974, the first-publication year stated on the Routledge 25th-anniversary page. The DOI on this record is the 2018 Routledge layer. Neither 2018 nor 1998 is the origin year.",
          core_question: "Which dated layers of this book can be told apart from the opened publisher, university, and Crossref records?",
          central_argument: "The Routledge page says the work was first published in 1974 and describes a longitudinal study of a Depression cohort of 167 people born in 1920-1921, followed from elementary school in Oakland into the 1960s. The same page carries a 1999 copyright line for the anniversary edition and says that edition adds a chapter on the war years. The UNC books page lists a 1999 record marked published 1974. The Carolina Population Center bibliography lists a 1999 Westview Press record. Crossref dates DOI 10.4324/9780429501739 to 8 October 2018 and names Routledge. The approved batch bibliography names University of Chicago Press as the 1974 first-edition publisher. The Routledge HTML opened on 2026-11-11 does not display a 1974 Chicago title page, so that imprint is recorded with that limit.",
          theoretical_contribution: "The book is the cohort study used by the life-course perspective page. It is not a law, and the 2018 DOI is not a new theory. Printings whose details were not on the opened pages are left unknown.",
          reading_focus: [
            "Start with the 1974 year on the Routledge page, and do not read 2018 as the origin year.",
            "Keep the 1999 UNC and CPC records distinct from the 2018 Crossref DOI.",
            "Treat University of Chicago Press as the batch's 1974 imprint layer, not as a title page reproduced from the Routledge HTML.",
            "Use the publisher, university, and DOI pages. Do not treat the DOI landing page as an open full text of every printing.",
          ],
          legal_access: [
            { label: "Routledge 25th-anniversary page", guidance: "Legal publisher page for the anniversary edition. It states first publication in 1974.", source_id: elderRoutledge.id },
            { label: "DOI 10.4324/9780429501739", guidance: "This DOI is the 2018 Routledge layer. It is not a 1974 title page.", source_id: elderDoi.id },
            { label: "Crossref", guidance: "Use Crossref for the 8 October 2018 issue date, the book type, and the Routledge publisher on this DOI.", source_id: elderCrossref.id },
            { label: "UNC books and CPC bibliography", guidance: "Use these university records for the 1999 layer, including the Westview imprint on the CPC bibliography.", source_id: elderBooks.id },
          ],
          sources: [elderRoutledge, elderDoi, elderCrossref, elderBooks, elderCpc],
          verification: [
            l1("c11-elder-work-1974", `works[slug="${elderWorkSlug}"].year`, "The Routledge 25th-anniversary page says the work was first published in 1974.", elderRoutledge.id, "Routledge product description, first-published year; URL https://www.routledge.com/Children-Of-The-Great-Depression-25th-Anniversary-Edition/Elder/p/book/9780813333427; type publisher; checked 2026-11-11"),
            l1("c11-elder-work-2018", `works[slug="${elderWorkSlug}"].doi`, "Crossref records DOI 10.4324/9780429501739 as a Routledge book issued 8 October 2018.", elderCrossref.id, "Crossref issued, publisher, type; URL https://api.crossref.org/works/10.4324/9780429501739; type authoritative_web; checked 2026-11-11"),
            l1("c11-elder-work-1999", `works[slug="${elderWorkSlug}"].content.en.central_argument`, "The UNC books page lists a 1999 record marked published 1974, and the CPC bibliography lists a 1999 Westview Press record.", elderCpc.id, "CPC bib 943 together with the UNC books page; URLs https://www.cpc.unc.edu/resources/publications/bib/943/ and https://elder.web.unc.edu/books/; type university; checked 2026-11-11"),
            l2("c11-elder-work-chicago-limit", `works[slug="${elderWorkSlug}"].publisher`, "University of Chicago Press is the 1974 first-edition imprint required by the approved batch bibliography. The Routledge page opened on 2026-11-11 does not display a 1974 Chicago title page. That limit is editorial synthesis, not a claim that the title page was read."),
            l3("c11-elder-work-reading", `works[slug="${elderWorkSlug}"].content.en.reading_focus`, "Keeping the three date layers apart is research guidance for citation practice."),
          ],
        },
      },
    },
    {
      slug: kingdonWorkSlug,
      title: "Agendas, Alternatives, and Public Policies",
      authors: [{ name: "John W. Kingdon" }],
      year: 1984,
      publisher: "1984 first-edition imprint not settled from the opened pages. Later layers: 1995 reissue; 2011 Longman Classics; Pearson New International Edition published 3 October 2013, copyright 2014.",
      status: "published",
      publishedAt: CLUSTER_PUBLISHED_AT,
      content: {
        en: {
          overview: "A work record for John W. Kingdon's Agendas, Alternatives, and Public Policies. The year on this record is 1984, the first-publication year stated on the University of Michigan political-science bibliography page. That page was opened with WebFetch on 2026-11-11. curl to the same URL returned HTTP 403, a Cloudflare challenge, and is not treated as a successful fetch. The Pearson catalog, opened by curl with HTTP 200 on the same date, is a later layer: the Pearson New International Edition, published 3 October 2013, with a 2014 copyright line and ISBN-13 9781292053875. Neither 2011, 2013, nor 2014 is the origin year. This page is the book record. It is not a scholar page and not the education-policy theory page.",
          core_question: "Which dated layers of this book can be kept apart, and what does the opened catalog actually place the book in?",
          central_argument: "The department bibliography page titles the book Agendas, Alternatives, and Public Policies. It says the book was first published in 1984, reissued in 1995, and issued again in 2011 as a Longman Classics edition with a new epilogue on health care reform from the Clinton years to the Obama years. The same page prints Publisher: Longman and Year of Publication: 1984. Some reviews name Little, Brown for that first-edition imprint. Those reviews were not opened on 2026-11-11, so neither Longman nor Little, Brown is recorded here as the sole verified first-edition publisher. The Pearson catalog heading is Agendas, Alternatives, and Public Policies, Update Edition (With an Epilogue on Health Care), Pearson New International Edition. Its visible overview places the research in interviews and documents about the U.S. federal government and frames the book as a study of how issues reach official attention and how a governmental agenda is set. The catalog heading also contains the words 2nd edition. This page does not use that label to replace the 1995 reissue, and it does not read 2013 as a new origin year. No stable book DOI was found, and none is supplied. The department page reprints a publisher description and marks it Pearson. That description is not copied here.",
          theoretical_contribution: "The book is the federal policy-process record used by the multiple-streams education page. Its contribution on this page is bibliographic: author, title, and the separated edition layers. The education application stays on that theory page, in the 2010 EPAA article. This book is not an education monograph. The catalog is not an open full text.",
          reading_focus: [
            "Use 1984 as the origin year. Do not cite 2013 or 2014 as the year the book was created.",
            "Keep four layers apart: 1984 first publication, 1995 reissue, 2011 Longman Classics, and the 2013-2014 Pearson New International Edition.",
            "Leave the 1984 publisher unresolved. The bibliography page says Longman. Unopened reviews are not used to pick a different sole imprint.",
            "Do not add a DOI. The missing identifier is a gap, not a license to invent one.",
            "Read the education application on the theory page multiple-streams-education-policy. Read the author record on the scholar page john-w-kingdon-flagship.",
          ],
          legal_access: [
            { label: "Pearson catalog", guidance: "Legal catalog page for the Pearson New International Edition. It records the 3 October 2013 publication date, the 2014 copyright line, ISBN-13 9781292053875, and the U.S. federal scope. It is not an open copy of the book.", source_id: pearsonKingdon.id },
            { label: "U-M LSA bibliography page", guidance: "Opened with WebFetch on 2026-11-11 after curl returned HTTP 403. Use it for the 1984, 1995, and 2011 layers. Do not describe that curl as successful.", source_id: lsaKingdonBibliography.id },
          ],
          sources: [pearsonKingdon, lsaKingdonBibliography],
          verification: [
            l1("c11-kingdon-work-pearson", `works[slug="${kingdonWorkSlug}"].content.en.central_argument`, "The Pearson catalog names John W. Kingdon as author of the Pearson New International Edition, published 3 October 2013, copyright 2014, ISBN-13 9781292053875, and places the book in research on the U.S. federal government.", pearsonKingdon.id, "Pearson catalog title, author, published date, copyright line, ISBN-13, and title overview; URL https://www.pearson.com/en-gb/subject-catalog/p/agendas-alternatives-and-public-policies-update-edition-with-an-epilogue-on-health-care-pearson-new-international-edition/P200000004628/9781292053875; type publisher; curl HTTP 200 on 2026-11-11"),
            l1("c11-kingdon-work-layers", `works[slug="${kingdonWorkSlug}"].year`, "The LSA bibliography page says the book was first published in 1984, reissued in 1995, and issued in 2011 as a Longman Classics edition. It also prints Publisher: Longman and Year of Publication: 1984.", lsaKingdonBibliography.id, "Bibliography page publication history, publisher line, and year line; URL https://lsa.umich.edu/polisci/people/emeriti/kingdon/Agendas-Alternatives-and-Public-Policies.html; type university; WebFetch opened the page on 2026-11-11; curl HTTP 403"),
            l2("c11-kingdon-work-imprint-limit", `works[slug="${kingdonWorkSlug}"].publisher`, "Refusing to name one 1984 publisher, refusing a DOI, and refusing to treat the book as an education monograph are editorial limits. The bibliography page says Longman. Reviews that say Little, Brown were not opened."),
            l3("c11-kingdon-work-reading", `works[slug="${kingdonWorkSlug}"].content.en.reading_focus`, "Keeping the edition layers apart, and sending education applications to the theory page, is research guidance for citation. It is not a sentence from the book."),
          ],
        },
      },
    },
  ];

  const theories: SeedTheory[] = [
    {
      slug: msaSlug,
      primary: false,
      depth: "D2",
      titleEn: "Multiple streams in education policy",
      summaryEn: "Multiple streams, on this page, is Kingdon's account of how issues reach a governmental agenda, used here only with an education-policy application. The Pearson catalog page is a book about the U.S. federal policy process, not an education monograph. The education application is Young, Shepley, and Song's 2010 EPAA article at article view 771.",
      status: "published",
      publishedAt: CLUSTER_PUBLISHED_AT,
      content: {
        en: {
          theory_nature: {
            kind: "framework",
            label: "Policy-process framework, with one education application",
            explanation: "This page pairs a federal policy-process book with one education-policy article. It does not turn the book into an education monograph. The book record is the work page kingdon-agendas-alternatives-and-public-policies. The author record is the scholar page john-w-kingdon-flagship. Neither of those pages replaces this theory page.",
            source_ids: [pearsonKingdon.id, epaaArticle.id],
          },
          what_is_it: "This page helps a reader decide whether a study is using Kingdon's multiple-streams vocabulary for a policy agenda, and whether an education case is actually that kind of question. The Pearson catalog describes a book that asks how subjects reach officials and how a governmental agenda is set, from interviews and documents about the U.S. federal government. Its chapter list separates problems, a policy primeval soup, a political stream, and a policy window in which streams are joined. The 2010 EPAA article, at the path ending in 771, applies that model to state reading policy. The two sources do different work. The catalog is not the article, and the article is not the book.",
          origins: "The Pearson page names John W. Kingdon and dates this Pearson New International update edition to 3 October 2013, with a 2014 copyright line and ISBN 9781292053875. That page is the catalog record opened for the book. It is not treated as the 1984 first edition, and the full book was not read from it. Crossref dates the EPAA article to 10 July 2010, with authors Tamara Viola Young, Thomas V. Shepley, and Mengli Song, in Education Policy Analysis Archives. The DOI resolves to https://epaa.asu.edu/index.php/epaa/article/view/771. A different EPAA path, article view 757, is another article and is not a source on this page.",
          core_concepts: [
            {
              name: "Governmental agenda",
              definition: "The Pearson page frames the book as an account of how issues come to officials' attention and how the governmental agenda is set, rather than only how a decision is taken after an issue is already on the table.",
              relevance: "A study of a decision that skips how the issue got there is not yet using this page's question.",
            },
            {
              name: "Problems, policy stream, and political stream",
              definition: "The catalog table of contents lists separate chapters for problems, the policy primeval soup, and the political stream. This page treats those chapter titles as evidence that the book keeps the processes distinct. It does not reconstruct the chapters from memory.",
              relevance: "Naming three streams without materials for each one is a label, not an application.",
            },
            {
              name: "Policy window",
              definition: "The contents list a chapter on the policy window and on joining the streams. The window is a timing claim inside that policy process, not a biographical turning point.",
              relevance: "A life-course turning point is a different page.",
            },
            {
              name: "Education application, separately sourced",
              definition: "The EPAA article's title states an application of Kingdon's multiple streams model to how a state reading policy formed. The article page says the study used interviews in California, Michigan, and Texas.",
              relevance: "The education claim on this page depends on that article. The Pearson catalog alone does not establish it.",
            },
          ],
          genealogy: [
            {
              related_theory: "life-course-perspective",
              relationship: "distinct_from",
              description: "A policy window in Kingdon's chapter list is not a life-course turning point. This page groups the two as different questions. That grouping is editorial synthesis. It is not a sentence from either book.",
              source_ids: [pearsonKingdon.id],
            },
            {
              related_theory: "teacher-professional-identity",
              relationship: "distinct_from",
              description: "How teachers interpret a professional self is not how a reading issue reaches a state agenda. The pages stay separate. Editorial synthesis.",
              source_ids: [epaaArticle.id],
            },
          ],
          applicable_topics: [
            {
              topic: "How a reading or other education issue became prominent on a governmental agenda",
              rationale: "That is the question the 2010 EPAA title and the Pearson agenda questions both speak to, at different levels of government.",
            },
            {
              topic: "A study that can show problems, alternatives, and political conditions as separate streams",
              rationale: "The catalog's chapter list keeps those processes in separate chapters, including a chapter on joining them.",
            },
            {
              topic: "A comparison between a federal policy-process book and a state education application",
              rationale: "The Pearson page is about the U.S. federal government. The EPAA article is about state reading policy. The difference is part of the page.",
            },
          ],
          inapplicable_topics: [
            {
              topic: "Media agenda-setting in the McCombs tradition",
              rationale: "Multiple streams here is not that media-effects tradition. Sharing the word agenda is not enough. No McCombs source was opened for this page, so the boundary is a naming limit.",
            },
            {
              topic: "An education study that cites only the Pearson catalog and drops the 2010 article",
              rationale: "Without the EPAA source, this page would not treat the education application as published.",
            },
          ],
          misuse_risks: [
            "Calling the Pearson book an education monograph. The catalog page describes U.S. federal policy research.",
            "Citing EPAA article view 757. That path is a different article. The education source is article view 771.",
            "Treating multiple streams as the McCombs media agenda-setting tradition.",
            "Treating the Pearson catalog, or a DOI, as an open full text of Kingdon's book.",
            "Using a citation count as a conclusion about the framework.",
          ],
          analysis_dimensions: [
            "Whether the question is agenda entry or a later implementation stage",
            "Which stream has its own evidence",
            "Whether the case is federal, state, or another jurisdiction, and which source supports that level",
            "Whether the design is media-effects research under another name",
          ],
          data_collection: [
            {
              dimension: "Agenda entry",
              indicators: ["A dated point when an issue received official attention", "A contrast with issues that did not"],
              collection_prompt: "Date when the issue reached the agenda, and say what would count as evidence that it had not. Do not infer the agenda from a later statute alone.",
            },
            {
              dimension: "Separate streams",
              indicators: ["Problem indicators", "A set of alternatives", "Political conditions that are not the same documents as the alternatives"],
              collection_prompt: "Keep the three classes of material in separate memos before claiming they joined.",
            },
            {
              dimension: "Education application",
              indicators: ["A named education issue", "The jurisdiction", "A source other than the Pearson catalog for the education claim"],
              collection_prompt: "If the only education source is the book catalog, do not claim the education application on this page's terms.",
            },
          ],
          chapter_structure: [
            {
              chapter: "Which source",
              purpose: "Separate the federal book catalog from the 2010 education article.",
              theory_use: "Cite both, and cite article view 771 rather than 757.",
            },
            {
              chapter: "Agenda question",
              purpose: "State how the issue reached attention.",
              theory_use: "Use the catalog's agenda questions without treating the catalog as the full book.",
            },
            {
              chapter: "Streams and window",
              purpose: "Show problems, alternatives, politics, and any claimed joining.",
              theory_use: "Do not collapse the chapter titles into one cause.",
            },
            {
              chapter: "Misuse check",
              purpose: "Say why the study is not a media agenda-setting study and not a life-course study.",
              theory_use: "If the materials are news-effects or biographical pathways, choose another page.",
            },
          ],
          fit_writing: [
            "Use this page when the question is how an education issue reached a governmental agenda and the study can keep streams distinct.",
            "Do not use it for classroom identity, for media-effects agenda setting, or for a claim that rests only on the Pearson catalog.",
          ],
          explanatory_mechanisms: [
            {
              mechanism: "Agenda setting before choice",
              process: "The Pearson page says the book asks how subjects come to officials' attention and how the governmental agenda is set, not only how an already listed issue is decided.",
              evidence_focus: "Attention and alternatives, dated, rather than the final vote alone.",
              source_ids: [pearsonKingdon.id],
            },
            {
              mechanism: "Joining at a policy window",
              process: "The contents name a policy window and the joining of streams as a distinct chapter. The EPAA article uses the model for state reading agendas. Its abstract treats state-level use of Kingdon's national-level model as conditional: applicability may depend on the issue being examined and on whether the state executive branch takes part. This page keeps that limit conditional. It is not a settled finding that the model cannot travel to a state unchanged.",
              evidence_focus: "A timing claim plus the streams that are said to have joined, with the education claim tied to the article rather than the catalog.",
              source_ids: [pearsonKingdon.id, epaaArticle.id],
            },
          ],
          analysis_unit: "A dated governmental agenda process, with an education application only when the 2010 article's kind of question is the one being asked.",
          theory_comparisons: [
            {
              theory: "Life course perspective",
              role: "main_candidate",
              shared_focus: "Both can use the word timing.",
              difference: "The life-course page is about lives, cohorts, and pathways. A policy window is an agenda opportunity in a policy process.",
              when_prefer: "Prefer the life-course page when the object is a life or a cohort, not a governmental agenda.",
              source_ids: [pearsonKingdon.id],
            },
            {
              theory: "Teacher professional identity",
              role: "alternative",
              shared_focus: "Both can appear in education research.",
              difference: "The identity page is a review construct about teachers' professional self-interpretation. This page is about agenda setting.",
              when_prefer: "Prefer the identity page when the question is who teachers understand themselves to be in the work.",
              source_ids: [epaaArticle.id],
            },
          ],
          boundary_conditions: [
            {
              condition: "The education application is not supported by the EPAA article at view 771.",
              implication: "Do not publish or cite an education multiple-streams claim from the Pearson catalog alone.",
              source_ids: [epaaArticle.id, pearsonKingdon.id],
            },
            {
              condition: "The opened text is the Pearson catalog or a database record rather than the book.",
              implication: "Limit book claims to the catalog's visible description and contents. Do not reconstruct unread chapters.",
              source_ids: [pearsonKingdon.id],
            },
          ],
          sources: [pearsonKingdon, epaaDoi, epaaArticle, epaaCrossref],
          reading_path: [
            { order: 1, level: "Level 1 · Book catalog", title: "Pearson catalog page", purpose: "Check the author, the 2013 update edition, the U.S. federal scope, and the chapter titles. Do not treat the page as the book.", source_id: pearsonKingdon.id },
            { order: 2, level: "Level 1 · Education article", title: "EPAA article view 771", purpose: "Check authors, the 10 July 2010 date, and the state reading-policy application. Do not open article view 757 for this claim.", source_id: epaaArticle.id },
            { order: 3, level: "Level 2 · Page boundary", title: "Not a media tradition", purpose: "Keep multiple streams distinct from McCombs media agenda-setting. No McCombs source was opened. The book page is kingdon-agendas-alternatives-and-public-policies and the author page is john-w-kingdon-flagship. An unpublished draft scholar record is not that author page.", source_id: pearsonKingdon.id },
            { order: 4, level: "Level 3 · Design", title: "Streams before joining", purpose: "Collect separate evidence for problems, alternatives, and politics before claiming a window.", source_id: epaaArticle.id },
          ],
          verification: [
            l1("c11-msa-pearson", `theories[slug="${msaSlug}"].content.en.origins`, "The Pearson catalog names John W. Kingdon as author of Agendas, Alternatives, and Public Policies, Update Edition, and places the book in research on the U.S. federal government. The page date is 3 October 2013.", pearsonKingdon.id, "Pearson catalog title, author, published date, and title overview; URL https://www.pearson.com/en-gb/subject-catalog/p/agendas-alternatives-and-public-policies-update-edition-with-an-epilogue-on-health-care-pearson-new-international-edition/P200000004628/9781292053875; type publisher; checked 2026-11-11"),
            l1("c11-msa-epaa", `theories[slug="${msaSlug}"].content.en.what_is_it`, "Young, Shepley, and Song's 2010 EPAA article applies Kingdon's multiple streams model to state reading policy. The article view is path 771, issued 10 July 2010.", epaaArticle.id, "EPAA article view 771 title, authors, and publication date; URL https://epaa.asu.edu/index.php/epaa/article/view/771; type journal; DOI https://doi.org/10.14507/epaa.v18n15.2010; checked 2026-11-11"),
            l1("c11-msa-crossref", `theories[slug="${msaSlug}"].content.en.origins`, "Crossref records the EPAA item as a journal article issued 10 July 2010 by Young, Shepley, and Song.", epaaCrossref.id, "Crossref title, author, issued, container-title; URL https://api.crossref.org/works/10.14507/epaa.v18n15.2010; type authoritative_web; checked 2026-11-11"),
            l1("c11-msa-state-applicability", `theories[slug="${msaSlug}"].content.en.explanatory_mechanisms[1].process`, "The EPAA abstract says applicability of Kingdon's national-level model at the state level may depend on the issue being examined and on participation by the state executive branch. The tightened sentence does not turn that into a settled finding that the model cannot travel unchanged.", epaaArticle.id, "EPAA article view 771 abstract, closing applicability sentence; URL https://epaa.asu.edu/index.php/epaa/article/view/771; type journal; DOI https://doi.org/10.14507/epaa.v18n15.2010 resolved to the same path; checked 2026-11-11"),
            l2("c11-msa-not-mcombs", `theories[slug="${msaSlug}"].content.en.misuse_risks`, "The misuse boundary with the McCombs media agenda-setting tradition is editorial synthesis. No McCombs source was opened. The boundary is a naming limit, not a finding from that literature."),
            l2("c11-msa-not-education-monograph", `theories[slug="${msaSlug}"].content.en.theory_nature`, "Calling the Pearson book a federal policy-process book rather than an education monograph is editorial synthesis grounded in the catalog's own scope statement."),
            l3("c11-msa-guidance", `theories[slug="${msaSlug}"].content.en.fit_writing`, "Requiring separate stream evidence before a coupling claim is research guidance. It is not a method chapter from the book."),
          ],
        },
      },
    },
  ];

  const scholars: SeedScholar[] = [
    {
      slug: laveSlug,
      name: "Jean Lave",
      bioEn: "Coauthor, with Etienne Wenger, of the 1991 book Situated Learning. OpenAlex lists the last known institution as the University of California, Berkeley, and the ORCID field is empty. Institutional pages do not agree on a single department title.",
      status: "published",
      publishedAt: CLUSTER_PUBLISHED_AT,
      content: {
        en: {
          overview: "Jean Lave is named by Crossref as a coauthor of the 1991 monograph Situated Learning. OpenAlex author A5061396853 displays Jean Lave, returns an empty ORCID, and lists the University of California, Berkeley as the last known institution. Two Berkeley pages use different department wording. The Center for African Studies directory, checked on 2026-11-11, lists Professor Emeritus, Department: Education, Role Emeritus. The Graduate Lectures page for the 3 November 2011 lecture lists Professor Emerita, Department of Geography, and Affiliate Professor in Geography, Anthropology, and the Energy Resources Group. This page sets those wordings side by side. It does not choose one as the sole verified title. The directory's faculty contact link was not a working page on the verification date, so that URL is not offered as a homepage. No personal academic site at the level of a maintained university about-page was found, and no degree year is stated. A CASBS page records a 2000-01 fellowship in Anthropology at UC Berkeley. That is a fellowship line, not a CV. Citation counts are not used.",
          academic_identity: {
            discipline: "Not one verified department. African Studies directory: Education. 2011 Graduate Lectures page: Geography, with affiliate wording for Geography, Anthropology, and the Energy Resources Group.",
            role: "Side-by-side institutional wording, checked 2026-11-11. African Studies directory: Professor Emeritus, Department: Education, Role Emeritus. 2011 lecture page: Professor Emerita, Department of Geography, and Affiliate Professor, Departments of Geography, Anthropology, and the Energy Resources Group. Neither wording is selected as the sole current title.",
            source_ids: [africanStudiesLave.id, graduateLectureLave.id, openAlexLave.id],
          },
          theory_relationships: [
            {
              theory_slug: "situated-learning-legitimate-peripheral-participation",
              relationship: "Coauthor of the 1991 book",
              description: "Lave is one of the two Crossref authors of the 1991 book this site uses for situated learning. The relation is coauthorship of that book. It is not authorship of the 1998 monograph, and this scholar page is not the book page.",
              source_ids: [lppCrossref.id],
            },
          ],
          representative_works: [
            {
              title: "Situated Learning: Legitimate Peripheral Participation",
              work_slug: lppWorkSlug,
              contribution: "1991 monograph coauthored with Etienne Wenger. The work page and this scholar page are different records.",
              source_ids: [lppCrossref.id, lppAspire.id],
            },
          ],
          scholarly_relations: [
            {
              kind: "collaboration",
              description: "Crossref lists Jean Lave and Etienne Wenger as coauthors of the 1991 book only. The relation does not extend to the 1998 monograph, and it does not merge either person with a later Wenger-Trayner record.",
              source_ids: [lppCrossref.id],
            },
          ],
          attribution_boundaries: [
            "Do not treat the 1991 work page as a substitute for this scholar page.",
            "Do not describe Lave as the sole author of the 1991 book or as the author of the 1998 monograph.",
            "Do not pick Education or Geography as the single verified department. The two Berkeley wordings conflict and stay side by side.",
            "Do not invent an ORCID, a Ph.D. year, or a CV. The OpenAlex ORCID field is empty.",
            "Do not present the directory's faculty contact URL as a working homepage. It returned 404 on 2026-11-11 and is not a source link.",
            "The CASBS line is a 2000-01 fellowship record only.",
          ],
          reading_path: [
            { order: 1, title: "1991 Crossref and Cambridge page", purpose: "Start with the coauthored book, then open its work page.", source_id: lppCrossref.id },
            { order: 2, title: "Two Berkeley wordings", purpose: "Read the African Studies directory and the 2011 lecture page together, and do not collapse them.", source_id: africanStudiesLave.id },
            { order: 3, title: "OpenAlex author row", purpose: "Check the display name, the empty ORCID, and the Berkeley institution, and stop there.", source_id: openAlexLave.id },
            { order: 4, title: "CASBS fellowship line", purpose: "Use it only as a 2000-01 fellowship record.", source_id: casbsLave.id },
          ],
          sources: [lppDoi, lppCrossref, lppAspire, openAlexLave, africanStudiesLave, graduateLectureLave, casbsLave],
          verification: [
            l1("c11-lave-1991-author", `scholars[slug="${laveSlug}"].content.en.theory_relationships`, "Crossref names Jean Lave and Etienne Wenger as authors of the 1991 monograph Situated Learning.", lppCrossref.id, "Crossref author array; URL https://api.crossref.org/works/10.1017/CBO9780511815355; type authoritative_web; checked 2026-11-11"),
            l1("c11-lave-openalex", `scholars[slug="${laveSlug}"].content.en.overview`, "OpenAlex A5061396853 displays Jean Lave, has an empty ORCID, and lists the University of California, Berkeley as the last known institution.", openAlexLave.id, "Author JSON display_name, orcid, last_known_institutions; URL https://api.openalex.org/authors/A5061396853; type authoritative_web; checked 2026-11-11"),
            l1("c11-lave-education-wording", `scholars[slug="${laveSlug}"].content.en.academic_identity.role`, "The African Studies directory lists Professor Emeritus, Department: Education, Role Emeritus.", africanStudiesLave.id, "Directory job title, department, and role; URL https://africa.berkeley.edu/people/jean-lave; type university; checked 2026-11-11"),
            l1("c11-lave-geography-wording", `scholars[slug="${laveSlug}"].content.en.academic_identity.role`, "The 2011 Graduate Lectures page lists Professor Emerita, Department of Geography, and affiliate professor wording for Geography, Anthropology, and the Energy Resources Group.", graduateLectureLave.id, "Lecture page byline; URL https://gradlectures.berkeley.edu/lecture/everyday-life-and-learning/; type university; checked 2026-11-11"),
            l1("c11-lave-casbs", `scholars[slug="${laveSlug}"].content.en.overview`, "The CASBS page records Jean C. Lave, Anthropology, University of California, Berkeley, fellowship year 2000-01.", casbsLave.id, "CASBS person page fellowship line; URL https://casbs.stanford.edu/people/jean-c-lave; type university; checked 2026-11-11"),
            l2("c11-lave-conflict", `scholars[slug="${laveSlug}"].content.en.attribution_boundaries`, "Refusing to choose one department title, and refusing to invent a degree year or ORCID, is editorial synthesis. The two institutional wordings remain unresolved."),
            l3("c11-lave-reading", `scholars[slug="${laveSlug}"].content.en.reading_path`, "Reading the book record before the conflicting department lines is research guidance, not a biographical fact."),
          ],
        },
      },
    },
    {
      slug: kingdonScholarSlug,
      name: "John W. Kingdon",
      bioEn: "Professor emeritus of political science at the University of Michigan, and author of Agendas, Alternatives, and Public Policies. This page is the author record for that book. It is not the book page and not the education-policy theory page.",
      status: "published",
      publishedAt: CLUSTER_PUBLISHED_AT,
      content: {
        en: {
          overview: "John W. Kingdon is the author named on the Pearson catalog for Agendas, Alternatives, and Public Policies and on the University of Michigan political-science pages. The University of Michigan Press author page, opened by curl with HTTP 200 on 2026-11-11, describes him as a professor emeritus of political science at the University of Michigan. It says he has been a fellow of Stanford University's Center for Advanced Study in Behavioral Sciences and a John Simon Guggenheim Fellow. The book it lists is Congressmen's Voting Decisions. That press page is not a bibliography of Agendas, Alternatives, and Public Policies. The LSA faculty page was opened with WebFetch on 2026-11-11. curl to that URL returned HTTP 403, a Cloudflare challenge, and is not recorded as a successful fetch. That page calls him professor emeritus of political science at the University of Michigan in Ann Arbor. It lists Agendas, Alternatives, and Public Policies (1984, 1995, 2011), America the Unusual (1999), and Congressmen's Voting Decisions (1973, 1981, 1989). Its degree lines are a Ph.D. in political science from the University of Wisconsin-Madison and a B.A. from Oberlin College, with no years. It names the Stanford affiliation as the Center for Advanced Behavioral Studies at Stanford. The two Stanford names are left side by side. OpenAlex author A5063257234, HTTP 200 on the same date, displays John W. Kingdon, returns an empty ORCID, lists the University of Michigan as the last known institution, and has an empty homepage. Citation counts and the h-index on that record are not used. No ORCID is supplied. This page does not stand in for the book or for the education application.",
          academic_identity: {
            discipline: "Political science. The opened press page and the LSA faculty page place him in political science at the University of Michigan. They do not place him in an education faculty.",
            role: "Professor emeritus of political science, University of Michigan, on both the press page and the LSA faculty page. The faculty page adds Ann Arbor and the two degrees named above. Stanford wording is not collapsed: faculty page, Center for Advanced Behavioral Studies at Stanford; press page, Stanford University's Center for Advanced Study in Behavioral Sciences. Both pages call him a John Simon Guggenheim Fellow.",
            source_ids: [umPressKingdon.id, lsaKingdonFaculty.id, openAlexKingdon.id],
          },
          theory_relationships: [
            {
              theory_slug: msaSlug,
              relationship: "Author of the book the theory page cites",
              description: "The multiple-streams education page uses his book as the federal policy-process source and a 2010 article for the education application. This scholar page records the author. It does not replace the book page or the theory page, and it does not make the book an education monograph.",
              source_ids: [pearsonKingdon.id, lsaKingdonFaculty.id],
            },
          ],
          representative_works: [
            {
              title: "Agendas, Alternatives, and Public Policies",
              work_slug: kingdonWorkSlug,
              contribution: "The book record for the 1984 origin year and the later 1995, 2011, and 2013-2014 layers. The work page and this scholar page are different records.",
              source_ids: [lsaKingdonBibliography.id, pearsonKingdon.id],
            },
            {
              title: "America the Unusual",
              contribution: "The LSA faculty page lists this title with the year 1999. No separate work page is opened here, and the press author page does not use this title as its book entry.",
              source_ids: [lsaKingdonFaculty.id],
            },
            {
              title: "Congressmen's Voting Decisions",
              contribution: "The LSA faculty page lists 1973, 1981, and 1989. The press author page's listed book entry is this title. That entry does not replace the Agendas bibliography.",
              source_ids: [lsaKingdonFaculty.id, umPressKingdon.id],
            },
          ],
          scholarly_relations: [
            {
              kind: "development",
              description: "The faculty page dates Agendas, Alternatives, and Public Policies to 1984, 1995, and 2011. The bibliography page adds a 2011 Longman Classics epilogue and a Longman publisher line for 1984. The Pearson catalog is a 2013-2014 international edition. That sequence is publication history for one title. It is not a relation to another scholar, and it does not settle the 1984 imprint.",
              source_ids: [lsaKingdonFaculty.id, lsaKingdonBibliography.id, pearsonKingdon.id],
            },
          ],
          attribution_boundaries: [
            "Do not treat this scholar page as the book page or as the education-policy theory page.",
            "Do not describe Agendas, Alternatives, and Public Policies as an education monograph. Education applications stay on the theory page.",
            "Do not invent an ORCID. The OpenAlex ORCID field is empty.",
            "Do not collapse the two Stanford center names into one verified official title.",
            "Do not treat citation counts or the h-index as a conclusion about the work.",
            "The faculty page states an American Academy fellowship, a 1994 Aaron Wildavsky Award, service as department chair and as president of the Midwest Political Science Association, and guest-scholar visits at the Brookings Institution. The Academy person page was not opened on 2026-11-11: curl returned HTTP 403 and WebFetch timed out. No awards page and no Brookings page were opened. Those lines stay faculty-page statements.",
            "The press page's book entry is Congressmen's Voting Decisions. It does not replace the edition layers on the Agendas work page.",
            "An unpublished draft scholar record is not this page.",
          ],
          reading_path: [
            { order: 1, title: "University of Michigan Press author page", purpose: "Check the emeritus title, the Guggenheim fellowship, and the press page's Stanford wording. Do not use it as the Agendas bibliography.", source_id: umPressKingdon.id },
            { order: 2, title: "LSA faculty page", purpose: "Read the Ann Arbor title, the degree lines, the three book lists, and the faculty page's different Stanford name. The page was opened with WebFetch. curl returned HTTP 403.", source_id: lsaKingdonFaculty.id },
            { order: 3, title: "OpenAlex author A5063257234", purpose: "Check the display name, the empty ORCID, the Michigan institution, and the empty homepage. Stop there. A human-readable page is at https://openalex.org/authors/A5063257234.", source_id: openAlexKingdon.id },
            { order: 4, title: "Book page, then theory page", purpose: "Use kingdon-agendas-alternatives-and-public-policies for edition layers. Use multiple-streams-education-policy when the question is the education application.", source_id: pearsonKingdon.id },
          ],
          sources: [umPressKingdon, lsaKingdonFaculty, lsaKingdonBibliography, openAlexKingdon, pearsonKingdon],
          verification: [
            l1("c11-kingdon-press-title", `scholars[slug="${kingdonScholarSlug}"].content.en.academic_identity.role`, "The University of Michigan Press author page describes John W. Kingdon as Professor Emeritus of Political Science at the University of Michigan, and it names a Stanford Center for Advanced Study in Behavioral Sciences fellowship and a John Simon Guggenheim Fellowship.", umPressKingdon.id, "Press author page identity paragraph; URL https://press.umich.edu/Contributors/K/Kingdon-John-W; type publisher; curl HTTP 200 on 2026-11-11"),
            l1("c11-kingdon-faculty-degrees", `scholars[slug="${kingdonScholarSlug}"].content.en.overview`, "The LSA faculty page lists a Ph.D. in political science from the University of Wisconsin-Madison, a B.A. from Oberlin College, and the books Agendas, Alternatives, and Public Policies (1984, 1995, 2011), America the Unusual (1999), and Congressmen's Voting Decisions (1973, 1981, 1989). It names the Stanford center as the Center for Advanced Behavioral Studies at Stanford.", lsaKingdonFaculty.id, "Faculty page Education/Degree, About, and Selected Publications; URL https://lsa.umich.edu/polisci/people/emeriti/kingdon.html; type university; WebFetch opened the page on 2026-11-11; curl HTTP 403"),
            l1("c11-kingdon-openalex", `scholars[slug="${kingdonScholarSlug}"].content.en.overview`, "OpenAlex A5063257234 displays John W. Kingdon, has an empty ORCID, lists the University of Michigan as the last known institution, and has an empty homepage.", openAlexKingdon.id, "Author JSON display_name, orcid, last_known_institutions, and homepage; URL https://api.openalex.org/authors/A5063257234; type authoritative_web; HTTP 200 on 2026-11-11"),
            l2("c11-kingdon-name-limit", `scholars[slug="${kingdonScholarSlug}"].content.en.attribution_boundaries`, "Leaving the two Stanford names unresolved, refusing an invented ORCID, and refusing to treat unopened Academy, award, or Brookings pages as verified are editorial limits."),
            l3("c11-kingdon-reading", `scholars[slug="${kingdonScholarSlug}"].content.en.reading_path`, "Reading the press page, the faculty page, and the OpenAlex row before the book and theory pages is research guidance, not a biographical fact."),
          ],
        },
      },
    },
  ];

  const theoryWorks: SeedTheoryWork[] = [
    {
      theorySlug: "communities-of-practice-1998",
      workSlug: copWorkSlug,
      relationship: "core_work",
      sourceUrls: [copDoi.url, copAspire.url, copCrossref.url],
      evidenceNotesEn: "The 1998 monograph is the book this theory page uses. The relation is editorial and does not make the book the 1991 coauthored work.",
    },
    {
      theorySlug: "situated-learning-legitimate-peripheral-participation",
      workSlug: lppWorkSlug,
      relationship: "founding_text",
      sourceUrls: [lppDoi.url, lppAspire.url, lppCrossref.url],
      evidenceNotesEn: "The 1991 monograph is the book this theory page uses. The work page does not replace the Jean Lave scholar page.",
    },
    {
      theorySlug: "life-course-perspective",
      workSlug: elderWorkSlug,
      relationship: "core_work",
      sourceUrls: [elderRoutledge.url, elderDoi.url, elderCrossref.url],
      evidenceNotesEn: "The cohort study is the book this theory page uses. The relation keeps the 1974, 1999, and 2018 layers distinct and is not a law claim.",
    },
    {
      theorySlug: msaSlug,
      workSlug: kingdonWorkSlug,
      relationship: "core_work",
      sourceUrls: [pearsonKingdon.url, lsaKingdonBibliography.url],
      evidenceNotesEn: "The work page is the bibliographic record for the book this theory page cites. The relation does not turn the book into an education monograph, and the 2013 catalog date is not the 1984 origin year.",
    },
  ];

  const theoryScholars: SeedTheoryScholar[] = [
    {
      theorySlug: "situated-learning-legitimate-peripheral-participation",
      scholarSlug: laveSlug,
      role: "key_contributor",
      sourceUrls: [lppCrossref.url],
      evidenceNotesEn: "Crossref coauthor of the 1991 book. Key contributor is editorial and is not sole authorship, and it is not authorship of the 1998 book.",
    },
    {
      theorySlug: msaSlug,
      scholarSlug: kingdonScholarSlug,
      role: "key_contributor",
      sourceUrls: [pearsonKingdon.url, epaaArticle.url],
      evidenceNotesEn: "The Pearson catalog names John W. Kingdon as author of the federal policy-process book. Key contributor is editorial and is not a founder claim. The education application remains the EPAA article on the theory page.",
    },
  ];

  return { theories, works, scholars, theoryWorks, theoryScholars };
}
