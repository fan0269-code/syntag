import type {
  ContentSource,
  TheoryContent,
  TheoryDepth,
} from "../../templates/theory-template.ts";
import type { ConceptContent, WorkContent } from "../../templates/knowledge-entity-template.ts";
import type { ScholarContent } from "../../templates/scholar-template.ts";
import type { PathwayContent } from "../../templates/pathway-template.ts";
import { createFirstEnrichmentBatch } from "../content-batches/2026-07-18-first-enrichment.ts";

export type PublicationStatus = "draft" | "published" | "archived";

interface SeedPublication {
  status: PublicationStatus;
  publishedAt?: string;
}

export interface SeedDiscipline extends SeedPublication {
  slug: string;
  titleEn: string;
  descriptionEn: string;
  overviewEn: string;
  content: { en: PathwayContent };
}

export interface SeedField extends SeedPublication {
  slug: string;
  titleEn: string;
  descriptionEn: string;
  disciplineSlug: string;
  content: { en: PathwayContent };
}

export interface SeedTheory extends SeedPublication {
  slug: string;
  primary: boolean;
  depth: TheoryDepth;
  titleEn: string;
  summaryEn: string;
  content: { en: TheoryContent };
}

export interface SeedWork extends SeedPublication {
  slug: string;
  title: string;
  authors: Array<{ name: string; role?: string }>;
  year: number;
  publisher?: string;
  doi?: string;
  isbn?: string;
  content: { en: WorkContent };
}

export interface SeedConcept extends SeedPublication {
  slug: string;
  termEn: string;
  definitionEn: string;
  content: { en: ConceptContent };
}

export interface SeedTheoryWork {
  theorySlug: string;
  workSlug: string;
  relationship: "founding_text" | "major_development" | "critique" | "synthesis" | "core_work" | "core_concept_source" | "tradition_source" | "adjacent_theory_source" | "institutional_context_source" | "normative_resource";
  sourceUrls: string[];
  evidenceNotesEn: string;
}

export interface SeedTheoryConcept {
  theorySlug: string;
  conceptSlug: string;
  importance: "core" | "peripheral";
}

export interface SeedTheoryField {
  fieldSlug: string;
  theorySlug: string;
}

export interface SeedTheoryDiscipline {
  disciplineSlug: string;
  theorySlug: string;
  relevance: "primary" | "secondary";
}

export interface SeedGenealogy {
  id: string;
  sourceSlug: string;
  targetSlug: string;
  relationType: "precursor_of" | "branched_from" | "extended_by" | "critiqued_by" | "integrated_with";
  descriptionEn: string;
  strength: number;
}

export interface SeedScholar extends SeedPublication {
  slug: string;
  name: string;
  bioEn: string;
  content: { en: ScholarContent };
}

export interface SeedTheoryScholar {
  theorySlug: string;
  scholarSlug: string;
  role: "founder" | "key_contributor" | "extender" | "critic" | "synthesizer";
  sourceUrls: string[];
  evidenceNotesEn: string;
}

export interface SeedTopic extends SeedPublication {
  slug: string;
  questionEn: string;
  content: { en: PathwayContent };
}

export interface SeedTopicTheory {
  topicSlug: string;
  theorySlug: string;
  suitability: "high" | "medium" | "low";
  suitabilityNotesEn: string;
  recommendation: "primary" | "supporting" | "not_recommended";
  sourceUrls: string[];
  evidenceNotesEn: string;
}

export interface SeedVerification {
  entitySlug: string;
  fieldPath: string;
  level: "L1_verified" | "L2_editorial" | "L3_pending";
  sources: string[];
  notes: string;
}

export interface SeedCorpus {
  disciplines: SeedDiscipline[];
  fields: SeedField[];
  theories: SeedTheory[];
  works: SeedWork[];
  concepts: SeedConcept[];
  theoryWorks: SeedTheoryWork[];
  theoryConcepts: SeedTheoryConcept[];
  disciplineTheories: SeedTheoryDiscipline[];
  fieldTheories: SeedTheoryField[];
  genealogy: SeedGenealogy[];
  scholars: SeedScholar[];
  theoryScholars: SeedTheoryScholar[];
  topics: SeedTopic[];
  topicTheories: SeedTopicTheory[];
  verifications: SeedVerification[];
}

interface TheoryDraft {
  slug: string;
  depth: TheoryDepth;
  titleEn: string;
  summaryEn: string;
  source: ContentSource;
  origin: string;
  concepts: Array<{ name: string; definition: string; relevance: string }>;
  genealogy: TheoryContent["genealogy"];
  applicableTopic: string;
  applicableRationale: string;
  inapplicableTopic: string;
  inapplicableRationale: string;
  misuseRisk: string;
  analysisDimension: string;
  collectionPrompt: string;
  content?: TheoryContent;
}

function contentFor(draft: TheoryDraft): TheoryContent {
  const core: TheoryContent = {
    what_is_it: draft.summaryEn,
    origins: draft.origin,
    core_concepts: draft.concepts,
    genealogy: draft.genealogy,
    applicable_topics: [
      { topic: draft.applicableTopic, rationale: draft.applicableRationale },
    ],
    inapplicable_topics: [
      { topic: draft.inapplicableTopic, rationale: draft.inapplicableRationale },
    ],
    misuse_risks: [
      draft.misuseRisk,
      "Do not present this framework as a complete explanation before specifying the evidence, level of analysis, and competing explanations in the study.",
    ],
    sources: [draft.source],
    reading_path: [
      {
        order: 1,
        title: draft.source.citation,
        purpose: "Use the authoritative record to establish the framework's original vocabulary and bibliographic context.",
        source_id: draft.source.id,
      },
    ],
    verification: [
      {
        claim: `The cited source is a traceable source record used for ${draft.titleEn}.`,
        evidence_level: "L1",
        source_id: draft.source.id,
        status: "verified",
      },
      {
        claim: "The fit and boundary statements are editorial interpretations for research design.",
        evidence_level: "L2",
        status: "editorial",
      },
      {
        claim: "The operationalization and chapter suggestions require adaptation to the research design and supervisor guidance.",
        evidence_level: "L3",
        status: "proposed",
      },
    ],
  };

  if (draft.depth === "D1") return core;

  return {
    ...core,
    analysis_dimensions: [
      draft.analysisDimension,
      "Mechanisms, conditions, and counterexamples identified in the study material",
    ],
    data_collection: [
      {
        dimension: draft.analysisDimension,
        indicators: ["Participant accounts", "Documents or records", "Observed practices where appropriate"],
        collection_prompt: draft.collectionPrompt,
      },
    ],
    chapter_structure: [
      {
        chapter: "Theoretical framework",
        purpose: "Define the selected concepts in language that matches the research question.",
        theory_use: "Explain what the framework foregrounds and what it does not claim to explain.",
      },
      {
        chapter: "Methods and findings",
        purpose: "Show how concepts shaped data collection and interpretation.",
        theory_use: "Use the concepts as analytic lenses and report counterexamples or limits.",
      },
    ],
    fit_writing: [
      `Use ${draft.titleEn} when the question requires analysis of ${draft.analysisDimension.toLowerCase()}.`,
      "Name the empirical material, analytic level, and boundary condition before claiming theoretical fit.",
    ],
  };
}

const publishedAt = "2026-07-12T00:00:00.000Z";

function theory(draft: TheoryDraft): SeedTheory {
  return {
    slug: draft.slug,
    primary: true,
    depth: draft.depth,
    titleEn: draft.titleEn,
    summaryEn: draft.summaryEn,
    content: { en: draft.content ?? contentFor(draft) },
    status: "published",
    publishedAt,
  };
}

const sources = {
  lifeCourse: {
    id: "elder-1998-life-course",
    citation: "Elder, G. H., Jr. (1998). The life course as developmental theory. Child Development, 69(1), 1-12.",
    url: "https://doi.org/10.1111/j.1467-8624.1998.tb06128.x",
    source_kind: "doi",
    evidence_level: "L1",
    supports: ["Bibliographic record", "Life-course framing"],
  },
  lifeCourseHandbook: {
    id: "elder-johnson-crosnoe-2003-life-course",
    citation: "Elder, G. H., Jr., Johnson, M. K., & Crosnoe, R. (2003). The emergence and development of life course theory. In J. T. Mortimer & M. J. Shanahan (Eds.), Handbook of the Life Course (pp. 3-19). Springer.",
    url: "https://link.springer.com/chapter/10.1007/978-0-306-48247-2_1",
    source_kind: "publisher",
    evidence_level: "L1",
    supports: ["Historical development", "Life-course principles"],
  },
  lifeCourseShanahan: {
    id: "shanahan-2000-pathways-adulthood",
    citation: "Shanahan, M. J. (2000). Pathways to adulthood in changing societies. Annual Review of Sociology, 26, 667-692.",
    url: "https://www.annualreviews.org/content/journals/10.1146/annurev.soc.26.1.667",
    source_kind: "doi",
    evidence_level: "L1",
    supports: ["Pathway variability", "Agency within constraints"],
  },
  lifeCourseMayer: {
    id: "mayer-2009-new-directions",
    citation: "Mayer, K. U. (2009). New directions in life course research. Annual Review of Sociology, 35, 413-433.",
    url: "https://www.annualreviews.org/content/journals/10.1146/annurev.soc.34.040507.134619",
    source_kind: "doi",
    evidence_level: "L1",
    supports: ["Field development", "Causal and theoretical limitations"],
  },
  lifeCourseAlwin: {
    id: "alwin-2012-life-course-concepts",
    citation: "Alwin, D. F. (2012). Integrating varieties of life course concepts. The Journals of Gerontology: Series B, 67B(2), 206-220.",
    url: "https://academic.oup.com/psychsocgerontology/article-abstract/67B/2/206/540716",
    source_kind: "doi",
    evidence_level: "L1",
    supports: ["Conceptual varieties", "Theory-paradigm boundary"],
  },
  lifeCourseMethods: {
    id: "giele-elder-1998-methods",
    citation: "Giele, J. Z., & Elder, G. H., Jr. (Eds.). (1998). Methods of Life Course Research. SAGE.",
    url: "https://uk.sagepub.com/en-gb/eur/methods-of-life-course-research/book7590",
    source_kind: "publisher",
    evidence_level: "L1",
    supports: ["Life-history methods", "Retrospective and prospective evidence"],
  },
  teacherIdentity: {
    id: "kelchtermans-2009-teacher-identity",
    citation: "Kelchtermans, G. (2009). Who I am in how I teach is the message. Teachers and Teaching, 15(2), 257-272.",
    url: "https://doi.org/10.1080/13540600902875332",
    source_kind: "doi",
    evidence_level: "L1",
    supports: ["Bibliographic record", "Teacher self-understanding"],
  },
  teacherIdentityBeijaard: {
    id: "beijaard-meijer-verloop-2004-identity",
    citation: "Beijaard, D., Meijer, P. C., & Verloop, N. (2004). Reconsidering research on teachers' professional identity. Teaching and Teacher Education, 20(2), 107-128.",
    url: "https://scholarlypublications.universiteitleiden.nl/handle/1887/11190",
    source_kind: "university",
    evidence_level: "L1",
    supports: ["Field review", "Definition differences", "Identity characteristics"],
  },
  teacherIdentityLasky: {
    id: "lasky-2005-teacher-identity-agency",
    citation: "Lasky, S. (2005). A sociocultural approach to understanding teacher identity, agency and professional vulnerability in a context of secondary school reform. Teaching and Teacher Education, 21(8), 899-916.",
    url: "https://doi.org/10.1016/j.tate.2005.06.003",
    source_kind: "doi",
    evidence_level: "L1",
    supports: ["Mediated agency", "Reform context", "Professional vulnerability"],
  },
  teacherIdentityAkkerman: {
    id: "akkerman-meijer-2011-dialogical-identity",
    citation: "Akkerman, S. F., & Meijer, P. C. (2011). A dialogical approach to conceptualizing teacher identity. Teaching and Teacher Education, 27(2), 308-319.",
    url: "https://www.sciencedirect.com/science/article/pii/S0742051X10001502",
    source_kind: "journal",
    evidence_level: "L1",
    supports: ["Dialogical identity", "Multiplicity and continuity", "I-positions"],
  },
  teacherIdentityBeauchamp: {
    id: "beauchamp-thomas-2009-teacher-identity",
    citation: "Beauchamp, C., & Thomas, L. (2009). Understanding teacher identity: an overview of issues in the literature and implications for teacher education. Cambridge Journal of Education, 39(2), 175-189.",
    url: "https://www.tandfonline.com/doi/abs/10.1080/03057640902902252",
    source_kind: "journal",
    evidence_level: "L1",
    supports: ["Field overview", "Agency, emotion, narrative, discourse, reflection, and context"],
  },
  teacherIdentityWenger: {
    id: "wenger-1998-communities-practice",
    citation: "Wenger, E. (1998). Communities of Practice: Learning, Meaning, and Identity. Cambridge University Press.",
    url: "https://www.cambridge.org/highereducation/books/communities-of-practice/724C22A03B12D11DFC345EEF0AD3F22A",
    source_kind: "publisher",
    evidence_level: "L1",
    supports: ["Adjacent communities-of-practice comparison"],
  },
  structuration: {
    id: "giddens-1984-constitution",
    citation: "Giddens, A. (1984). The Constitution of Society: Outline of the Theory of Structuration. Polity Press.",
    url: "https://openlibrary.org/books/OL20781260M/The_constitution_of_society",
    source_kind: "library",
    evidence_level: "L1",
    supports: ["Bibliographic record", "Theory of structuration"],
  },
  structurationCentral: { id: "struct-giddens-1979", citation: "Giddens, A. (1979). Central Problems in Social Theory. University of California Press.", url: "https://www.ucpress.edu/books/central-problems-in-social-theory/paper", source_kind: "publisher", evidence_level: "L1", supports: ["Formation", "Action, structure, power, and time-space"] },
  structurationConstitution: { id: "struct-giddens-1984", citation: "Giddens, A. (1984). The Constitution of Society: Outline of the Theory of Structuration. University of California Press.", url: "https://www.ucpress.edu/book/9780520057289/the-constitution-of-society", source_kind: "publisher", evidence_level: "L1", supports: ["Integrated formulation", "Rules, resources, duality, and institutions"] },
  structurationSewell: { id: "struct-sewell-1992", citation: "Sewell, W. H., Jr. (1992). A theory of structure: Duality, agency, and transformation. American Journal of Sociology, 98, 1-29.", url: "https://doi.org/10.1086/229967", source_kind: "doi", evidence_level: "L1", supports: ["Reformulation", "Transformation and agency"] },
  structurationArcher: { id: "struct-archer-1995", citation: "Archer, M. S. (1995). Realist Social Theory: The Morphogenetic Approach. Cambridge University Press.", url: "https://www.cambridge.org/core/books/abs/realist-social-theory/realism-and-morphogenesis/9519E0707622DA9A324D8D10B1490191", source_kind: "publisher", evidence_level: "L1", supports: ["Morphogenetic alternative", "Analytical separation of structure and agency"] },
  structurationAshley: { id: "struct-ashley-2010", citation: "Ashley, L. D. (2010). The use of structuration theory to conceptualize alternative practice in education. British Journal of Sociology of Education, 31(3), 337-351.", url: "https://doi.org/10.1080/01425691003700599", source_kind: "doi", evidence_level: "L1", supports: ["Educational application", "Rules and resources"] },
  communities: {
    id: "lave-wenger-1991-situated-learning",
    citation: "Lave, J., & Wenger, E. (1991). Situated Learning: Legitimate Peripheral Participation. Cambridge University Press.",
    url: "https://doi.org/10.1017/CBO9780511815355",
    source_kind: "doi",
    evidence_level: "L1",
    supports: ["Bibliographic record", "Legitimate peripheral participation"],
  },
  communitiesWenger: { id: "cop-wenger-1998", citation: "Wenger, E. (1998). Communities of Practice: Learning, Meaning, and Identity. Cambridge University Press.", url: "https://www.cambridge.org/core/books/communities-of-practice/724C22A03B12D11DFC345EEF0AD3F22A", source_kind: "publisher", evidence_level: "L1", supports: ["Social participation", "Mutual engagement, joint enterprise, shared repertoire"] },
  communitiesWengerSystems: { id: "cop-wenger-2000", citation: "Wenger, E. (2000). Communities of practice and social learning systems. Organization, 7(2), 225-246.", url: "https://doi.org/10.1177/135050840072002", source_kind: "doi", evidence_level: "L1", supports: ["Social learning systems", "Boundaries and identity"] },
  communitiesContu: { id: "cop-contu-willmott-2003", citation: "Contu, A., & Willmott, H. (2003). Re-embedding situatedness: The importance of power relations in learning theory. Organization Science, 14(3), 283-296.", url: "https://pubsonline.informs.org/doi/10.1287/orsc.14.3.283.15167", source_kind: "journal", evidence_level: "L1", supports: ["Power critique"] },
  communitiesCox: { id: "cop-cox-2005", citation: "Cox, A. (2005). What are communities of practice? A comparative review of four seminal works. Journal of Information Science, 31(6), 527-540.", url: "https://doi.org/10.1177/0165551505057016", source_kind: "doi", evidence_level: "L1", supports: ["Conceptual ambiguity", "Learning, power, and change differences"] },
  communitiesEberle: { id: "cop-eberle-etal-2014", citation: "Eberle, J., Stegmann, K., & Fischer, F. (2014). Legitimate peripheral participation in communities of practice. Journal of the Learning Sciences, 23(2), 216-244.", url: "https://doi.org/10.1080/10508406.2014.883978", source_kind: "doi", evidence_level: "L1", supports: ["Context-specific access conditions"] },
  practice: {
    id: "bourdieu-1977-outline-practice",
    citation: "Bourdieu, P. (1977). Outline of a Theory of Practice. Cambridge University Press.",
    url: "https://doi.org/10.1017/CBO9780511812507",
    source_kind: "doi",
    evidence_level: "L1",
    supports: ["Bibliographic record", "Habitus, field, and practice"],
  },
  practiceLogic: { id: "practice-logic-1990", citation: "Bourdieu, P. (1990). The Logic of Practice. Stanford University Press.", url: "https://www.sup.org/books/sociology/logic-practice", source_kind: "publisher", evidence_level: "L1", supports: ["Practical sense", "Structure, practice, and symbolic domination"] },
  practiceCapital: { id: "practice-capital-1986", citation: "Bourdieu, P. (1986). The Forms of Capital. In J. G. Richardson (Ed.), Handbook of Theory and Research for the Sociology of Education.", url: "https://publish.illinois.edu/crittheory/files/2023/01/Bourdieu-The-Forms-of-Capital.pdf", source_kind: "university", evidence_level: "L1", supports: ["Capital forms", "Conversion and accumulation"] },
  practiceReflexive: { id: "practice-reflexive-1992", citation: "Bourdieu, P., & Wacquant, L. J. D. (1992). An Invitation to Reflexive Sociology. University of Chicago Press.", url: "https://press.uchicago.edu/ucp/books/book/chicago/I/bo3649674.html", source_kind: "publisher", evidence_level: "L1", supports: ["Field", "Reflexivity and symbolic violence"] },
  practiceSymbolic: { id: "practice-symbolic-power-1979", citation: "Bourdieu, P. (1979). Symbolic power. Critique of Anthropology, 4(13-14).", url: "https://doi.org/10.1177/0308275X7900401307", source_kind: "doi", evidence_level: "L1", supports: ["Symbolic power"] },
  socialCapital: {
    id: "coleman-1988-social-capital",
    citation: "Coleman, J. S. (1988). Social capital in the creation of human capital. American Journal of Sociology, 94, S95-S120.",
    url: "https://doi.org/10.1086/228943",
    source_kind: "doi",
    evidence_level: "L1",
    supports: ["Bibliographic record", "Social capital"],
  },
  socialBourdieu: { id: "social-bourdieu-1986", citation: "Bourdieu, P. (1986). The Forms of Capital. In J. G. Richardson (Ed.), Handbook of Theory and Research for the Sociology of Education.", url: "https://publish.illinois.edu/crittheory/files/2023/01/Bourdieu-The-Forms-of-Capital.pdf", source_kind: "university", evidence_level: "L1", supports: ["Bourdieu's social-capital tradition", "Group membership and conversion"] },
  socialPortes: { id: "social-portes-1998", citation: "Portes, A. (1998). Social capital: Its origins and applications in modern sociology. Annual Review of Sociology, 24, 1-24.", url: "https://www.annualreviews.org/content/journals/10.1146/annurev.soc.24.1.1", source_kind: "doi", evidence_level: "L1", supports: ["Competing definitions", "Negative consequences and conceptual stretch"] },
  socialLin: { id: "social-lin-2001", citation: "Lin, N. (2001). Social Capital: A Theory of Social Structure and Action. Cambridge University Press.", url: "https://doi.org/10.1017/CBO9780511815447", source_kind: "doi", evidence_level: "L1", supports: ["Resources accessed through ties", "Action and social structure"] },
  socialWoolcock: { id: "social-woolcock-1998", citation: "Woolcock, M. (1998). Social capital and economic development: Toward a theoretical synthesis and policy framework. Theory and Society, 27, 151-208.", url: "https://link.springer.com/article/10.1023/A%3A1006884930135", source_kind: "doi", evidence_level: "L1", supports: ["Collective and policy context"] },
  teacherDevelopment: {
    id: "day-1999-developing-teachers",
    citation: "Day, C. (1999). Developing Teachers: The Challenges of Lifelong Learning. Falmer Press.",
    url: "https://www.routledge.com/Developing-Teachers-The-Challenges-of-Lifelong-Learning/Day/p/book/9780750707480",
    source_kind: "publisher",
    evidence_level: "L1",
    supports: ["Publisher bibliographic record", "Teacher development"],
  },
  teacherDevelopmentGuskey: { id: "teacher-development-guskey-2002", citation: "Guskey, T. R. (2002). Professional development and teacher change. Teachers and Teaching, 8(3), 381-391.", url: "https://doi.org/10.1080/135406002100000512", source_kind: "doi", evidence_level: "L1", supports: ["Teacher-change model", "Professional development components"] },
  teacherDevelopmentClarke: { id: "teacher-development-clarke-hollingsworth-2002", citation: "Clarke, D., & Hollingsworth, H. (2002). Elaborating a model of teacher professional growth. Teaching and Teacher Education, 18(8), 947-967.", url: "https://doi.org/10.1016/S0742-051X(02)00053-7", source_kind: "doi", evidence_level: "L1", supports: ["Interconnected Model of Professional Growth", "Non-linear domains and mediating processes"] },
  teacherDevelopmentTimperley: { id: "teacher-development-timperley-2007", citation: "Timperley, H., Wilson, A., Barrar, H., & Fung, I. (2007). Teacher Professional Learning and Development: Best Evidence Synthesis Iteration. New Zealand Ministry of Education.", url: "https://www.educationcounts.govt.nz/publications/series/2515/15341", source_kind: "authoritative_web", evidence_level: "L1", supports: ["Professional learning conditions and processes", "Context-sensitive evidence synthesis"] },
  teacherDevelopmentIdentity: { id: "teacher-development-day-etal-2006", citation: "Day, C., Kington, A., Stobart, G., & Sammons, P. (2006). The personal and professional selves of teachers. British Educational Research Journal, 32(4), 601-616.", url: "https://doi.org/10.1080/01411920600775316", source_kind: "doi", evidence_level: "L1", supports: ["Teacher personal and professional selves", "Life, work, and context"] },
  lifeHistory: {
    id: "goodson-2013-narrative-theory",
    citation: "Goodson, I. F. (2013). Developing Narrative Theory: Life Histories and Personal Representation. Routledge.",
    url: "https://www.routledge.com/Developing-Narrative-Theory-Life-Histories-and-Personal-Representation/Goodson/p/book/9780415603614",
    source_kind: "publisher",
    evidence_level: "L1",
    supports: ["Publisher bibliographic record", "Life-history research"],
  },
  lifeHistoryTeachers: { id: "teacher-life-history-goodson-1992", citation: "Goodson, I. F. (Ed.). (1992). Studying Teachers' Lives. Routledge.", url: "https://www.routledge.com/Studying-Teachers-Lives/Goodison/p/book/9780415068581", source_kind: "publisher", evidence_level: "L1", supports: ["Teacher life-history research", "Methods, problems, and possibilities"] },
  lifeHistoryGoodsonSikes: { id: "teacher-life-history-goodson-sikes-2001", citation: "Goodson, I. F., & Sikes, P. (2001). Life History Research in Educational Settings: Learning from Lives. Open University Press.", url: "https://www.mheducation.co.uk/life-history-research-in-educational-settings-9780335207138-emea", source_kind: "publisher", evidence_level: "L1", supports: ["Life-history research in education", "Educational settings"] },
  lifeHistoryJosselson: { id: "teacher-life-history-josselson-2007", citation: "Josselson, R. (2007). The ethical attitude in narrative research: Principles and practicalities. In D. J. Clandinin (Ed.), Handbook of Narrative Inquiry: Mapping a Methodology (pp. 537–566). SAGE Publications.", url: "https://doi.org/10.4135/9781452226552.n21", source_kind: "doi", evidence_level: "L1", supports: ["Narrative research ethics", "Relational mediation"] },
  equity: {
    id: "unesco-2020-inclusion-education",
    citation: "UNESCO. (2020). Global Education Monitoring Report 2020: Inclusion and Education—All Means All.",
    url: "https://unesdoc.unesco.org/ark:/48223/pf0000373718",
    source_kind: "authoritative_web",
    evidence_level: "L1",
    supports: ["Institutional report record", "Educational inclusion and equity context"],
  },
  unescoEducation: { id: "unesco-education", citation: "UNESCO. Education transforms lives.", url: "https://www.unesco.org/en/education", source_kind: "authoritative_web", evidence_level: "L1", supports: ["UNESCO education programme scope", "Lifelong learning, systems, policy, teacher education, access, and quality"] },
  equityOecd: { id: "equity-oecd-2012", citation: "OECD. (2012). Equity and Quality in Education: Supporting Disadvantaged Students and Schools.", url: "https://doi.org/10.1787/9789264130852-en", source_kind: "doi", evidence_level: "L1", supports: ["Equity and quality policy context", "Disadvantaged students and schools"] },
  equitySen: { id: "equity-sen-1992", citation: "Sen, A. (1992). Inequality Reexamined. Harvard University Press.", url: "https://www.hup.harvard.edu/books/9780674452560", source_kind: "publisher", evidence_level: "L1", supports: ["Capability and equality framing"] },
  equityFraser: { id: "equity-fraser-2008", citation: "Fraser, N. (2008). Scales of Justice: Reimagining Political Space in a Globalizing World. Columbia University Press.", url: "https://cup.columbia.edu/book/scales-of-justice/9780231148726", source_kind: "publisher", evidence_level: "L1", supports: ["Redistribution, recognition, and representation"] },
  institutional: {
    id: "dimaggio-powell-1983-iron-cage",
    citation: "DiMaggio, P. J., & Powell, W. W. (1983). The iron cage revisited. American Sociological Review, 48(2), 147-160.",
    url: "https://www.jstor.org/stable/2095101",
    source_kind: "journal",
    evidence_level: "L1",
    supports: ["Bibliographic record", "Institutional isomorphism"],
  },
  institutionalMeyerRowan: { id: "institutional-meyer-rowan-1977", citation: "Meyer, J. W., & Rowan, B. (1977). Institutionalized organizations: Formal structure as myth and ceremony. American Journal of Sociology, 83(2), 340-363.", url: "https://doi.org/10.1086/226550", source_kind: "doi", evidence_level: "L1", supports: ["Institutional rules", "Legitimacy and decoupling"] },
  institutionalBarleyTolbert: { id: "institutional-barley-tolbert-1997", citation: "Barley, S. R., & Tolbert, P. S. (1997). Institutionalization and structuration: Studying the links between action and institution. Organization Studies, 18(1), 93-117.", url: "https://doi.org/10.1177/017084069701800106", source_kind: "doi", evidence_level: "L1", supports: ["Institutionalization process", "Institutional and structuration relation"] },
  streetLevel: {
    id: "lipsky-2010-street-level-bureaucracy",
    citation: "Lipsky, M. (2010). Street-Level Bureaucracy: Dilemmas of the Individual in Public Services (30th anniversary expanded ed.). Russell Sage Foundation.",
    url: "https://www.russellsage.org/publications/book/street-level-bureaucracy",
    source_kind: "publisher",
    evidence_level: "L1",
    supports: ["Publisher bibliographic record", "Street-level bureaucracy"],
  },
  streetLevelOjp: { id: "street-lipsky-1998-ojp", citation: "Lipsky, M. (1998). Toward a Theory of Street-Level Bureaucracy. U.S. Office of Justice Programs record.", url: "https://www.ojp.gov/ncjrs/virtual-library/abstracts/toward-theory-street-level-bureaucracy-criminal-justice-system", source_kind: "authoritative_web", evidence_level: "L1", supports: ["Street-level conditions", "Discretion and direct client interaction"] },
  streetLevelRice: { id: "street-rice-2013", citation: "Rice, D. (2013). Street-level bureaucrats and the welfare state: Toward a micro-institutionalist theory of policy implementation. Administration & Society, 45(9), 1038-1062.", url: "https://doi.org/10.1177/0095399712451895", source_kind: "doi", evidence_level: "L1", supports: ["Street-level and institutional theory relation"] },
  streetLevelDahlvik: { id: "street-dahlvik-2017", citation: "Dahlvik, J. (2017). Asylum as construction work: Theorizing administrative practices. Migration Studies, 5(3), 369-388.", url: "https://doi.org/10.1093/migration/mnx043", source_kind: "doi", evidence_level: "L1", supports: ["Street-level bureaucracy and structuration application"] },
  multipleStreams: {
    id: "kingdon-2011-agendas-alternatives",
    citation: "Kingdon, J. W. (1995). Agendas, Alternatives, and Public Policies (2nd ed.). HarperCollinsCollege.",
    url: "https://openlibrary.org/books/OL24924045M/Agendas_alternatives_and_public_policies",
    source_kind: "library",
    evidence_level: "L1",
    supports: ["Library bibliographic record", "Multiple streams framework"],
  },
  multipleStreamsKingdon: { id: "msf-kingdon-2011", citation: "Kingdon, J. W. (2011 [1984]). Agendas, Alternatives, and Public Policies (updated 2nd ed.). Pearson.", url: "https://www.pearson.com/en-gb/subject-catalog/p/agendas-alternatives-and-public-policies-update-edition-with-an-epilogue-on-health-care-pearson-new-international-edition/P200000004628?view=educator", source_kind: "publisher", evidence_level: "L1", supports: ["Agenda setting", "Actors and alternatives"] },
  multipleStreamsZahariadis: { id: "msf-zahariadis-2023", citation: "Zahariadis, N. (2023). Multiple Streams Framework. Encyclopedia of Public Policy.", url: "https://doi.org/10.1007/978-3-030-90434-0_70-1", source_kind: "doi", evidence_level: "L1", supports: ["Policy-process perspective", "Agenda setting and ambiguity"] },
  multipleStreamsHerweg: { id: "msf-herweg-etal-2018", citation: "Herweg, N., Zahariadis, N., & Zohlnhoefer, R. (2018). The Multiple Streams Framework. In Foundations, Refinements, and Empirical Applications of the Multiple Streams Framework.", url: "https://doi.org/10.4324/9780429494284-2", source_kind: "doi", evidence_level: "L1", supports: ["Framework refinements", "Applications and limitations"] },
  multipleStreamsPortability: { id: "msf-herweg-etal-2022", citation: "Herweg, N., Zahariadis, N., & Zohlnhoefer, R. (2022). Travelling far and wide? Applying the Multiple Streams Framework to policy-making in autocracies. Politische Vierteljahresschrift, 63(2), 203-223.", url: "https://doi.org/10.1007/s11615-022-00393-8", source_kind: "doi", evidence_level: "L1", supports: ["Cross-system portability boundary", "Institutional context"] },
  elderSageProfile: { id: "elder-sage-author-profile", citation: "SAGE. Glen H. Elder author profile.", url: "https://us.sagepub.com/en-us/nam/author/glen-h-elder", source_kind: "publisher", evidence_level: "L1", supports: ["Academic positioning", "Life-course research programme", "Representative publications"] },
  kelchtermansKuProfile: { id: "kelchtermans-ku-leuven-profile", citation: "KU Leuven. Geert Kelchtermans profile, Centre for Educational Innovation and the Development of Teacher and School.", url: "https://ppw.kuleuven.be/onderwijskunde/team/centrum-voor-onderwijsvernieuwing-en-de-ontwikkeling-van-leraar-en-school-cools/00016264", source_kind: "university", evidence_level: "L1", supports: ["Academic positioning", "Teacher and school development research"] },
  giddensLseProfile: { id: "giddens-lse-profile", citation: "London School of Economics and Political Science. Lord Tony Giddens profile.", url: "https://www.lse.ac.uk/people/lord-tony-giddens", source_kind: "university", evidence_level: "L1", supports: ["Academic positioning", "Sociology career record"] },
  bourdieuCollegeProfile: { id: "bourdieu-college-france-profile", citation: "Collège de France. Pierre Bourdieu profile.", url: "https://www.college-de-france.fr/fr/personne/pierre-bourdieu", source_kind: "university", evidence_level: "L1", supports: ["Academic positioning", "Sociology chair record"] },
  bourdieuCollegeChair: { id: "bourdieu-college-france-sociology-chair", citation: "Collège de France. Pierre Bourdieu, Sociology chair record (1982–2001).", url: "https://www.college-de-france.fr/fr/chaire/pierre-bourdieu-sociologie-chaire-statutaire", source_kind: "university", evidence_level: "L1", supports: ["Sociology chair", "Institutional academic record"] },
} satisfies Record<string, ContentSource>;

const firstEnrichmentBatch = createFirstEnrichmentBatch(sources);

function pathwayContent(draft: Omit<PathwayContent, "verification"> & { l1Claim: string; l1SourceId: string }): PathwayContent {
  const { l1Claim, l1SourceId, ...content } = draft;
  return {
    ...content,
    verification: [
      { claim: l1Claim, evidence_level: "L1", source_id: l1SourceId, status: "verified" },
      { claim: "Theory comparisons, navigation routes, and primary/supporting/not-recommended labels are Syntag editorial judgments, not universal rules.", evidence_level: "L2", status: "editorial" },
      { claim: "Data, analysis, and chapter-use suggestions must be adapted to the question, setting, ethics, access, and disciplinary guidance.", evidence_level: "L3", status: "proposed" },
    ],
  };
}

function pathwayOption(theory_slug: string, role: "primary" | "supporting" | "not_recommended", explanatory_focus: string, analysis_unit: string, data_materials: string, strengths: string, limitations: string, source_ids: string[]): PathwayContent["theory_pathways"][number] {
  return { theory_slug, role, explanatory_focus, analysis_unit, data_materials, strengths, limitations, source_ids };
}

function pathwayEntry(entity_type: "topic" | "field" | "theory" | "scholar" | "work" | "concept", slug: string, label: string, relevance: string): PathwayContent["entry_points"][number] {
  return { entity_type, slug, label, relevance };
}

const lifeCourseContent: TheoryContent = {
  what_is_it: "Life Course Theory is best treated as a theoretical perspective for explaining how pathways develop through time. It connects biographies to historical conditions, institutions, relationships, the timing of transitions, and agency exercised within structured opportunities and constraints.",
  core_question: "How do individual pathways unfold through transitions over time, and how are those pathways shaped by historical conditions, institutions, relationships, timing, and agency within constraints?",
  origins: "The perspective grew from longitudinal and life-history research that followed early twentieth-century cohorts beyond childhood. Elder's work from the 1960s onward helped connect individual development with historical change; later syntheses consolidated principles and expanded the tradition without making it one closed causal theory.",
  historical_development: [
    { period: "1920s-1950s: longitudinal and life-history precursors", development: "Early cohort and life-history studies created evidence about lives extending beyond a single developmental stage.", significance: "They exposed the need to connect development with historical and social context.", source_ids: [sources.lifeCourse.id, sources.lifeCourseHandbook.id] },
    { period: "1960s-1970s: empirical formation", development: "Programmatic life-course research developed, including Elder's studies of cohorts living through the Great Depression.", significance: "Historical disruption, family conditions, and later pathways could be analysed together.", source_ids: [sources.lifeCourse.id, sources.lifeCourseHandbook.id] },
    { period: "1990s-2003: conceptual consolidation", development: "Major syntheses articulated life-span development, time and place, timing, linked lives, and agency.", significance: "They provided a shared vocabulary while retaining a plural research tradition.", source_ids: [sources.lifeCourse.id, sources.lifeCourseHandbook.id] },
    { period: "2000s onward: expansion and methodological diversification", development: "Research expanded across institutional contexts, societal disruptions, health, longitudinal data, life histories, archives, and mixed methods.", significance: "Greater empirical breadth also made unresolved causal and conceptual limits more visible.", source_ids: [sources.lifeCourseMayer.id, sources.lifeCourseMethods.id] },
  ],
  key_scholars: [
    { name: "Glen H. Elder Jr.", contribution: "Connected development across the life span with historical time, social relationships, and pathways; he is a central contributor, not the sole originator of every life-course tradition.", representative_work: "The Life Course as Developmental Theory (1998)", source_ids: [sources.lifeCourse.id] },
    { name: "Monica Kirkpatrick Johnson and Robert Crosnoe", contribution: "Coauthored a major historical and conceptual synthesis of life-course principles with Elder.", representative_work: "The Emergence and Development of Life Course Theory (2003)", source_ids: [sources.lifeCourseHandbook.id] },
    { name: "Michael J. Shanahan", contribution: "Examined variable pathways to adulthood and the relationship between active efforts and structured opportunities and constraints.", representative_work: "Pathways to Adulthood in Changing Societies (2000)", source_ids: [sources.lifeCourseShanahan.id] },
    { name: "Karl Ulrich Mayer and Duane F. Alwin", contribution: "Assessed field development, causal limits, and the non-identical meanings attached to life-course concepts.", representative_work: "New Directions in Life Course Research (2009); Integrating Varieties of Life Course Concepts (2012)", source_ids: [sources.lifeCourseMayer.id, sources.lifeCourseAlwin.id] },
  ],
  core_concepts: [
    { name: "Life-span development", definition: "Development and aging continue across life rather than ending at one early stage.", relevance: "It requires the study to specify which phases and continuities or changes matter." },
    { name: "Time and place", definition: "Lives are embedded in historically and geographically specific conditions.", relevance: "It connects biographies to cohorts, institutions, policy regimes, and local settings." },
    { name: "Timing", definition: "The implications of an event can differ according to its position in a life and in historical time.", relevance: "It prevents similar transitions from being assumed to have identical meanings or consequences." },
    { name: "Linked lives", definition: "Lives are interdependent through relationships that transmit resources, obligations, disruption, and support.", relevance: "It shifts analysis from isolated individuals toward relational pathways." },
    { name: "Agency within constraints", definition: "People pursue pathways within socially and historically structured opportunities and limits.", relevance: "It avoids both structural determinism and the idea of unconstrained choice." },
    { name: "Trajectories, transitions, and turning points", definition: "Trajectories are longer pathways, transitions are bounded changes in role or state, and turning points are changes supported as redirecting later pathways.", relevance: "Distinguishing them prevents every event from being labelled a life-changing turning point." },
  ],
  genealogy: [
    { related_theory: "teacher-life-history-research", relationship: "informs", description: "Life-history inquiry can reconstruct meaning and biography, while the life-course perspective additionally asks how timing, institutions, relationships, and historical position pattern pathways." },
  ],
  adjacent_theories: [
    { theory: "Life-span developmental psychology", shared_focus: "Change and continuity across life.", difference: "It may be the stronger primary lens for intra-individual cognitive or psychological mechanisms; life-course sociology foregrounds socially organised pathways and historical context.", source_ids: [sources.lifeCourse.id] },
    { theory: "Age stratification and demography", shared_focus: "Age-graded roles, cohorts, and population patterns.", difference: "Life Course adds biographies, linked lives, timing, and agency and should not be reduced to age categories or event counts.", source_ids: [sources.lifeCourseAlwin.id] },
    { theory: "Narrative and life-history research", shared_focus: "Biography and change through time.", difference: "Narrative inquiry prioritises remembered meaning; Life Course can use narratives but also requires attention to institutional and historical patterning.", source_ids: [sources.lifeCourseMethods.id] },
    { theory: "Event-history and sequence analysis", shared_focus: "Timing, order, duration, and pathways.", difference: "These are analytic strategies, not substitutes for a theory of why pathways differ or evidence that sequence alone is causal.", source_ids: [sources.lifeCourseMayer.id] },
  ],
  applicable_topics: [
    { topic: "Cohort pathways under historical or policy change", rationale: "The question connects biographies with period-specific institutions or disruptions." },
    { topic: "Timing and sequence of educational, work, care, family, or migration transitions", rationale: "The perspective can examine how transition order and timing relate to later pathways." },
    { topic: "Linked pathways among family members, peers, or colleagues", rationale: "Linked lives makes relational interdependence an explicit part of the explanation." },
    { topic: "Agency under unequal institutional conditions", rationale: "It supports analysis of action together with opportunities, rules, resources, and constraints." },
  ],
  inapplicable_topics: [
    { topic: "A one-time attitude or outcome with no temporal, relational, institutional, or historical question", rationale: "The central explanatory dimensions of the perspective would not be used." },
    { topic: "An immediate intervention effect without pathway or timing evidence", rationale: "An evaluation or causal framework is usually a better primary choice." },
    { topic: "A specifically cognitive mechanism without social-context analysis", rationale: "A relevant psychological theory may provide the more precise mechanism." },
  ],
  criticisms: [
    { criticism: "Life course is used as theory, paradigm, perspective, and framework with non-identical meanings.", boundary: "Name the principles and mechanisms actually used instead of invoking the label as a complete explanation.", source_ids: [sources.lifeCourseAlwin.id] },
    { criticism: "The field's empirical expansion has outpaced some theory development and causal explanation.", boundary: "Do not infer a mechanism merely because one event precedes another; specify evidence and rival explanations.", source_ids: [sources.lifeCourseMayer.id] },
    { criticism: "Agency can become an abstract synonym for choice.", boundary: "Define the form of agency and document the opportunities and constraints within which action occurs.", source_ids: [sources.lifeCourseShanahan.id] },
  ],
  misuse_risks: [
    "Treating chronological age, cohort membership, or temporal order as a sufficient causal explanation.",
    "Calling every event or transition a turning point without evidence that it redirected a later pathway.",
    "Equating agency with personality or unconstrained individual choice.",
    "Universalising one institution's or cohort's expected timetable as an on-time life course.",
    "Treating retrospective narrative as a complete objective chronology without considering recall, reinterpretation, or missing records.",
  ],
  analysis_dimensions: [
    "Continuity and change across selected life phases",
    "Historical period, cohort, place, and institutional regime",
    "Timing, duration, sequence, and transition type",
    "Linked relationships and transfers of support, obligation, or disruption",
    "Goals, adaptations, blocked alternatives, and documented constraints",
    "Evidence that a transition did or did not redirect a later trajectory",
  ],
  data_collection: [
    { dimension: "Reconstructed transitions and timing", indicators: ["Dated events", "Sequence and duration", "Alternatives considered", "Later reinterpretations"], collection_prompt: "Use an interview timeline or life-history calendar to ask about concrete transitions, their timing, linked people, institutional conditions, and perceived consequences." },
    { dimension: "Historical and institutional context", indicators: ["Policies", "School or employment records", "Archives", "Contemporaneous media"], collection_prompt: "Collect dated records where lawful and ethical, using them to reconstruct context or timing rather than to assign participant meaning without evidence." },
    { dimension: "Current enactment of roles and relationships", indicators: ["Routines", "Interactions", "Resources", "Constraints"], collection_prompt: "Use observation when current practices matter, and combine it with interviews or records if claims concern a past trajectory." },
    { dimension: "Repeated states and pathway patterns", indicators: ["Entries and exits", "Durations", "Cohort differences", "Missingness and attrition"], collection_prompt: "For longitudinal or administrative data, predefine event coding and limits on causal interpretation." },
  ],
  chapter_structure: [
    { chapter: "Literature review", purpose: "Define the selected life-course tradition and the temporal or relational gap.", theory_use: "Distinguish trajectory, transition, and turning point and review relevant contexts and pathways." },
    { chapter: "Theoretical framework", purpose: "Specify selected principles, proposed mechanisms, unit of analysis, rivals, and boundary conditions.", theory_use: "Use only the principles that answer the research question." },
    { chapter: "Methods", purpose: "Justify temporal coverage, sampling or cohort logic, reconstruction, contextual evidence, and limitations.", theory_use: "Show how concepts informed evidence collection without presenting one method as mandatory." },
    { chapter: "Findings and discussion", purpose: "Analyse sequences, timing, relationships, institutions, and agency, including counter-patterns.", theory_use: "Separate observed patterns from theoretical interpretation and state whether evidence supports redirection, association, or a defensible mechanism." },
  ],
  fit_writing: [
    "Use this perspective when the research question genuinely requires time, pathways, relationships, and historically situated institutions.",
    "State which concepts guide the analysis, what evidence can reconstruct change, and what competing explanations remain.",
    "Treat all operationalisation suggestions as options to adapt to the question, ethics, access, population, and disciplinary guidance.",
  ],
  sources: [sources.lifeCourse, sources.lifeCourseHandbook, sources.lifeCourseShanahan, sources.lifeCourseMayer, sources.lifeCourseAlwin, sources.lifeCourseMethods],
  reading_path: [
    { order: 1, level: "Level 1 · Orientation", title: "Elder (1998): developmental problem and historical context", purpose: "Orientation to the perspective's central problem and longitudinal origins.", source_id: sources.lifeCourse.id },
    { order: 2, level: "Level 1 · Orientation", title: "Elder, Johnson, and Crosnoe (2003): principles and history", purpose: "Learn the consolidated principles and their emergence.", source_id: sources.lifeCourseHandbook.id },
    { order: 3, level: "Level 2 · Differentiation", title: "Shanahan (2000): variable pathways, agency, and structure", purpose: "Differentiate pathway variability and agency within constraints.", source_id: sources.lifeCourseShanahan.id },
    { order: 4, level: "Level 2 · Differentiation", title: "Mayer (2009): field limits and causal questions", purpose: "Assess theory-development and causal limits before making explanatory claims.", source_id: sources.lifeCourseMayer.id },
    { order: 5, level: "Level 2 · Differentiation", title: "Alwin (2012): conceptual varieties", purpose: "Compare the non-identical meanings attached to life-course theory, perspective, paradigm, and framework.", source_id: sources.lifeCourseAlwin.id },
    { order: 6, level: "Level 3 · Research design", title: "Giele and Elder (1998): methods of life-course research", purpose: "Evaluate retrospective, prospective, qualitative, and quantitative evidence choices.", source_id: sources.lifeCourseMethods.id },
  ],
  verification: [
    { claim: "Historical development and the classic principles are limited to the linked journal and publisher records.", evidence_level: "L1", source_id: sources.lifeCourseHandbook.id, status: "verified" },
    { claim: "The field-development and causal-limit statements are supported by Mayer's review.", evidence_level: "L1", source_id: sources.lifeCourseMayer.id, status: "verified" },
    { claim: "Comparisons, fit judgments, and the concept relationship model are Syntag editorial interpretations, not universal consensus.", evidence_level: "L2", status: "editorial" },
    { claim: "Research and writing suggestions require adaptation to the question, setting, ethics, data access, and disciplinary guidance.", evidence_level: "L3", status: "proposed" },
  ],
};

const teacherIdentityContent: TheoryContent = {
  what_is_it: "Teacher identity research examines how teachers understand, present, narrate, and negotiate who they are as teachers in relation to biographies, professional commitments, relationships, practices, and changing institutional contexts. Despite the page title, it is a multi-perspective research field rather than one unified theory.",
  core_question: "How do teachers construct, maintain, present, and revise professional self-understandings and identity positions through biography, relationships, practice, institutional conditions, discourse, and agency?",
  origins: "The field developed through several traditions rather than a single founding act. Teacher-thinking and narrative-biographical research made professional self-understanding and career stories visible; later reviews established identity as a distinct teacher-education problem, while sociocultural and dialogical work examined context, agency, vulnerability, multiplicity, and continuity.",
  historical_development: [
    { period: "1980s-1990s: teacher-thinking and narrative-biographical roots", development: "Research moved beyond inventories of knowledge and skill to study how teachers interpreted professional experience and biography.", significance: "It established professional self-understanding and career stories as legitimate research objects.", source_ids: [sources.teacherIdentity.id] },
    { period: "Early 2000s: field review and conceptual clarification", development: "Reviews classified identity-formation, identity-characteristic, and story-based studies while documenting inconsistent definitions.", significance: "Teacher identity became a distinct research problem, but not a settled unified theory.", source_ids: [sources.teacherIdentityBeijaard.id, sources.teacherIdentityBeauchamp.id] },
    { period: "Mid-2000s: reform, sociocultural agency, and vulnerability", development: "Studies examined identity together with mediated agency, policy reform, working conditions, commitment, and professional vulnerability.", significance: "Identity could no longer be treated as an isolated internal trait.", source_ids: [sources.teacherIdentityLasky.id, sources.teacherIdentity.id] },
    { period: "2010s: dialogical approaches to multiplicity and continuity", development: "Dialogical work theorised multiple identity positions together with relative unity and continuity.", significance: "The field gained a way to analyse change without assuming either a fixed essence or limitless fluidity.", source_ids: [sources.teacherIdentityAkkerman.id] },
  ],
  key_scholars: [
    { name: "Douwe Beijaard, Paulien C. Meijer, and Nico Verloop", contribution: "Reviewed and classified research, documented definition differences, and synthesised common characteristics and gaps.", representative_work: "Reconsidering Research on Teachers' Professional Identity (2004)", source_ids: [sources.teacherIdentityBeijaard.id] },
    { name: "Geert Kelchtermans", contribution: "Developed a narrative-biographical account of professional self-understanding, commitment, vulnerability, and reflection.", representative_work: "Who I Am in How I Teach Is the Message (2009)", source_ids: [sources.teacherIdentity.id] },
    { name: "Sue Lasky", contribution: "Connected identity, mediated agency, reform context, and professional vulnerability through a sociocultural lens.", representative_work: "A Sociocultural Approach to Understanding Teacher Identity, Agency and Professional Vulnerability (2005)", source_ids: [sources.teacherIdentityLasky.id] },
    { name: "Sanne F. Akkerman and Paulien C. Meijer", contribution: "Developed a dialogical conceptualisation that holds multiplicity and unity, discontinuity and continuity, and individual and social dimensions together.", representative_work: "A Dialogical Approach to Conceptualizing Teacher Identity (2011)", source_ids: [sources.teacherIdentityAkkerman.id] },
    { name: "Catherine Beauchamp and Lynn Thomas", contribution: "Mapped major issues including self, agency, emotion, narrative, discourse, reflection, and context for teacher education.", representative_work: "Understanding Teacher Identity (2009)", source_ids: [sources.teacherIdentityBeauchamp.id] },
  ],
  core_concepts: [
    { name: "Professional self-understanding", definition: "A teacher's provisional understanding of self and continuing interpretation of professional experience.", relevance: "It makes identity analysable without treating it as a hidden permanent essence; Kelchtermans' five dimensions belong specifically to his framework." },
    { name: "Identity positions and sub-identities", definition: "Multiple positions such as subject expert, caregiver, learner, colleague, or reform implementer that may align, conflict, or be reorganised.", relevance: "It supports analysis of multiplicity while retaining questions about relative unity and continuity." },
    { name: "Narrative and biographical continuity", definition: "The organisation of past experiences, present judgements, and anticipated futures into professional stories.", relevance: "Narrative is a situated construction of continuity, not a transparent extraction of a complete true identity." },
    { name: "Context, recognition, and discourse", definition: "Institutional conditions, professional language, and responses from students, colleagues, leaders, and others that enable, affirm, challenge, or restrict positions.", relevance: "It connects personal interpretation with social, cultural, and structural conditions." },
    { name: "Mediated agency", definition: "Teachers' interpretation, acceptance, negotiation, resistance, or reworking of available positions and work conditions through socially available resources.", relevance: "It avoids portraying either context or individual choice as the sole source of identity change." },
    { name: "Professional vulnerability and identity tension", definition: "Tensions arising when valued commitments, task perceptions, self-evaluations, or positions are threatened by policy, evaluation, relationships, or uncontrollable outcomes.", relevance: "It frames vulnerability as relational and structural as well as personal." },
  ],
  genealogy: [
    { related_theory: "teacher-life-history-research", relationship: "draws_on", description: "Narrative-biographical inquiry is an important source tradition and method, while teacher identity is one phenomenon it can examine." },
    { related_theory: "communities-of-practice", relationship: "adjacent_to", description: "Participation in practice may shape identity, but teacher identity research also addresses biography, emotion, policy, recognition, and multiple positions beyond one community." },
    { related_theory: "life-course-theory", relationship: "integrated_with", description: "Life Course can explain temporal pathways and historical timing while teacher identity focuses on negotiated professional self-understanding." },
  ],
  adjacent_theories: [
    { theory: "Narrative-biographical teacher research", shared_focus: "Career stories, key events, and temporal continuity.", difference: "It is a broader methodological and epistemological tradition; teacher identity is one phenomenon that can be studied through it.", source_ids: [sources.teacherIdentity.id] },
    { theory: "Communities of Practice", shared_focus: "Learning, participation, becoming, and identity in social practice.", difference: "It foregrounds practice, participation, membership, and competence; teacher identity also covers biography, emotion, policy, recognition, and positions not centred on one community.", source_ids: [sources.teacherIdentityWenger.id] },
    { theory: "Dialogical Self Theory", shared_focus: "Multiple positions, dialogue, change, and relative continuity.", difference: "It is a theoretical resource used by one dialogical approach to teacher identity, not a synonym for the whole field.", source_ids: [sources.teacherIdentityAkkerman.id] },
    { theory: "Life Course Theory", shared_focus: "Time, transitions, relationships, and context.", difference: "Life Course foregrounds trajectories, timing, linked lives, and historical time; teacher identity foregrounds how teachers understand, narrate, and negotiate professional selves.", source_ids: [sources.teacherIdentityBeijaard.id, sources.teacherIdentity.id] },
  ],
  applicable_topics: [
    { topic: "Becoming, remaining, moving, or leaving as a teacher across career transitions", rationale: "The question concerns how professional self-understanding is maintained or revised through biography and change." },
    { topic: "Teachers' responses to curriculum, accountability, or school reform", rationale: "Identity, professional commitments, mediated agency, and vulnerability can be studied together in context." },
    { topic: "Negotiation among multiple professional positions", rationale: "The lens can examine conflict and coordination among roles such as subject expert, caregiver, learner, or leader." },
    { topic: "Identity claims and recognition in narrative, interaction, or practice", rationale: "It directs attention to how positions are presented, assigned, affirmed, challenged, or refused." },
  ],
  inapplicable_topics: [
    { topic: "A causal estimate of whether an intervention changes test scores", rationale: "A causal evaluation framework is required; identity may only supplement experience or mechanism questions." },
    { topic: "Teaching-skill proficiency alone", rationale: "Competence assessment does not establish how a teacher understands or negotiates a professional self." },
    { topic: "Policy formation, organisational isomorphism, or resource distribution without identity evidence", rationale: "Policy-process, institutional, or organisational theories better match the primary explanatory task." },
  ],
  criticisms: [
    { criticism: "The field lacks one agreed definition and is sometimes presented as a unified theory.", boundary: "Identify the selected lens and its source; do not invent a founder or treat one framework as the whole field.", source_ids: [sources.teacherIdentityBeijaard.id, sources.teacherIdentityBeauchamp.id] },
    { criticism: "Essentialist accounts treat identity as a fixed inner personality.", boundary: "Analyse provisional self-understandings and situated presentations without claiming access to a complete true self.", source_ids: [sources.teacherIdentity.id] },
    { criticism: "Accounts of unlimited fluidity cannot explain experienced continuity or unity.", boundary: "Examine multiplicity and change together with the work of maintaining relative coherence.", source_ids: [sources.teacherIdentityAkkerman.id] },
    { criticism: "Psychologised accounts can individualise reform pressure and vulnerability.", boundary: "Document policies, power, relationships, work conditions, and mediated agency rather than diagnosing personal weakness.", source_ids: [sources.teacherIdentityLasky.id, sources.teacherIdentity.id] },
  ],
  misuse_risks: [
    "Calling Teacher Identity a single theory founded by one scholar or treating one author's dimensions as a universal model.",
    "Reducing identity to a fixed personality, job title, role description, or stable score.",
    "Treating one interview statement or one observed behaviour as a complete and context-free identity.",
    "Assuming professional vulnerability is personal weakness while ignoring policy, power, relationships, and work conditions.",
    "Presuming a stable, innovative, caring, or reform-oriented identity is universally desirable.",
    "Presenting reflection as a universally effective intervention without specifying its content and context.",
  ],
  analysis_dimensions: [
    "Self-image, self-evaluation, job motivation, task perception, and future perspective when using Kelchtermans' framework",
    "Identity positions claimed, assigned, refused, coordinated, or placed in tension",
    "Biographical events, narrated continuities, revisions, and future projections",
    "Recognition, professional discourse, institutional rules, evaluation, and significant others",
    "Acceptance, negotiation, resistance, alternative action, and constraints on mediated agency",
    "Commitments, emotions, vulnerability, and identity tensions in concrete episodes",
  ],
  data_collection: [
    { dimension: "Professional biography and episode-based meaning", indicators: ["Career timeline", "Critical events", "Past-present-future links", "Revisions across interviews"], collection_prompt: "Consider two or more interviews that reconstruct concrete episodes, who was present, perceived expectations, actions, and later reinterpretations; do not ask only for an abstract identity label." },
    { dimension: "Identity positions, commitments, and institutional expectations", indicators: ["Reflective journals", "Teaching philosophy", "Evaluation feedback", "Policy and meeting documents"], collection_prompt: "Analyse how teachers interpret, use, accept, or resist professional expectations, and record each document's audience and purpose." },
    { dimension: "Identity negotiation in interaction and practice", indicators: ["Position claims", "Recognition or challenge", "Pronouns and categories", "Responses by others"], collection_prompt: "Observation or interaction records may reveal situated positioning; consider participant reflection on selected episodes before equating behaviour with identity." },
    { dimension: "Consistency and variation across sources and time", indicators: ["Contradictory accounts", "Negative cases", "Context-specific presentations", "Researcher and audience effects"], collection_prompt: "Compare interviews, documents, observations, and time points to explain variation rather than search for one true identity." },
  ],
  chapter_structure: [
    { chapter: "Literature review", purpose: "Present teacher identity as a multi-tradition field and select the lens needed for the research problem.", theory_use: "Compare adjacent theories and state what the selected lens cannot explain." },
    { chapter: "Theoretical framework", purpose: "Define each concept from a specific source and specify the unit of analysis.", theory_use: "State whether the concepts are sensitising lenses or propositions and avoid combining incompatible vocabularies without explanation." },
    { chapter: "Methods", purpose: "Explain how evidence can show temporal, relational, and contextual identity presentations.", theory_use: "Report researcher and audience effects, concept-to-code translation, contradictions, and negative cases." },
    { chapter: "Findings", purpose: "Present situated episodes or cross-time patterns with an evidence chain.", theory_use: "Distinguish participant self-description, others' positioning, observed action, and researcher interpretation." },
    { chapter: "Discussion", purpose: "Explain continuity and change, person and context, and position and action using the chosen lens.", theory_use: "Separate supported interpretation from alternatives and do not generalise one setting into universal identity stages." },
  ],
  fit_writing: [
    "Choose a specific teacher-identity lens that matches the research question rather than citing the field as one settled theory.",
    "State whether the analytic unit is a career story, concrete episode, interactional position, community participation, or a justified combination.",
    "Treat identity evidence as situated presentation and interpretation, and adapt research suggestions to ethics, setting, participants, access, and disciplinary guidance.",
  ],
  sources: [sources.teacherIdentityBeijaard, sources.teacherIdentity, sources.teacherIdentityLasky, sources.teacherIdentityAkkerman, sources.teacherIdentityBeauchamp, sources.teacherIdentityWenger],
  reading_path: [
    { order: 1, level: "Level 1 · Orientation", title: "Beijaard, Meijer, and Verloop (2004): field map and definition problems", purpose: "Establish the field's research types, shared characteristics, and unresolved definitions.", source_id: sources.teacherIdentityBeijaard.id },
    { order: 2, level: "Level 1 · Orientation", title: "Beauchamp and Thomas (2009): teacher-education issue map", purpose: "Orient to agency, emotion, narrative, discourse, reflection, and context.", source_id: sources.teacherIdentityBeauchamp.id },
    { order: 3, level: "Level 2 · Conceptual lenses", title: "Kelchtermans (2009): self-understanding and vulnerability", purpose: "Study a narrative-biographical framework without treating it as the only model.", source_id: sources.teacherIdentity.id },
    { order: 4, level: "Level 2 · Conceptual lenses", title: "Akkerman and Meijer (2011): dialogical identity", purpose: "Examine multiplicity with relative unity and continuity.", source_id: sources.teacherIdentityAkkerman.id },
    { order: 5, level: "Level 3 · Context and application", title: "Lasky (2005): agency, reform context, and vulnerability", purpose: "Connect identity with sociocultural conditions and mediated agency.", source_id: sources.teacherIdentityLasky.id },
    { order: 6, level: "Level 3 · Context and application", title: "Wenger (1998): adjacent Communities of Practice lens", purpose: "Compare identity-through-participation with the broader teacher-identity field.", source_id: sources.teacherIdentityWenger.id },
  ],
  verification: [
    { claim: "The field-review, definition, and common-characteristic statements are limited to Beijaard, Meijer, and Verloop's review record.", evidence_level: "L1", source_id: sources.teacherIdentityBeijaard.id, status: "verified" },
    { claim: "The professional self-understanding and vulnerability account is attributed specifically to Kelchtermans' framework.", evidence_level: "L1", source_id: sources.teacherIdentity.id, status: "verified" },
    { claim: "The multi-tradition positioning, historical stages, comparisons, and fit judgments are Syntag editorial syntheses.", evidence_level: "L2", status: "editorial" },
    { claim: "Interview, document, observation, analysis, and chapter suggestions require adaptation to the question, ethics, setting, access, and disciplinary guidance.", evidence_level: "L3", status: "proposed" },
  ],
};

const structurationContent: TheoryContent = {
  what_is_it: "Structuration Theory explains how recurrent social practices draw on and reproduce or modify rules and resources across time and space. It treats structure and agency as a duality, rather than as two isolated causal variables.",
  origins: "Giddens developed the theory through debates with interpretive sociology, functionalism, and structuralism; Central Problems in Social Theory (1979) formed the approach and The Constitution of Society (1984) gave its integrated formulation.",
  core_concepts: [
    { name: "Rules and resources", definition: "Interpretive, normative, authoritative, and allocative means implicated in practice.", relevance: "They make specific enablements and constraints observable rather than treating structure as a thing." },
    { name: "Duality of structure", definition: "Structure is both the medium and outcome of recursively organised practice.", relevance: "It prevents a simple structure-versus-agency split." },
    { name: "Knowledgeable agency and reflexive monitoring", definition: "Actors can monitor much of their conduct and give accounts, without possessing complete transparent knowledge.", relevance: "It directs attention to practical knowledge, accounts, and limits." },
    { name: "Power and domination", definition: "Agency concerns making a difference; resources connect action to unequal capacities to authorise, allocate, or sanction.", relevance: "It prevents power from being reduced to formal rank." },
    { name: "Social systems and routines", definition: "Systems are reproduced through regular practices rather than existing apart from them.", relevance: "It makes recurrence and variation empirical questions." },
    { name: "Time-space and institutionalisation", definition: "Encounters and institutions are organised across particular sites, schedules, and histories.", relevance: "It requires the study to specify where and when practice is organised." },
  ],
  genealogy: [{ related_theory: "practice-theory-bourdieu", relationship: "adjacent_to", description: "Both analyse socially organised practice, but Bourdieu foregrounds habitus, capital, field position, and symbolic power where Structuration foregrounds rules, resources, reflexive conduct, and recursive duality." }],
  explanatory_mechanisms: [
    { mechanism: "Recursive enactment", process: "Actors draw on available rules and resources in situated conduct; repeated enactment reproduces a social system and altered enactment may contribute to change.", evidence_focus: "Episodes showing a rule or resource being used, contested, or reworked across time.", source_ids: [sources.structurationConstitution.id] },
    { mechanism: "Power through resources", process: "Authoritative and allocative resources shape who can coordinate, allocate, authorise, or redefine practice.", evidence_focus: "Decision records, resource flows, sanctions, and competing accounts of authority.", source_ids: [sources.structurationConstitution.id, sources.structurationAshley.id] },
  ],
  analysis_unit: "A recurrent practice in a defined time-space setting, analysed through the actors, rules, resources, routines, and power relations involved—not an organisation in the abstract.",
  theory_comparisons: [
    { theory: "Practice Theory (Bourdieu)", role: "main_candidate", shared_focus: "Both reject a simple individual/structure split and analyse socially organised practice.", difference: "Bourdieu foregrounds habitus, unequal capital, field positions, and symbolic power; Structuration foregrounds rules/resources and recursive duality.", when_prefer: "Prefer Bourdieu when durable dispositions, capital, field position, or symbolic domination are the proposed mechanisms.", source_ids: [sources.structurationSewell.id] },
    { theory: "Morphogenetic Theory", role: "alternative", shared_focus: "Both address structure, agency, constraint, and social change.", difference: "Morphogenetic theory analytically separates prior structures, interaction, and later elaboration; Structuration stresses their duality in ongoing practice.", when_prefer: "Prefer it when temporal sequencing and autonomous structural conditioning must be explicit claims.", source_ids: [sources.structurationArcher.id] },
  ],
  boundary_conditions: [
    { condition: "The study observes only policy text, an organisation chart, or individual attitudes.", implication: "Those materials alone cannot show rules/resources as enacted in recursive practice.", source_ids: [sources.structurationConstitution.id] },
    { condition: "The question needs separately measured pre-existing structural effects before action.", implication: "A morphogenetic or other realist account may provide a clearer primary framework.", source_ids: [sources.structurationArcher.id] },
  ],
  applicable_topics: [{ topic: "Organisational routines and change", rationale: "It examines how people enact, sustain, negotiate, or alter rules and resources." }, { topic: "Professional or policy implementation practice", rationale: "It connects everyday conduct with power, institutional reproduction, and local adaptation." }, { topic: "Technology-mediated coordination", rationale: "It can trace how platforms and organisational resources are drawn on in recurrent practice." }],
  inapplicable_topics: [{ topic: "A one-off intervention effect with no practice or rule/resource evidence", rationale: "A causal evaluation framework is usually primary." }, { topic: "Inequality explained chiefly through field position and capital", rationale: "Bourdieu offers a more precise vocabulary for that mechanism." }],
  misuse_risks: ["Using structure and agency as a slogan without identifying rules, resources, practices, and time-space settings.", "Treating a policy or organisation chart as the complete meaning of structure.", "Calling any reciprocal influence a duality of structure.", "Claiming institutional transformation from an intention or isolated act without tracing changed practice and resources."],
  analysis_dimensions: ["Rules and resources drawn on in practice", "Routine reproduction and exceptional variation", "Authority, allocation, sanction, and power", "Reflexive accounts and practical consciousness", "Time-space organisation of encounters", "Evidence of adaptation versus structural transformation"],
  data_collection: [{ dimension: "Enacted rules and resources", indicators: ["Episode accounts", "Policy and workflow records", "Resource allocation"], collection_prompt: "Combine concrete episode interviews with documents that show which rules and resources participants drew on, reproduced, altered, or resisted." }, { dimension: "Routine and variation", indicators: ["Repeated observation", "Workflow traces", "Exceptional cases"], collection_prompt: "Observe recurring practice where feasible and compare routine with exceptional cases before claiming reproduction or transformation." }, { dimension: "Power and time-space", indicators: ["Decision records", "Schedules", "Sites and encounters"], collection_prompt: "Trace who can authorise or allocate, and specify how sites, schedules, and histories organise the practice." }],
  chapter_structure: [{ chapter: "Literature review", purpose: "Distinguish duality from a generic structure-versus-agency slogan.", theory_use: "Identify the debate and rival accounts." }, { chapter: "Theoretical framework", purpose: "Specify practices, rules/resources, power relations, and time-space scope.", theory_use: "State the proposed recursive mechanism." }, { chapter: "Methods", purpose: "Justify why evidence reaches enacted practice rather than only formal design.", theory_use: "Explain episode, document, and observation choices." }, { chapter: "Findings and discussion", purpose: "Show recurrence, adaptation, and limits of claimed change.", theory_use: "Separate local adaptation from evidence of structural transformation." }],
  fit_writing: ["Name the recurrent practice and time-space setting before claiming Structuration Theory fits.", "State the rule/resource and power mechanism rather than using a generic micro-macro bridge claim.", "Treat data and chapter suggestions as options adapted to question, ethics, access, and disciplinary guidance."],
  sources: [sources.structuration, sources.structurationCentral, sources.structurationConstitution, sources.structurationSewell, sources.structurationArcher, sources.structurationAshley],
  reading_path: [{ order: 1, level: "Level 1 · Orientation", title: "Giddens (1979): Central Problems", purpose: "Establish formation and core questions.", source_id: sources.structurationCentral.id }, { order: 2, level: "Level 1 · Core formulation", title: "Giddens (1984): The Constitution of Society", purpose: "Study rules, resources, duality, power, and time-space.", source_id: sources.structurationConstitution.id }, { order: 3, level: "Level 2 · Reformulation", title: "Sewell (1992): A Theory of Structure", purpose: "Examine transformation and dialogue with Bourdieu.", source_id: sources.structurationSewell.id }, { order: 4, level: "Level 3 · Alternative and application", title: "Archer (1995) and Ashley (2010)", purpose: "Compare morphogenesis and a context-specific education application.", source_id: sources.structurationArcher.id }],
  verification: [{ claim: "Giddens's books support the page's bibliographic, rules/resources, duality, power, and time-space claims.", evidence_level: "L1", source_id: sources.structurationConstitution.id, status: "verified" }, { claim: "Comparisons, relationship models, and fit judgments are Syntag editorial interpretations, not universal consensus.", evidence_level: "L2", status: "editorial" }, { claim: "Research and writing suggestions require adaptation to question, setting, ethics, access, and disciplinary guidance.", evidence_level: "L3", status: "proposed" }],
};

const communitiesContent: TheoryContent = {
  what_is_it: "Communities of Practice is a social learning theory that examines how people develop competence, meaning, and identity through sustained participation in shared practice. A named group is not automatically a community of practice.",
  origins: "Lave and Wenger's Situated Learning (1991) introduced legitimate peripheral participation through situated learning; Wenger's 1998 formulation developed social participation, practice, community, meaning, identity, and boundaries.",
  core_concepts: [{ name: "Practice", definition: "Shared, historically developed doing through which meaning and competence are negotiated.", relevance: "It shifts inquiry beyond task lists or individual acquisition." }, { name: "Mutual engagement", definition: "Sustained relations among people involved in consequential practice.", relevance: "Co-location or formal membership alone is insufficient." }, { name: "Joint enterprise", definition: "What participants negotiate as worth pursuing and for which they develop accountability.", relevance: "It avoids assuming identical goals from formal objectives." }, { name: "Shared repertoire", definition: "Routines, stories, terms, tools, documents, and symbols that carry practice.", relevance: "It makes communal resources and their use observable." }, { name: "Participation and reification", definition: "Meaning is negotiated through engagement and through objects, tools, descriptions, and categories.", relevance: "It prevents documents from being treated as self-explanatory." }, { name: "Legitimate peripheral participation and identity trajectory", definition: "Newcomers' access to meaningful practice and changing recognition can shape participation and identity.", relevance: "It must not be treated as a universal novice-to-expert ladder." }],
  genealogy: [{ related_theory: "teacher-identity-theory", relationship: "integrated_with", description: "Participation in practice can shape professional identity, while teacher identity also examines biography, emotion, policy, and negotiated self-understanding beyond one community." }],
  explanatory_mechanisms: [{ mechanism: "Learning through participation", process: "Sustained engagement in a jointly negotiated practice makes competence, meaning, and identity contestable and learnable.", evidence_focus: "Interaction around consequential work, mutual accountability, and changing recognition.", source_ids: [sources.communities.id, sources.communitiesWenger.id] }, { mechanism: "Access to consequential practice", process: "Legitimacy, task access, artefacts, and established members shape whether newcomers can participate meaningfully.", evidence_focus: "Entry episodes, task allocation, mentoring, gatekeeping, and non-participation.", source_ids: [sources.communities.id, sources.communitiesEberle.id] }],
  analysis_unit: "A socially sustained practice and its participants, engagement, enterprise, repertoire, and boundaries—not merely a formal team, organisation, programme, or online group.",
  theory_comparisons: [{ theory: "Activity Theory", role: "main_candidate", shared_focus: "Both treat learning as social, mediated, and embedded in collective activity.", difference: "CoP centres participation, belonging, identity, and practice coherence; Activity Theory centres an activity system, object, artefacts, rules, division of labour, and contradictions.", when_prefer: "Prefer Activity Theory when the primary unit is a multi-role activity system and its object or contradictions.", source_ids: [sources.communitiesWenger.id] }, { theory: "Social Network Analysis", role: "alternative", shared_focus: "Both can examine ties, access, knowledge circulation, and boundaries.", difference: "CoP requires evidence of practice, mutual engagement, enterprise, and repertoire; network analysis models relational pattern and position.", when_prefer: "Prefer network analysis when brokerage, density, diffusion, or tie structure is the explanatory object.", source_ids: [sources.communitiesCox.id] }],
  boundary_conditions: [{ condition: "A short-lived team, platform, or programme has no evidence of shared practice or sustained engagement.", implication: "Do not label it a community of practice solely because it has members or collaboration.", source_ids: [sources.communitiesWenger.id, sources.communitiesCox.id] }, { condition: "Hierarchy, coercion, language, exclusion, or power is central but not analytically developed.", implication: "CoP alone may conceal key mechanisms; make power and context explicit or select a complementary theory.", source_ids: [sources.communitiesContu.id] }],
  applicable_topics: [{ topic: "Professional learning through sustained participation", rationale: "It asks how competence and identity develop through access to practice." }, { topic: "Newcomer access, mentoring, and recognition", rationale: "LPP directs attention to legitimacy and consequential participation." }, { topic: "Shared repertoires and boundary crossing", rationale: "It can study tools, routines, language, and negotiated accountability." }],
  inapplicable_topics: [{ topic: "A formal team with only an organisation chart or attendance list", rationale: "Those do not evidence mutual engagement, enterprise, or repertoire." }, { topic: "A question only about tie count or information diffusion", rationale: "Network analysis may be a more precise primary approach." }],
  misuse_risks: ["Calling every collaborative group a community of practice.", "Treating LPP as a linear universal ladder from novice to expert.", "Assuming participation automatically produces learning, equity, innovation, or benefit.", "Hiding hierarchy, language, exclusion, or power behind the word community."],
  analysis_dimensions: ["Mutual engagement and recognition", "Joint enterprise and negotiated accountability", "Shared repertoire and reification", "Newcomer access to consequential tasks", "Identity trajectories and changing competence", "Boundaries, power, exclusion, and non-participation"],
  data_collection: [{ dimension: "Engagement and enterprise", indicators: ["Interaction records", "Meeting or work observation", "Task decisions"], collection_prompt: "Observe real work where ethically possible and ask participants about concrete episodes of accountability, disagreement, and collaboration." }, { dimension: "Repertoire and reification", indicators: ["Tools", "Templates", "Stories and terms"], collection_prompt: "Collect locally meaningful artefacts and versions, then examine how participants use rather than merely possess them." }, { dimension: "Access and boundaries", indicators: ["Entry episodes", "Task allocation", "Gatekeeping and departure"], collection_prompt: "Interview newer and established participants and follow access or boundary-crossing processes over time, including non-participation." }],
  chapter_structure: [{ chapter: "Literature review", purpose: "Differentiate CoP from generic groups, networks, and formal programmes.", theory_use: "Define the social-learning claim and critiques." }, { chapter: "Theoretical framework", purpose: "Select practice dimensions and state power and boundary assumptions.", theory_use: "Specify what would count as a CoP, partial CoP, or non-CoP." }, { chapter: "Methods", purpose: "Justify evidence about practice rather than attitudes alone.", theory_use: "Explain observation, artefact, and episode choices." }, { chapter: "Findings and discussion", purpose: "Trace engagement, enterprise, repertoire, trajectories, and countercases.", theory_use: "State whether community was evidenced, contested, partial, or absent." }],
  fit_writing: ["Show evidence of practice, mutual engagement, joint enterprise, and repertoire before naming a CoP.", "Specify whether learning, access, participation, identity, or boundary crossing is the explanatory focus.", "Adapt data and chapter suggestions to question, ethics, access, and disciplinary guidance."],
  sources: [sources.communities, sources.communitiesWenger, sources.communitiesWengerSystems, sources.communitiesContu, sources.communitiesCox, sources.communitiesEberle],
  reading_path: [{ order: 1, level: "Level 1 · Orientation", title: "Lave and Wenger (1991): Situated Learning", purpose: "Learn LPP and situated participation.", source_id: sources.communities.id }, { order: 2, level: "Level 1 · Core formulation", title: "Wenger (1998): Communities of Practice", purpose: "Study practice, community, meaning, and identity.", source_id: sources.communitiesWenger.id }, { order: 3, level: "Level 2 · Differentiation", title: "Cox (2005): comparative review", purpose: "Examine ambiguity across seminal texts.", source_id: sources.communitiesCox.id }, { order: 4, level: "Level 3 · Power and application", title: "Contu and Willmott (2003); Eberle et al. (2014)", purpose: "Study power and a context-specific access investigation.", source_id: sources.communitiesContu.id }],
  verification: [{ claim: "The cited books and journal records support the page's limited claims about LPP, social participation, practice, and named critiques.", evidence_level: "L1", source_id: sources.communitiesWenger.id, status: "verified" }, { claim: "Comparisons, concept relationships, and fit judgments are Syntag editorial interpretations, not universal consensus.", evidence_level: "L2", status: "editorial" }, { claim: "Research and writing suggestions require adaptation to question, setting, ethics, access, and disciplinary guidance.", evidence_level: "L3", status: "proposed" }],
};

const practiceContent: TheoryContent = {
  what_is_it: "Bourdieu's Practice Theory explains patterned practice through relations among habitus, capital, and field, including the recognition and contestation of symbolic value. It is not a claim that social origin mechanically determines action.",
  origins: "Outline of a Theory of Practice (1977) and The Logic of Practice (1990) are central formulations; later work with Wacquant develops relationalism, field, symbolic violence, and reflexivity.",
  core_concepts: [{ name: "Habitus", definition: "Historically formed, durable but revisable dispositions that orient perception and practical judgment.", relevance: "It connects prior conditions to practice without reducing actors to fixed traits." }, { name: "Field", definition: "A structured arena of positions, stakes, investments, and criteria of value.", relevance: "It requires relational evidence, not merely a named institution." }, { name: "Capital", definition: "Economic, cultural, social, and other resources whose value and conversion vary by field.", relevance: "It makes unequal resources and their recognition analysable." }, { name: "Symbolic capital and recognition", definition: "Resources become advantageous partly when recognised as legitimate.", relevance: "It links classification, status, and power to material resources." }, { name: "Practical sense", definition: "Situated practical mastery and improvisation rather than complete conscious calculation.", relevance: "It directs attention to routine judgment and disruption." }, { name: "Doxa and symbolic violence", definition: "Taken-for-granted classifications and forms of domination that may be reproduced or contested.", relevance: "It prevents hierarchy from being assumed rather than evidenced." }],
  genealogy: [{ related_theory: "social-capital-theory", relationship: "informs", description: "Bourdieu treats social capital as one capital form whose value and conversion depend on field position, other capitals, and recognition." }, { related_theory: "structuration-theory", relationship: "adjacent_to", description: "Both reject a simple structure-agency split, but they propose different analytic vocabularies and mechanisms." }],
  explanatory_mechanisms: [{ mechanism: "Field-conditioned valuation", process: "A field organises positions, stakes, and criteria that make some resources valuable, convertible, or legitimate.", evidence_focus: "Position relations, evaluation criteria, allocation, recognition, and failed as well as successful conversions.", source_ids: [sources.practiceCapital.id, sources.practiceReflexive.id] }, { mechanism: "Habitus and practical sense", process: "Prior social conditions inform dispositions and practical judgments as actors encounter field-specific opportunities and constraints.", evidence_focus: "Trajectory-linked episodes, recurring classifications, routines, improvisations, and countercases.", source_ids: [sources.practice.id, sources.practiceLogic.id] }],
  analysis_unit: "A relationally defined field and the positions, capitals, classifications, and practices within it; an individual account is evidence within that relation, not the whole unit by default.",
  theory_comparisons: [{ theory: "Structuration Theory", role: "main_candidate", shared_focus: "Both reject a simple structure-versus-agency split and analyse recurrent social practice.", difference: "Structuration foregrounds rules, resources, and recursive duality; Bourdieu foregrounds habitus, capital, field position, recognition, and symbolic power.", when_prefer: "Prefer Structuration when recursive enactment of rules/resources is the central mechanism rather than unequal capital and field position.", source_ids: [sources.practice.id] }, { theory: "Communities of Practice", role: "alternative", shared_focus: "Both treat practice as social rather than only individual skill.", difference: "CoP foregrounds participation, learning, membership, competence, and repertoire; Bourdieu foregrounds stratification, capital, classification, and field struggles.", when_prefer: "Prefer CoP when learning through sustained participation is primary and wider field inequality is not the mechanism to explain.", source_ids: [sources.practiceLogic.id] }],
  boundary_conditions: [{ condition: "No defensible field, position, resource, recognition, or disposition question is present.", implication: "Do not use Bourdieu merely to decorate a technical workflow or individual outcome study.", source_ids: [sources.practiceReflexive.id] }, { condition: "Capital is inferred from a demographic label, credential, contact, or taste alone.", implication: "Document acquisition, field-specific value, conversion, and recognition before naming a resource capital.", source_ids: [sources.practiceCapital.id] }],
  applicable_topics: [{ topic: "Unequal recognition and position in educational or organisational fields", rationale: "It connects classification, capital, and field relations with practice." }, { topic: "Resource conversion and mobility across social worlds", rationale: "It examines why similar resources have different value in different fields." }, { topic: "Taken-for-granted standards and contested legitimacy", rationale: "It can trace doxa, symbolic recognition, and struggle." }],
  inapplicable_topics: [{ topic: "A narrowly technical workflow with no relational or stratification question", rationale: "Task analysis is likely more precise." }, { topic: "A short interaction with no field history, capital, practice, or disposition evidence", rationale: "The required mechanisms cannot be supported." }],
  misuse_risks: ["Treating habitus as destiny.", "Equating an institution with a field.", "Calling any credential, contact, or taste capital without value and conversion evidence.", "Assuming symbolic violence or domination before examining classification and recognition.", "Listing habitus, capital, and field without a proposed mechanism."],
  analysis_dimensions: ["Trajectories and practical classifications", "Field positions, entrants, incumbents, and stakes", "Capital acquisition, scarcity, conversion, and value", "Recognition, status, and symbolic classification", "Routine practice and improvisation", "Doxa, contestation, and researcher reflexivity"],
  data_collection: [{ dimension: "Habitus and practical sense", indicators: ["Life histories", "Episode interviews", "Observed routines"], collection_prompt: "Trace trajectories and practical judgments with episodes; do not infer habitus from one quote or social category." }, { dimension: "Field and capital", indicators: ["Evaluation criteria", "Portfolios and records", "Interviews across positions"], collection_prompt: "Map positions, stakes, resources, and field-specific value using documents and accounts from more than one position." }, { dimension: "Recognition and struggle", indicators: ["Promotion or award records", "Meeting interaction", "Controversy and failed conversion"], collection_prompt: "Compare recognised and unrecognised resources, including countercases where a resource did not convert." }],
  chapter_structure: [{ chapter: "Literature review", purpose: "Separate Bourdieu's theory from wider practice-oriented scholarship.", theory_use: "Define the specific relational problem." }, { chapter: "Theoretical framework", purpose: "Specify field, capital, habitus/practice relation, and rival explanations.", theory_use: "State the proposed reproductive or transformative mechanism." }, { chapter: "Methods", purpose: "Explain evidence for position, history, recognition, and reflexivity.", theory_use: "Separate participant claims, documents, and researcher inference." }, { chapter: "Findings and discussion", purpose: "Show patterned practice, countercases, and failed conversions.", theory_use: "Distinguish association from a supported mechanism." }],
  fit_writing: ["Name the field, positions, stakes, and capital at issue before claiming fit.", "Explain how resources acquire value and how habitus/practical sense enters observable practice.", "Adapt research suggestions to the question, setting, ethics, access, and disciplinary guidance."],
  sources: [sources.practice, sources.practiceLogic, sources.practiceCapital, sources.practiceReflexive, sources.practiceSymbolic],
  reading_path: [{ order: 1, level: "Level 1 · Orientation", title: "Bourdieu (1977): Outline of a Theory of Practice", purpose: "Establish habitus, structure/practice, and symbolic power.", source_id: sources.practice.id }, { order: 2, level: "Level 1 · Core formulation", title: "Bourdieu (1990): The Logic of Practice", purpose: "Study practical sense and ethnographic grounding.", source_id: sources.practiceLogic.id }, { order: 3, level: "Level 2 · Capital and recognition", title: "Bourdieu (1986) and Symbolic Power (1979)", purpose: "Differentiate capital forms, conversion, and symbolic power.", source_id: sources.practiceCapital.id }, { order: 4, level: "Level 3 · Relational research craft", title: "Bourdieu and Wacquant (1992)", purpose: "Study field, reflexivity, and objections.", source_id: sources.practiceReflexive.id }],
  verification: [{ claim: "The listed publisher, university, and journal records support the page's limited claims about Bourdieu's works and vocabulary.", evidence_level: "L1", source_id: sources.practiceLogic.id, status: "verified" }, { claim: "Definitions, comparisons, and fit judgments are Syntag editorial syntheses, not universal consensus.", evidence_level: "L2", status: "editorial" }, { claim: "Research and writing suggestions require adaptation to question, setting, ethics, access, and disciplinary guidance.", evidence_level: "L3", status: "proposed" }],
};

const socialCapitalContent: TheoryContent = {
  what_is_it: "Social Capital Theory is a family of related but non-identical theories about how relationships, membership, network structure, obligations, norms, trust, recognition, and brokerage can make resources and opportunities accessible. It is not one settled measure or a uniformly positive asset.",
  origins: "Bourdieu, Coleman, Lin, and later collective or development-oriented accounts offer distinct formulations. Portes's review is a key warning that definitions, levels of analysis, positive functions, negative consequences, and causal claims must not be collapsed.",
  core_concepts: [{ name: "Ties, membership, and relational location", definition: "Relations and group membership through which access may be organised.", relevance: "It requires a named relation and setting rather than a generic contact count." }, { name: "Resources accessible through relations", definition: "Information, advice, support, referrals, recognition, or opportunities reached through connections.", relevance: "It focuses on what is accessible rather than ties alone." }, { name: "Access, mobilisation, and return", definition: "Potential reach, actual activation, and outcome are analytically distinct.", relevance: "It prevents availability from being treated as benefit." }, { name: "Obligations, norms, trust, and closure", definition: "Possible relational mechanisms shaping exchange, coordination, sanction, or support.", relevance: "They are contingent mechanisms, not universal ingredients." }, { name: "Network structure and position", definition: "Closure, bridging, brokerage, centrality, and boundary crossing can describe relational opportunity structures.", relevance: "Metrics need a resource-flow mechanism to have theoretical meaning." }, { name: "Inequality, exclusion, and negative consequences", definition: "The same social processes can benefit insiders while excluding others or generating excessive claims.", relevance: "It blocks a uniformly positive account." }],
  genealogy: [{ related_theory: "practice-theory-bourdieu", relationship: "draws_from", description: "Bourdieu's social capital is one capital form within a wider account of field, habitus, conversion, and symbolic recognition; other social-capital traditions use different units and mechanisms." }, { related_theory: "communities-of-practice", relationship: "adjacent_to", description: "Both can address relational access, but CoP explains learning through participation while social capital explains relation-enabled resource access and coordination." }],
  explanatory_mechanisms: [{ mechanism: "Relation-enabled resource access", process: "Ties, membership, and position condition which information, support, referrals, or opportunities are reachable and by whom.", evidence_focus: "Concrete resource-seeking, offers, refusals, exchanges, and access/non-access cases.", source_ids: [sources.socialLin.id, sources.socialCapital.id] }, { mechanism: "Conditional mobilisation and conversion", process: "Obligations, norms, trust, brokerage, recognition, institutional rules, and other capital affect whether accessible resources are activated and yield an outcome.", evidence_focus: "Timing, reciprocity, gatekeeping, institutional conditions, rival explanations, and negative consequences.", source_ids: [sources.socialPortes.id, sources.socialBourdieu.id] }],
  analysis_unit: "The explicitly named individual, dyad, bounded network, organisation, community, or institutional system through which a specified resource is accessed or mobilised; levels must not be inferred from one another without a justified bridge.",
  theory_comparisons: [{ theory: "Practice Theory (Bourdieu)", role: "main_candidate", shared_focus: "Both treat relationships and resources as socially consequential.", difference: "Bourdieu locates social capital within field, habitus, other capitals, conversion, and symbolic recognition; social-capital traditions may focus more narrowly on ties, access, obligation, or network position.", when_prefer: "Prefer Bourdieu when field-level power, unequal capitals, and dispositions explain the value of relationships.", source_ids: [sources.socialBourdieu.id] }, { theory: "Network or structural-relational analysis", role: "alternative", shared_focus: "Both require attention to relations and position.", difference: "Network analysis is a set of tools; it does not define capital, resource value, mobilisation, or benefit by itself.", when_prefer: "Prefer network measures to operationalise a clearly stated resource-access mechanism, not as proof of high social capital.", source_ids: [sources.socialLin.id, sources.socialPortes.id] }],
  boundary_conditions: [{ condition: "The study has only a trust score, contact count, or aggregate index without a named relation, resource, mechanism, and unit.", implication: "It cannot support a specific social-capital claim.", source_ids: [sources.socialPortes.id] }, { condition: "The question is a causal treatment-effect estimate or an individual skill outcome with no relational-access mechanism.", implication: "Use a causal evaluation or another theory as primary; social capital may at most be a specified contextual mechanism.", source_ids: [sources.socialCapital.id] }],
  applicable_topics: [{ topic: "Unequal access to information, mentoring, referrals, support, or opportunities", rationale: "It can specify which relations make which resources available." }, { topic: "Network position, coordination, and mobilisation during transitions or collaboration", rationale: "It connects relation type and structure to a proposed resource mechanism." }, { topic: "Membership, recognition, and gatekeeping across organisational boundaries", rationale: "It can examine both access and exclusion." }],
  inapplicable_topics: [{ topic: "Individual skill or attitude with no relational access mechanism", rationale: "Social capital is not an individual trait scale." }, { topic: "A contact count with no resource quality, use, inequality, or outcome evidence", rationale: "Network size alone does not establish benefit." }],
  misuse_risks: ["Treating competing social-capital traditions as one theory or measure.", "Equating more ties with more benefit.", "Using trust as a universal proxy.", "Treating closure as always positive and ignoring exclusion or excessive claims.", "Inferring community properties from individual responses or causal benefit from network position."],
  analysis_dimensions: ["Relation type, duration, direction, and membership", "Resource type and access", "Mobilisation, reciprocity, obligation, and refusal", "Closure, bridging, brokerage, and network boundary", "Institutional conditions and other capitals", "Unequal access, exclusion, negative consequences, and rival explanations"],
  data_collection: [{ dimension: "Ties and resource episodes", indicators: ["Name-generator interviews", "Support or referral episodes", "Membership records"], collection_prompt: "Ask who was approached, what resource was sought or offered, why the tie was available, what obligation or risk existed, and what happened." }, { dimension: "Network structure and boundary", indicators: ["Rosters", "Affiliation data", "Organisational maps"], collection_prompt: "Define network boundary, relation type, missing-tie strategy, and ethical protections before calculating any metric." }, { dimension: "Access, exclusion, and mobilisation", indicators: ["Gatekeeping records", "Document trails", "Non-access countercases"], collection_prompt: "Compare access and non-access cases and combine documents with accounts because records rarely reveal informal access alone." }],
  chapter_structure: [{ chapter: "Literature review", purpose: "Name the chosen social-capital tradition and compare at least one alternative.", theory_use: "Justify the unit and avoid conceptual stretching." }, { chapter: "Theoretical framework", purpose: "Specify relation, resource, mechanism, boundary conditions, and rival explanations.", theory_use: "Separate access, mobilisation, and outcome." }, { chapter: "Methods", purpose: "Define network boundary, measurement level, ethics, confidentiality, and causal limits.", theory_use: "Explain evidence for resource flow and negative cases." }, { chapter: "Findings and discussion", purpose: "Present access and non-access, resource flow and outcome, and selection alternatives.", theory_use: "State whether evidence supports mechanism, association, or contextual condition." }],
  fit_writing: ["Name the tradition, unit, relation, resource, and mechanism before using the term social capital.", "Separate accessible resources, mobilisation, and outcomes and include exclusion or negative consequences.", "Adapt data and chapter suggestions to question, ethics, confidentiality, access, and disciplinary guidance."],
  sources: [sources.socialCapital, sources.socialBourdieu, sources.socialPortes, sources.socialLin, sources.socialWoolcock],
  reading_path: [{ order: 1, level: "Level 1 · Orientation", title: "Coleman (1988): Social Capital in the Creation of Human Capital", purpose: "Establish social structure and action.", source_id: sources.socialCapital.id }, { order: 2, level: "Level 1 · Alternative tradition", title: "Bourdieu (1986): The Forms of Capital", purpose: "Place social capital among other capitals, membership, and conversion.", source_id: sources.socialBourdieu.id }, { order: 3, level: "Level 2 · Differentiation and critique", title: "Lin (2001) and Portes (1998)", purpose: "Distinguish resource access from conceptual stretch and negative consequences.", source_id: sources.socialLin.id }, { order: 4, level: "Level 3 · Collective context", title: "Woolcock (1998)", purpose: "Use only when a collective or policy context matches the unit.", source_id: sources.socialWoolcock.id }],
  verification: [{ claim: "The linked records support the cited traditions, limited source definitions, and cautions about social-capital variation and negative consequences.", evidence_level: "L1", source_id: sources.socialPortes.id, status: "verified" }, { claim: "Definitions, comparisons, and fit judgments are Syntag editorial syntheses; social-capital traditions use non-identical concepts and levels.", evidence_level: "L2", status: "editorial" }, { claim: "Research and writing suggestions require adaptation to question, setting, ethics, access, confidentiality, and disciplinary guidance.", evidence_level: "L3", status: "proposed" }],
};

const teacherProfessionalDevelopmentContent: TheoryContent = {
  what_is_it: "Teacher Professional Development Theory is an editorial entry point into plural professional-development and professional-learning models. It helps ask how teachers develop knowledge, practice, commitments, or professional roles under particular learning and workplace conditions; it is not one closed canonical theory.",
  origins: "Day's Developing Teachers provides a bibliographic anchor for lifelong teacher development. Guskey and Clarke with Hollingsworth offer distinct named models of teacher change and professional growth, while later evidence syntheses caution against treating participation in an activity as proof of a shared outcome.",
  theory_nature: { kind: "editorial_umbrella", label: "Editorial entry lens for plural professional-development models", explanation: "This page groups several professional-learning and teacher-change models for initial selection. A study must name the particular model and proposed mechanism rather than claim that one universal theory explains all teacher development.", source_ids: [sources.teacherDevelopment.id, sources.teacherDevelopmentGuskey.id, sources.teacherDevelopmentClarke.id] },
  core_concepts: [
    { name: "Professional learning", definition: "Learning connected to teachers' work, knowledge, practice, and professional development.", relevance: "It prevents development from being reduced to programme attendance." },
    { name: "Learning conditions and opportunities", definition: "Workplace, collaborative, and formal conditions through which learning may be supported or constrained.", relevance: "They make context part of the question rather than background decoration." },
    { name: "Changed practice", definition: "A proposed change in classroom or professional practice that requires evidence beyond self-reported satisfaction.", relevance: "It separates participation from an asserted practice outcome." },
    { name: "Beliefs and professional self", definition: "Teachers' interpretations of their work, commitments, and professional roles.", relevance: "It signals that learning, practice, and identity are related but non-identical analytic concerns." },
  ],
  genealogy: [{ related_theory: "teacher-identity-theory", relationship: "integrated_with", description: "Editorial comparison: professional-development models organise questions about learning, practice, and change; Teacher Identity Theory focuses on negotiated professional self-understanding. Do not infer identity change from participation in development alone.", source_ids: [sources.teacherDevelopmentIdentity.id] }],
  applicable_topics: [{ topic: "Teachers' learning opportunities and changing practice", rationale: "A named professional-learning model can organise evidence about opportunities, conditions, learning, and practice." }, { topic: "Professional role transitions and workplace support", rationale: "The lens can frame questions about how teachers interpret development across work settings and career moments." }],
  inapplicable_topics: [{ topic: "A one-time student outcome with no teacher-learning mechanism", rationale: "The page cannot establish an intervention effect without a matching design and evidence." }, { topic: "Identity or organisational legitimacy as the primary explanatory object", rationale: "Teacher Identity or Institutional Theory may provide a more precise primary vocabulary." }],
  misuse_risks: ["Calling any workshop professional development without specifying the learning opportunity, condition, and proposed change.", "Inferring changed practice or learner outcomes from satisfaction or attendance alone.", "Treating one named model as a complete account of identity, career biography, organisational pressure, or all professional learning."],
  sources: [sources.teacherDevelopment, sources.teacherDevelopmentGuskey, sources.teacherDevelopmentClarke, sources.teacherDevelopmentTimperley, sources.teacherDevelopmentIdentity],
  reading_path: [{ order: 1, level: "Level 1 · Orientation", title: "Day (1999): Developing Teachers", purpose: "Establish the lifelong teacher-development scope.", source_id: sources.teacherDevelopment.id }, { order: 2, level: "Level 2 · Named models", title: "Guskey (2002) and Clarke & Hollingsworth (2002)", purpose: "Choose and delimit a particular model of teacher change or professional growth.", source_id: sources.teacherDevelopmentGuskey.id }, { order: 3, level: "Level 3 · Evidence and identity boundary", title: "Timperley et al. (2007) and Day et al. (2006)", purpose: "Check context-sensitive evidence and distinguish learning from professional identity.", source_id: sources.teacherDevelopmentTimperley.id }],
  verification: [{ claim: "The cited records verify the page's bibliographic anchors and the limited claims attached to named teacher-development models and evidence syntheses.", evidence_level: "L1", source_id: sources.teacherDevelopmentGuskey.id, status: "verified" }, { claim: "The plural-field definition, comparisons, fit, and misuse boundaries are Syntag editorial synthesis rather than a universal theory claim.", evidence_level: "L2", status: "editorial" }, { claim: "Any research-design choice must be adapted to the question, workplace, participants, ethics, access, and disciplinary guidance.", evidence_level: "L3", status: "proposed" }],
};

const teacherLifeHistoryContent: TheoryContent = {
  what_is_it: "Teacher Life History Research is a qualitative research tradition for interpreting narrated biographies, memories, records, and social or historical contexts in teachers' professional lives. It is not a causal theory or transparent access to factual biography.",
  origins: "Goodson's work on teachers' lives, educational life-history research, and narrative theory supplies this page's primary orientation. Narrative-inquiry ethics further establishes that accounts are relationally produced and require care rather than extraction as raw fact.",
  theory_nature: { kind: "research_tradition", label: "Qualitative life-history and narrative research tradition", explanation: "This page is an entry lens for a biographical and interpretive approach. It can supply materials for a theoretical analysis, but it does not itself provide a causal mechanism for professional identity, career change, or institutional action.", source_ids: [sources.lifeHistory.id, sources.lifeHistoryTeachers.id, sources.lifeHistoryJosselson.id] },
  core_concepts: [{ name: "Life history", definition: "An interpreted account of a life situated in social and historical context.", relevance: "It connects personal narrative with institutions and wider conditions." }, { name: "Narration and memory", definition: "Accounts are told, remembered, and represented for particular audiences and times.", relevance: "It prevents narrative sequence from being treated as error-free fact or causation." }, { name: "Temporality and turning points", definition: "Lives and professional meanings are narrated across time and consequential events.", relevance: "It supports questions about changing commitments without assuming a universal trajectory." }, { name: "Researcher-participant relationship", definition: "Life-history material is shaped by consent, interpretation, power, and relational ethics.", relevance: "It makes anonymity, emotional risk, and co-production part of the method." }],
  genealogy: [{ related_theory: "life-course-theory", relationship: "integrated_with", description: "Editorial comparison: both attend to biography and time, but Life Course Theory offers concepts for pathways, timing, linked lives, and historical location, while life-history research is an interpretive approach to narrated materials. A life-history interview does not by itself evidence life-course principles.", source_ids: [sources.lifeHistory.id, sources.lifeCourse.id] }],
  applicable_topics: [{ topic: "Teachers' career stories and remembered turning points", rationale: "It supports interpretation of narrated professional meaning across lives and work." }, { topic: "Biography in relation to educational, policy, or institutional context", rationale: "It can connect personal representation with wider social and historical conditions." }],
  inapplicable_topics: [{ topic: "Representative prevalence estimates", rationale: "Life-history materials do not by themselves support population estimation." }, { topic: "A factual claim requiring independent corroboration", rationale: "Narrative accounts should not replace documentary checking when the claim demands it." }],
  misuse_risks: ["Treating memory or a narrated account as transparent, error-free fact.", "Inferring causal effects from narrative sequence alone.", "Ignoring consent, anonymity, emotional risk, audience, time of telling, and the researcher's role in producing the account."],
  sources: [sources.lifeHistory, sources.lifeHistoryTeachers, sources.lifeHistoryGoodsonSikes, sources.lifeHistoryJosselson, sources.lifeCourse],
  reading_path: [{ order: 1, level: "Level 1 · Orientation", title: "Goodson (ed., 1992): Studying Teachers' Lives", purpose: "Orient to teacher-life research, its methods, and its problems.", source_id: sources.lifeHistoryTeachers.id }, { order: 2, level: "Level 2 · Educational research practice", title: "Goodson & Sikes (2001): Life History Research in Educational Settings", purpose: "Study life-history work in educational settings.", source_id: sources.lifeHistoryGoodsonSikes.id }, { order: 3, level: "Level 3 · Narrative and ethics", title: "Goodson (2013) and Josselson (2007)", purpose: "Examine personal representation and relational narrative ethics.", source_id: sources.lifeHistoryJosselson.id }],
  verification: [{ claim: "The cited publisher and DOI records verify the page's bibliographic anchors and limited claims about teacher-life, narrative, and ethical research materials.", evidence_level: "L1", source_id: sources.lifeHistoryJosselson.id, status: "verified" }, { claim: "The research-tradition definition, theory comparison, fit, and safeguards are Syntag editorial synthesis, not a causal theory claim.", evidence_level: "L2", status: "editorial" }, { claim: "Narrative, document, and reflexive research choices require adaptation to consent, ethics, setting, access, and disciplinary guidance.", evidence_level: "L3", status: "proposed" }],
};

const educationalEquityContent: TheoryContent = {
  what_is_it: "Educational Equity Theory is an editorial umbrella for normative and empirical inquiry into avoidable inequality in educational access, participation, treatment, resources, recognition, and outcomes. It does not name one classic theory or one agreed equity metric.",
  origins: "Institutional reports establish the education inclusion and equity context, while distinct philosophical traditions offer different normative resources for thinking about equality, capability, redistribution, recognition, and representation. Their coexistence requires the page to name rather than hide its normative basis.",
  theory_nature: { kind: "editorial_umbrella", label: "Editorial umbrella for normative and empirical equity inquiry", explanation: "This page helps select and specify an equity question. It does not claim a single founder, canonical theory, universal criterion, or automatically causal account of unequal outcomes.", source_ids: [sources.equity.id, sources.equitySen.id, sources.equityFraser.id] },
  core_concepts: [{ name: "Inclusion and exclusion", definition: "The ways learners may be enabled or prevented from entering and participating in education.", relevance: "It makes the relevant access or participation mechanism explicit." }, { name: "Comparator and population", definition: "The groups or positions against which an unequal educational condition is assessed.", relevance: "It prevents equity from becoming a slogan without a stated comparison." }, { name: "Distribution and capability", definition: "Normative concerns with resources, opportunities, and what people are able to do or become.", relevance: "They show why equal treatment and equitable conditions are not automatically identical." }, { name: "Recognition and representation", definition: "Normative concerns with whose status, knowledge, and political voice count.", relevance: "They extend inquiry beyond resource allocation alone." }],
  genealogy: [{ related_theory: "social-capital-theory", relationship: "integrated_with", description: "Editorial comparison: Social Capital Theory can specify access to relation-enabled resources as one possible inequality mechanism, but it does not decide what distribution or recognition standard counts as equitable.", source_ids: [sources.equityFraser.id, sources.socialPortes.id] }],
  applicable_topics: [{ topic: "Unequal access, participation, resources, recognition, or outcomes", rationale: "The page prompts a study to name the population, comparator, normative basis, and proposed mechanism." }, { topic: "Educational policy or institutional arrangements that differentially position learners", rationale: "It can frame an explicit equity question before selecting a causal or organisational explanation." }],
  inapplicable_topics: [{ topic: "A theory-neutral group comparison with no normative or distributional question", rationale: "The lens requires an account of what counts as equitable and why." }, { topic: "A causal claim with no identified mechanism or design", rationale: "Equity framing alone cannot establish the cause of an unequal outcome." }],
  misuse_risks: ["Using equity as a slogan without naming the unit, population, comparator, dimension, and normative basis.", "Treating unequal outcomes as sufficient evidence of their causes.", "Presenting a global report, one philosophical tradition, or equal treatment as a universal educational equity theory."],
  sources: [sources.equity, sources.equityOecd, sources.equitySen, sources.equityFraser, sources.socialPortes],
  reading_path: [{ order: 1, level: "Level 1 · Education context", title: "UNESCO (2020): Inclusion and Education", purpose: "Establish an institutional orientation to inclusion and equity.", source_id: sources.equity.id }, { order: 2, level: "Level 2 · Policy context", title: "OECD (2012): Equity and Quality in Education", purpose: "Review an education-policy evidence context without treating it as a universal theory.", source_id: sources.equityOecd.id }, { order: 3, level: "Level 3 · Normative choice", title: "Sen (1992) and Fraser (2008)", purpose: "Specify a capability, distribution, recognition, or representation basis for the question.", source_id: sources.equitySen.id }],
  verification: [{ claim: "The cited institutional and publisher records verify the page's limited education-policy and normative source anchors; none establishes a single Educational Equity Theory.", evidence_level: "L1", source_id: sources.equity.id, status: "verified" }, { claim: "The umbrella definition, theory comparison, fit, and misuse boundaries are Syntag editorial synthesis and require a stated normative basis.", evidence_level: "L2", status: "editorial" }, { claim: "Data and research-design choices must be adapted to the population, setting, ethics, access, and causal question.", evidence_level: "L3", status: "proposed" }],
};

const institutionalContent: TheoryContent = {
  what_is_it: "Institutional Theory is a family of approaches. This D1 page anchors organisational neo-institutionalism to examine how institutionalised rules, legitimacy, organisational fields, and possible decoupling shape formal structures and practices; it is not a synonym for any context called an institution.",
  origins: "Meyer and Rowan's account of institutionalised organisations and DiMaggio and Powell's account of organisational fields and isomorphism form the core orientation here. Barley and Tolbert provide a direct bridge for examining links between institutionalisation and structuration.",
  theory_nature: { kind: "theory", label: "Family of institutionalisms; this page anchors organisational neo-institutionalism", explanation: "Institutional Theory contains more than one strand. This foundation page is explicitly limited to the organisational neo-institutionalist concepts supported by its classic sources and does not treat organisations as passive or all context as institutional pressure.", source_ids: [sources.institutionalMeyerRowan.id, sources.institutional.id, sources.institutionalBarleyTolbert.id] },
  core_concepts: [{ name: "Institutionalised rules", definition: "Taken-for-granted or rationalised rules that can shape formal organisational arrangements.", relevance: "They direct inquiry to more than technical efficiency." }, { name: "Legitimacy", definition: "Recognition that an organisational form or practice is appropriate within an institutional environment.", relevance: "It helps explain why conformity may matter." }, { name: "Organisational field and isomorphism", definition: "A field of organisations and patterned pressures through which forms may become more alike.", relevance: "It requires evidence of the relevant relation and mechanism, not similarity alone." }, { name: "Decoupling", definition: "A possible separation between formal structures and ongoing activity.", relevance: "It prevents formal adoption from being assumed to equal enacted practice." }],
  genealogy: [{ related_theory: "structuration-theory", relationship: "integrated_with", description: "Barley and Tolbert directly relate institutionalisation and structuration. Editorially, Institutional Theory is primary for legitimacy, fields, and organisational form; Structuration adds rules/resources and recursive enactment when practice and change must be analysed in their own right.", source_ids: [sources.institutionalBarleyTolbert.id] }],
  applicable_topics: [{ topic: "Organisational legitimacy, formal adoption, and possible decoupling", rationale: "The page can organise evidence about institutionalised rules, fields, and formal arrangements." }, { topic: "Similarity or variation among organisations in a defined field", rationale: "It supports questions about field relations and named institutional mechanisms." }],
  inapplicable_topics: [{ topic: "A purely individual decision with no organisational or field setting", rationale: "The framework needs evidence about institutional rules, relations, or legitimacy." }, { topic: "A resemblance with no evidence of a mechanism", rationale: "Similarity alone does not establish coercive, mimetic, normative, or other pressure." }],
  misuse_risks: ["Calling all context institutional or treating a named organisation as the entire field.", "Inferring coercion, imitation, professional norm, or decoupling from similarity alone.", "Treating organisations as passive cultural dopes and omitting actors, timing, rules, and enacted practice."],
  sources: [sources.institutional, sources.institutionalMeyerRowan, sources.institutionalBarleyTolbert],
  reading_path: [{ order: 1, level: "Level 1 · Classic orientation", title: "Meyer and Rowan (1977)", purpose: "Study formal structure, legitimacy, and decoupling.", source_id: sources.institutionalMeyerRowan.id }, { order: 2, level: "Level 2 · Organisational fields", title: "DiMaggio and Powell (1983)", purpose: "Study fields and institutional isomorphism.", source_id: sources.institutional.id }, { order: 3, level: "Level 3 · Action and institution", title: "Barley and Tolbert (1997)", purpose: "Examine a direct institutional-theory and structuration connection.", source_id: sources.institutionalBarleyTolbert.id }],
  verification: [{ claim: "The cited classic records verify the limited claims about institutionalised organisations, fields, isomorphism, decoupling, and the documented institutionalisation-structuration connection.", evidence_level: "L1", source_id: sources.institutionalBarleyTolbert.id, status: "verified" }, { claim: "The family definition, theory choice, comparisons, fit, and safeguards are Syntag editorial synthesis rather than claims that one institutional strand explains every organisation.", evidence_level: "L2", status: "editorial" }, { claim: "Document, interview, and field-mapping choices must be adapted to the question, setting, access, ethics, and disciplinary guidance.", evidence_level: "L3", status: "proposed" }],
};

const streetLevelContent: TheoryContent = {
  what_is_it: "Street-Level Bureaucracy is a public-policy and administration theoretical perspective on how frontline public workers implement policy through case-level interaction and discretion under identifiable organisational constraints. It is not a theory of all service work or of agenda setting.",
  origins: "Lipsky's formulation centres direct interaction with clients, discretion, inadequate resources, contested authority, ambiguous goals, routines, and policy as delivered practice. Later work documents possible but non-universal combinations with institutional and structuration perspectives.",
  theory_nature: { kind: "theory", label: "Public-policy and administration perspective on frontline implementation", explanation: "This page is limited to frontline public-service implementation. It requires evidence of policy delivery, client interaction, consequential discretion, and organisational conditions; discretion is not presumed good, bad, or equivalent to misconduct.", source_ids: [sources.streetLevel.id, sources.streetLevelOjp.id] },
  core_concepts: [{ name: "Street-level bureaucrats", definition: "Frontline public-service workers who interact directly with clients in implementation.", relevance: "It sets a narrower unit than all workers or all policy actors." }, { name: "Discretion", definition: "Judgement exercised in applying policy to cases.", relevance: "It makes implementation an empirical site of interpretation rather than simple transmission." }, { name: "Resource and demand conditions", definition: "Caseloads, time, resources, goals, authority, and competing expectations that shape frontline work.", relevance: "They prevent discretion from being analysed as autonomy alone." }, { name: "Coping and routines", definition: "Possible ways workers simplify, prioritise, or manage implementation pressures.", relevance: "They must be traced as context-specific responses rather than moral labels." }],
  genealogy: [{ related_theory: "structuration-theory", relationship: "integrated_with", description: "Dahlvik documents one application combining street-level bureaucracy and Structuration Theory. Editorially, the former focuses frontline implementation dilemmas; the latter can add a rule/resource and recursive-enactment account. The application does not make both mandatory.", source_ids: [sources.streetLevelDahlvik.id] }],
  applicable_topics: [{ topic: "Frontline implementation of education or other public services", rationale: "It fits case-level interaction, consequential judgement, and identifiable implementation constraints." }, { topic: "How rules and scarce resources shape delivered policy", rationale: "It directs evidence toward conditions, routines, discretion, and outcomes in practice." }],
  inapplicable_topics: [{ topic: "Agenda setting before implementation actors are involved", rationale: "Multiple Streams Framework is a more direct starting point for agenda and policy-choice questions." }, { topic: "Back-office or service work with no comparable discretionary client interaction", rationale: "The central street-level conditions are not established." }],
  misuse_risks: ["Calling every teacher, platform worker, or service employee a street-level bureaucrat solely because they serve people.", "Treating discretion as automatically autonomy, bias, resistance, innovation, or misconduct.", "Exporting the original formulation to another governance or service setting without examining policy, resource, and organisational conditions."],
  sources: [sources.streetLevel, sources.streetLevelOjp, sources.streetLevelRice, sources.streetLevelDahlvik],
  reading_path: [{ order: 1, level: "Level 1 · Classic formulation", title: "Lipsky (2010): Street-Level Bureaucracy", purpose: "Study frontline discretion, conditions, and delivered policy.", source_id: sources.streetLevel.id }, { order: 2, level: "Level 2 · Definitional conditions", title: "Lipsky: Toward a Theory of Street-Level Bureaucracy", purpose: "Check direct interaction, discretion, resource, authority, and goal conditions.", source_id: sources.streetLevelOjp.id }, { order: 3, level: "Level 3 · Bounded combinations", title: "Rice (2013) and Dahlvik (2017)", purpose: "Study documented institutional and structuration combinations without universalising them.", source_id: sources.streetLevelRice.id }],
  verification: [{ claim: "The cited records verify the limited frontline discretion and implementation conditions, plus documented possible combinations with institutional and structuration approaches.", evidence_level: "L1", source_id: sources.streetLevel.id, status: "verified" }, { claim: "The perspective definition, stage distinction, fit, and safeguards are Syntag editorial synthesis and do not make discretion universally positive or negative.", evidence_level: "L2", status: "editorial" }, { claim: "Case tracing, interview, document, and observation choices require adaptation to setting, confidentiality, ethics, access, and disciplinary guidance.", evidence_level: "L3", status: "proposed" }],
};

const multipleStreamsContent: TheoryContent = {
  what_is_it: "The Multiple Streams Framework is an analytical policy-process framework for agenda change and policy choice under ambiguity. It examines the partly independent development and temporary coupling of problem, policy, and politics streams, often involving policy entrepreneurs and policy windows; it is not a universal causal law or complete implementation theory.",
  origins: "Kingdon's agenda-setting work provides the classic U.S. federal-government orientation. Later framework sources identify policy-process scope, refinements, and limits, including the need to justify applications across political systems rather than assume automatic portability.",
  theory_nature: { kind: "framework", label: "Analytical policy-process framework for agenda setting and policy choice", explanation: "This page is a bounded framework, not an all-stage implementation model. It requires dated evidence of streams, actors, jurisdiction, policy stage, and a claimed coupling event; a retrospective three-factor story is not enough.", source_ids: [sources.multipleStreamsKingdon.id, sources.multipleStreamsZahariadis.id, sources.multipleStreamsPortability.id] },
  core_concepts: [{ name: "Problem stream", definition: "Conditions and indicators interpreted as requiring public attention.", relevance: "It separates an issue's problem construction from a policy solution or political climate." }, { name: "Policy stream", definition: "The development and selection of proposals or alternatives.", relevance: "It prevents any adopted policy from being retrospectively treated as the only available solution." }, { name: "Politics stream", definition: "Political circumstances shaping agenda attention and feasibility.", relevance: "It distinguishes political context from problem indicators and policy proposals." }, { name: "Policy window and coupling", definition: "A temporary opportunity and the work of linking streams in agenda or policy change.", relevance: "It makes timing and an evidenced coupling event central rather than decorative." }],
  genealogy: [{ related_theory: "life-course-theory", relationship: "adjacent_to", description: "Editorial comparison: both may use the language of timing, but their units differ. Multiple Streams Framework studies policy processes and windows; Life Course Theory studies biographies and pathways. Shared vocabulary is not theoretical integration.", source_ids: [sources.multipleStreamsKingdon.id, sources.lifeCourse.id] }],
  applicable_topics: [{ topic: "Agenda setting, issue attention, and policy formulation or choice", rationale: "It directs inquiry to streams, actors, timing, and coupling under ambiguity." }, { topic: "A dated policy window with traceable proposals and political circumstances", rationale: "The framework can support a bounded account when evidence reaches distinct stream development and coupling." }],
  inapplicable_topics: [{ topic: "Everyday frontline delivery after policy adoption", rationale: "Street-Level Bureaucracy is a more direct primary perspective for implementation practice." }, { topic: "A general claim that a policy was effective", rationale: "The framework does not by itself provide an outcome-evaluation design or implementation mechanism." }],
  misuse_risks: ["Naming three streams only after the outcome is known without tracing their distinct development.", "Treating Kingdon's U.S. agenda-setting focus as automatically portable across political systems, levels, or policy stages.", "Using a policy window as a generic timing metaphor rather than identifying actors, evidence, and a coupling event."],
  sources: [sources.multipleStreams, sources.multipleStreamsKingdon, sources.multipleStreamsZahariadis, sources.multipleStreamsHerweg, sources.multipleStreamsPortability, sources.lifeCourse],
  reading_path: [{ order: 1, level: "Level 1 · Classic orientation", title: "Kingdon (2011 [1984]): Agendas, Alternatives, and Public Policies", purpose: "Establish the original agenda-setting problem and U.S. federal scope.", source_id: sources.multipleStreamsKingdon.id }, { order: 2, level: "Level 2 · Framework orientation", title: "Zahariadis (2023): Multiple Streams Framework", purpose: "Review policy-process scope, attention, timing, and ambiguity.", source_id: sources.multipleStreamsZahariadis.id }, { order: 3, level: "Level 3 · Refinement and transfer boundary", title: "Herweg et al. (2018, 2022)", purpose: "Study refinements and justify any cross-system application.", source_id: sources.multipleStreamsPortability.id }],
  verification: [{ claim: "The cited publisher and DOI records verify the classic agenda-setting orientation, policy-process framing, and stated portability boundary.", evidence_level: "L1", source_id: sources.multipleStreamsPortability.id, status: "verified" }, { claim: "The framework definition, theory comparison, fit, and safeguards are Syntag editorial synthesis rather than a universal causal or implementation claim.", evidence_level: "L2", status: "editorial" }, { claim: "Timeline, document, interview, and process-tracing choices require adaptation to the policy stage, jurisdiction, evidence access, ethics, and disciplinary guidance.", evidence_level: "L3", status: "proposed" }],
};

const theories: SeedTheory[] = [
  theory({
    slug: "life-course-theory", depth: "D3", titleEn: "Life Course Theory",
    summaryEn: "Life Course Theory explains how biographies unfold through time, relationships, institutions, and historically situated transitions.",
    source: sources.lifeCourse,
    origin: "Elder's life-course formulation links developmental pathways to historical time, social relationships, and transitions; the cited journal record is the page's L1 bibliographic anchor.",
    concepts: [
      { name: "Trajectories", definition: "Long-term pathways through roles and institutions.", relevance: "They connect individual biographies to patterned social change." },
      { name: "Linked lives", definition: "Interdependent lives shaped by close social relationships.", relevance: "They direct attention to family, peers, and obligations around transitions." },
    ],
    genealogy: [{ related_theory: "teacher-life-history-research", relationship: "precursor_of", description: "Life-course attention to timing and biography informs teacher life-history research." }],
    applicableTopic: "Educational or work transitions across time", applicableRationale: "It helps connect sequences of transitions with relational and institutional conditions.",
    inapplicableTopic: "A single cross-sectional attitude with no temporal context", inapplicableRationale: "The framework adds little when timing, sequence, relationships, and historical context are not part of the question.",
    misuseRisk: "Treating chronological age as a causal explanation instead of analysing institutions, relationships, and period effects.",
    analysisDimension: "transition timing, linked lives, and historical context", collectionPrompt: "Invite participants to reconstruct key transitions, relationships, and institutional conditions around each transition.",
    content: lifeCourseContent,
  }),
  theory({
    slug: "teacher-identity-theory", depth: "D3", titleEn: "Teacher Identity Theory",
    summaryEn: "Teacher Identity Theory examines how teachers understand, narrate, and negotiate their professional selves in changing work contexts.",
    source: sources.teacherIdentity,
    origin: "The cited article provides a traceable account of teacher self-understanding, vulnerability, and reflection; this page uses it as an L1 bibliographic anchor rather than a universal model of identity.",
    concepts: [
      { name: "Professional self-understanding", definition: "A teacher's sense of self in relation to professional work.", relevance: "It makes identity visible as part of interpreting practice and change." },
      { name: "Vulnerability", definition: "Sensitivity to conditions that challenge professional self-understanding.", relevance: "It helps examine how reforms and relationships are experienced." },
    ],
    genealogy: [{ related_theory: "teacher-professional-development-theory", relationship: "integrated_with", description: "Identity and professional development can be studied together when change is experienced across a teaching career." }],
    applicableTopic: "Teachers' professional change and reform experience", applicableRationale: "It is useful when a study asks how teachers interpret their roles, commitments, and changing conditions.",
    inapplicableTopic: "Measuring an intervention outcome without accounts of professional meaning", inapplicableRationale: "It should not replace an evaluation framework focused only on causal effects or implementation metrics.",
    misuseRisk: "Reducing identity to a fixed personality trait or treating a single interview as a complete account of a professional self.",
    analysisDimension: "professional self-understanding, vulnerability, and role negotiation", collectionPrompt: "Ask for concrete episodes in which participants described, defended, or revised how they understood their teaching role.",
    content: teacherIdentityContent,
  }),
  theory({
    slug: "structuration-theory", depth: "D2", titleEn: "Structuration Theory",
    summaryEn: "Structuration Theory explains social life as a recursive relationship in which people draw on and reproduce, modify, or contest structural rules and resources through practice.",
    source: sources.structuration,
    origin: "Giddens' cited book is the L1 bibliographic record for the theory of structuration; the explanation here is an L2 editorial summary for research use.",
    concepts: [
      { name: "Duality of structure", definition: "Structures are both the medium and outcome of social practices.", relevance: "It prevents treating structure and agency as wholly separate forces." },
      { name: "Rules and resources", definition: "Interpretive and material means people draw on in action.", relevance: "They make organisational practices analysable without reducing them to individual preference." },
    ],
    genealogy: [{ related_theory: "practice-theory-bourdieu", relationship: "critiqued_by", description: "Both address structure and practice, but they provide different analytic vocabularies for how action is organised." }],
    applicableTopic: "Organisational routines and change", applicableRationale: "It supports questions about how participants enact or reshape rules and resources in everyday practice.",
    inapplicableTopic: "A study limited to personal attitudes without social practice or organisational conditions", inapplicableRationale: "The framework requires evidence about the relation between action and structural conditions.",
    misuseRisk: "Using 'structure and agency' as a slogan without identifying the rules, resources, and recursive practices in the data.",
    analysisDimension: "rules, resources, and recursive practice", collectionPrompt: "Collect accounts and documents that show which rules and resources participants draw on, reproduce, alter, or resist.",
    content: structurationContent,
  }),
  theory({
    slug: "communities-of-practice", depth: "D2", titleEn: "Communities of Practice",
    summaryEn: "Communities of Practice frames learning as participation in shared practice, where newcomers and established members negotiate competence, meaning, and identity.",
    source: sources.communities,
    origin: "Lave and Wenger's cited book is the L1 source record for situated learning and legitimate peripheral participation; this page distinguishes that formulation from any generic work group.",
    concepts: [
      { name: "Legitimate peripheral participation", definition: "Participation through which newcomers move toward fuller involvement in practice.", relevance: "It helps analyse access, recognition, and learning opportunities." },
      { name: "Shared practice", definition: "A socially organised repertoire of activities, language, and tools.", relevance: "It shifts analysis from individual acquisition to participation." },
    ],
    genealogy: [{ related_theory: "teacher-identity-theory", relationship: "integrated_with", description: "Participation in professional practice can be examined alongside teachers' negotiated professional identities." }],
    applicableTopic: "Professional learning through participation", applicableRationale: "It fits studies of how access to practice, recognition, and shared repertoires shape learning.",
    inapplicableTopic: "Any group assembled only by a formal organisational chart", inapplicableRationale: "A named team is not automatically a community of practice without evidence of shared practice and participation.",
    misuseRisk: "Calling every collaborative group a community of practice without examining participation, competence, and a shared repertoire.",
    analysisDimension: "participation, access, competence, and shared repertoire", collectionPrompt: "Observe or ask about how newcomers gain access, how competence is recognised, and which routines or artefacts carry practice.",
    content: communitiesContent,
  }),
  theory({
    slug: "practice-theory-bourdieu", depth: "D2", titleEn: "Practice Theory (Bourdieu)",
    summaryEn: "Bourdieu's practice theory explains patterned action through the relationship among habitus, forms of capital, and fields of struggle.",
    source: sources.practice,
    origin: "Bourdieu's cited book is the L1 bibliographic source for this formulation; the page uses its concepts as an editorial guide rather than as a claim that every practice is determined by class position.",
    concepts: [
      { name: "Habitus", definition: "Durable, socially shaped dispositions that orient perception and action.", relevance: "It helps analyse patterned practical judgement without treating action as fully conscious calculation." },
      { name: "Field", definition: "A structured social arena with positions, stakes, and forms of recognition.", relevance: "It locates practices in relations of power and competition." },
    ],
    genealogy: [{ related_theory: "social-capital-theory", relationship: "branched_from", description: "Bourdieu's account of capital provides one route for analysing resources embedded in social relationships." }],
    applicableTopic: "Inequality and practice in educational or organisational fields", applicableRationale: "It helps connect dispositions, resources, positions, and everyday practices.",
    inapplicableTopic: "A narrowly technical workflow with no question about positions, resources, or social differentiation", inapplicableRationale: "The framework is not a substitute for a task-analysis method when social relations are outside scope.",
    misuseRisk: "Treating habitus as destiny or inferring capital from social labels without evidence of resources and field relations.",
    analysisDimension: "habitus, capital, field positions, and symbolic recognition", collectionPrompt: "Combine participant accounts with documents or observations that show resources, recognition, and positions in the relevant field.",
    content: practiceContent,
  }),
  theory({
    slug: "social-capital-theory", depth: "D2", titleEn: "Social Capital Theory",
    summaryEn: "Social Capital Theory examines resources that become available through social relationships, networks, obligations, trust, and access to information.",
    source: sources.socialCapital,
    origin: "Coleman's cited article is the L1 bibliographic record used for this page's social-capital framing; competing definitions should be named rather than collapsed into one measure.",
    concepts: [
      { name: "Relational resources", definition: "Resources made available through social ties and obligations.", relevance: "They direct attention to access rather than counting contacts alone." },
      { name: "Network structure", definition: "Patterns of connection that shape information, support, and coordination.", relevance: "It provides a basis for comparing opportunities and constraints across participants." },
    ],
    genealogy: [{ related_theory: "practice-theory-bourdieu", relationship: "branched_from", description: "Theories of social capital overlap with Bourdieu's wider attention to capital and social relations while using different definitions and measures." }],
    applicableTopic: "Access to support, information, or opportunities through relationships", applicableRationale: "It fits questions about how ties enable or constrain access to valued resources.",
    inapplicableTopic: "A study of individual skill that does not involve relationships or resource access", inapplicableRationale: "The framework is not an individual trait scale.",
    misuseRisk: "Equating a larger network with greater benefit without examining resource quality, inequality, obligation, or exclusion.",
    analysisDimension: "ties, resource access, obligations, and network position", collectionPrompt: "Ask who provides what support, information, or access, under which conditions, and with what reciprocal obligations.",
    content: socialCapitalContent,
  }),
  theory({
    slug: "teacher-professional-development-theory", depth: "D1", titleEn: "Teacher Professional Development Theory",
    summaryEn: "An editorial entry point into plural models of teachers' professional learning, practice change, and workplace development—not a single canonical theory.",
    source: sources.teacherDevelopment,
    origin: "Day's cited publisher record is the L1 bibliographic anchor for this introductory page; its practical use requires a study-specific account of development and evidence.",
    concepts: [
      { name: "Professional learning", definition: "Ongoing learning connected to teachers' work and development.", relevance: "It keeps change connected to practice rather than attendance alone." },
      { name: "Career development", definition: "Change across professional roles and time.", relevance: "It supports questions about continuity, transition, and commitment." },
    ],
    genealogy: [{ related_theory: "teacher-identity-theory", relationship: "integrated_with", description: "Professional learning can be read with identity when changes in practice also alter how teachers understand their work." }],
    applicableTopic: "Teachers' learning and changing professional practice", applicableRationale: "It provides an introductory lens for studies of development across roles and contexts.",
    inapplicableTopic: "A one-time student assessment with no teacher learning question", inapplicableRationale: "The theory does not directly explain learner outcomes without a development mechanism.",
    misuseRisk: "Calling any workshop professional development without tracing learning, practice, conditions, or change over time.",
    analysisDimension: "professional learning and career development", collectionPrompt: "Ask participants how learning opportunities connected to changing practice and career conditions.",
    content: teacherProfessionalDevelopmentContent,
  }),
  theory({
    slug: "teacher-life-history-research", depth: "D1", titleEn: "Teacher Life History Research",
    summaryEn: "A qualitative life-history and narrative research tradition for interpreting teachers' narrated biographies in social and historical context—not a causal theory.",
    source: sources.lifeHistory,
    origin: "Goodson's cited publisher record is the L1 bibliographic anchor for this introductory life-history page; biography should be treated as interpreted evidence, not transparent fact.",
    concepts: [
      { name: "Life history", definition: "A research approach to narrated lives in social and historical context.", relevance: "It connects personal accounts to institutions and wider conditions." },
      { name: "Narrative representation", definition: "The shaping of experience through stories and interpretation.", relevance: "It prompts attention to memory, audience, and researcher interpretation." },
    ],
    genealogy: [{ related_theory: "life-course-theory", relationship: "extended_by", description: "Life-history inquiry can extend life-course attention to biography through detailed narrative interpretation." }],
    applicableTopic: "Teachers' career stories and professional turning points", applicableRationale: "It suits questions that require contextualised accounts of lives and work over time.",
    inapplicableTopic: "A population estimate requiring representative survey inference", inapplicableRationale: "Biographical depth cannot by itself provide population prevalence estimates.",
    misuseRisk: "Treating a narrated account as unmediated fact and omitting ethical, temporal, and relational context.",
    analysisDimension: "biography, narrative representation, and context", collectionPrompt: "Invite a chronological account and then ask how institutions, relationships, and remembered turning points shaped it.",
    content: teacherLifeHistoryContent,
  }),
  theory({
    slug: "educational-equity-theory", depth: "D1", titleEn: "Educational Equity Theory",
    summaryEn: "An editorial umbrella for normative and empirical inquiry into avoidable educational inequality—not a single classic theory or universal equity metric.",
    source: sources.equity,
    origin: "The cited UNESCO report is an L1 institutional source for education inclusion and equity context; this page does not claim a single canonical theory of educational equity.",
    concepts: [
      { name: "Equitable access", definition: "Access to educational opportunities without avoidable exclusion.", relevance: "It helps specify who can enter, participate, and benefit." },
      { name: "Recognition", definition: "Being treated as a legitimate participant whose needs and knowledge matter.", relevance: "It expands analysis beyond resource distribution." },
    ],
    genealogy: [{ related_theory: "social-capital-theory", relationship: "integrated_with", description: "Social-capital analysis can complement equity research when access to relationships and resources is one mechanism of inequality." }],
    applicableTopic: "Unequal educational access, participation, or outcomes", applicableRationale: "It offers a starting lens for identifying mechanisms of exclusion and advantage.",
    inapplicableTopic: "A theory-neutral comparison with no normative or distributional question", inapplicableRationale: "The framework requires an explicit account of what counts as equitable and why.",
    misuseRisk: "Treating equity as a slogan without defining the relevant dimension, population, comparison, and mechanism.",
    analysisDimension: "access, participation, recognition, resources, and outcomes", collectionPrompt: "Specify the population, comparison, and mechanism before collecting evidence about unequal opportunities or outcomes.",
    content: educationalEquityContent,
  }),
  theory({
    slug: "institutional-theory", depth: "D1", titleEn: "Institutional Theory",
    summaryEn: "A family of institutionalisms; this D1 page is anchored in organisational neo-institutionalism and its analysis of legitimacy, fields, formal structure, and possible decoupling.",
    source: sources.institutional,
    origin: "DiMaggio and Powell's cited article is the L1 bibliographic record for the institutional-isomorphism framing used on this page; institutional analysis should not assume organisations merely comply.",
    concepts: [
      { name: "Institutional isomorphism", definition: "Processes through which organisations become more similar under shared pressures.", relevance: "It helps explain patterned organisational forms beyond efficiency alone." },
      { name: "Legitimacy", definition: "Recognition that an organisation or practice is appropriate within a social environment.", relevance: "It provides a lens for analysing conformity and justification." },
    ],
    genealogy: [{ related_theory: "structuration-theory", relationship: "integrated_with", description: "Institutional pressures can be examined with structuration when a study also asks how participants enact or alter rules in practice." }],
    applicableTopic: "Organisational conformity, legitimacy, and policy adoption", applicableRationale: "It helps identify pressures that shape organisational practices and forms.",
    inapplicableTopic: "An individual decision with no organisational or institutional setting", inapplicableRationale: "The framework requires evidence about organisational fields, expectations, or legitimacy relations.",
    misuseRisk: "Inferring coercive, mimetic, or normative pressure from similarity alone without evidence of the relevant mechanism.",
    analysisDimension: "legitimacy pressures and organisational similarity", collectionPrompt: "Compare documents, accounts, and field expectations to identify the mechanism behind a claimed similarity.",
    content: institutionalContent,
  }),
  theory({
    slug: "street-level-bureaucracy", depth: "D1", titleEn: "Street-Level Bureaucracy",
    summaryEn: "A public-policy and administration perspective on frontline implementation, discretion, and organisational constraints—not a general theory of service work or agenda setting.",
    source: sources.streetLevel,
    origin: "Lipsky's cited publisher record is the L1 bibliographic anchor for this introductory page; the account of discretion here is an L2 research interpretation, not a claim about every frontline role.",
    concepts: [
      { name: "Discretion", definition: "Judgement exercised by frontline workers in applying policy to cases.", relevance: "It makes implementation a site of practice rather than a simple transmission of rules." },
      { name: "Coping practices", definition: "Ways workers manage demands, resources, and uncertainty.", relevance: "They help connect work conditions to implementation outcomes." },
    ],
    genealogy: [{ related_theory: "multiple-streams-framework", relationship: "integrated_with", description: "The frameworks can be combined carefully to connect policy agenda change with frontline implementation after policy adoption." }],
    applicableTopic: "Frontline implementation of public or educational policy", applicableRationale: "It fits questions about how policy is interpreted and enacted under everyday constraints.",
    inapplicableTopic: "Agenda setting before any implementation actor is involved", inapplicableRationale: "It is not primarily a framework for explaining why an issue reached the policy agenda.",
    misuseRisk: "Treating discretion as misconduct or autonomy alone without examining organisational constraints and service conditions.",
    analysisDimension: "frontline discretion and implementation constraints", collectionPrompt: "Ask how workers interpret rules, allocate scarce time, and manage competing demands in concrete cases.",
    content: streetLevelContent,
  }),
  theory({
    slug: "multiple-streams-framework", depth: "D1", titleEn: "Multiple Streams Framework",
    summaryEn: "An analytical policy-process framework for agenda change and policy choice under ambiguity—not a universal causal law or complete implementation theory.",
    source: sources.multipleStreams,
    origin: "Kingdon's cited library record is the L1 bibliographic anchor for this introductory page; the framework should be used with evidence about streams and coupling rather than as a post-hoc metaphor.",
    concepts: [
      { name: "Policy streams", definition: "Problem, policy, and political processes considered as partly independent.", relevance: "They structure evidence about how an issue becomes actionable." },
      { name: "Policy window", definition: "A temporary opportunity for advocates to couple streams.", relevance: "It focuses attention on timing and action in agenda change." },
    ],
    genealogy: [{ related_theory: "street-level-bureaucracy", relationship: "integrated_with", description: "The framework can be paired with street-level bureaucracy when a project traces both agenda change and later implementation." }],
    applicableTopic: "Policy agenda change and issue attention", applicableRationale: "It supports questions about timing, coupling, and how proposals become actionable.",
    inapplicableTopic: "Explaining everyday frontline decisions after policy adoption", inapplicableRationale: "It does not by itself model implementation practice or service delivery.",
    misuseRisk: "Naming the three streams after an outcome is known without evidence of their distinct development and coupling.",
    analysisDimension: "problem, policy, political streams, and policy windows", collectionPrompt: "Build a dated account of problem indicators, policy proposals, political conditions, and any claimed coupling event.",
    content: multipleStreamsContent,
  }),
];

const disciplines: Array<Omit<SeedDiscipline, "status" | "publishedAt">> = [
  {
    slug: "education", titleEn: "Education", descriptionEn: "A Syntag navigation route for questions about learning, teaching, institutions, policy, access, and educational inequality.", overviewEn: "This is a bounded Syntag navigation category, not an exhaustive definition of the discipline. Start by naming whether the question concerns teachers, pathways, equity, policy agenda, or frontline implementation before choosing a theory.",
    content: { en: pathwayContent({
      overview: "UNESCO's education programme covers lifelong learning, systems, policy, teacher education, access, and quality. Syntag uses that limited institutional scope to organise a question-first route; it does not claim a universal map of education research.",
      core_questions: ["How do professional selves, learning, or work conditions change for teachers?", "How do access, participation, resources, recognition, or outcomes become unequal?", "Is the policy question about agenda setting, formal design, or frontline enactment?"],
      question_categories: [{ category: "Teacher work and learning", description: "Distinguish professional-self questions from learning/practice-change questions.", theory_slugs: ["teacher-identity-theory", "teacher-professional-development-theory"] }, { category: "Equity and policy", description: "State the normative comparator and whether the evidence concerns agenda setting or implementation.", theory_slugs: ["educational-equity-theory", "street-level-bureaucracy", "multiple-streams-framework"] }, { category: "Pathways and biography", description: "Use temporal or narrative routes only when timing, sequence, or interpreted life accounts are central.", theory_slugs: ["life-course-theory", "teacher-life-history-research"] }],
      selection_path: [{ step: "Classify the question", prompt: "What needs explanation: self-understanding, learning, inequality, agenda change, implementation, or a pathway?", routing_rule: "Choose a theory only after its explanatory object is explicit." }, { step: "Name the analysis unit", prompt: "Is the unit a teacher, pathway, school, policy process, or frontline interaction?", routing_rule: "Reject a candidate whose unit is not evidenced by the study materials." }, { step: "Check the mechanism", prompt: "What evidence could show the proposed process?", routing_rule: "Treat the route as conditional if the relevant mechanism cannot be observed or documented." }],
      theory_pathways: [pathwayOption("teacher-identity-theory", "primary", "Professional self-understanding in relation to teaching work", "Teachers' interpreted professional selves in context", "Interviews, reflective writing, role-expectation documents, and interactional accounts", "Keeps professional self-understanding distinct from a fixed trait", "Does not by itself explain policy agenda formation or intervention effects", [sources.teacherIdentity.id]), pathwayOption("educational-equity-theory", "supporting", "Normative and empirical questions about avoidable educational inequality", "A named population, comparator, and institutional arrangement", "Access, allocation, participation, recognition, and outcome evidence", "Makes the normative standard and comparator visible", "Does not itself establish a causal mechanism for unequal outcomes", [sources.equity.id]), pathwayOption("multiple-streams-framework", "not_recommended", "Agenda setting and policy choice under ambiguity", "A dated policy process with distinct streams and coupling", "Indicators, proposals, political records, and timing evidence", "Can explain a bounded agenda-setting question", "Is not a primary lens for everyday teaching, learning, or post-adoption implementation", [sources.multipleStreamsKingdon.id])],
      entry_points: [pathwayEntry("field", "teacher-education-professional-development", "Teacher Education & Professional Development", "Route for teacher-learning and professional-self questions."), pathwayEntry("field", "educational-equity-policy", "Educational Equity & Policy", "Route for normative inequality and policy questions."), pathwayEntry("topic", "teachers-professional-identity-during-reform", "Teachers' professional identity during reform", "Existing question-first comparison."), pathwayEntry("theory", "teacher-identity-theory", "Teacher Identity Theory", "Theory page with bounded mechanisms and sources."), pathwayEntry("scholar", "geert-kelchtermans", "Geert Kelchtermans", "Existing scholar profile for the cited professional self-understanding lens."), pathwayEntry("work", "kelchtermans-2009-teacher-identity", "Who I Am in How I Teach Is the Message", "Source-backed work for the teacher-identity route."), pathwayEntry("concept", "teacher-self-understanding", "Teacher Self-Understanding", "Core identity concept route.")],
      sources: [sources.unescoEducation, sources.teacherIdentity, sources.equity, sources.multipleStreamsKingdon], l1Claim: "The linked UNESCO and theory records verify the bounded institutional and theoretical vocabularies cited on this navigation page.", l1SourceId: sources.unescoEducation.id,
    }) },
  },
  {
    slug: "sociology", titleEn: "Sociology", descriptionEn: "A Syntag navigation route for questions about social relations, institutions, inequality, and patterned social practice.", overviewEn: "This is a bounded Syntag navigation category, not a complete definition of sociology. It routes questions by pathways, recurrent practice, field and capital relations, relation-enabled resources, and organisational mechanisms.",
    content: { en: pathwayContent({
      overview: "The cited corpus works address life-course pathways, recurrent practice, fields and capital, relation-enabled resources, and institutional fields. Syntag uses them to organise a limited sociology route rather than claiming that these theories exhaust the discipline.",
      core_questions: ["How do time, linked lives, and historical context shape a pathway?", "How are rules and resources reproduced or changed in recurrent practice?", "How do field position, capital, or social relations shape unequal access and recognition?"],
      question_categories: [{ category: "Time and pathways", description: "Identify transitions, sequences, linked lives, and historical context.", theory_slugs: ["life-course-theory"] }, { category: "Practice and organisation", description: "Separate recursive enactment from legitimacy, formal structure, and field-level similarity.", theory_slugs: ["structuration-theory", "institutional-theory"] }, { category: "Inequality and relations", description: "Distinguish field/capital mechanisms from relation-enabled resource access.", theory_slugs: ["practice-theory-bourdieu", "social-capital-theory"] }],
      selection_path: [{ step: "Locate the social process", prompt: "Is time, practice, field position, tie-enabled access, or organisational legitimacy central?", routing_rule: "Do not choose a theory from the topic label alone." }, { step: "Set the unit", prompt: "Is evidence at pathway, practice episode, field, network, organisation, or policy level?", routing_rule: "Do not infer across levels without an explicit bridge." }, { step: "Test a rival route", prompt: "Which adjacent theory names a distinct mechanism?", routing_rule: "Keep the alternative when it better matches the material and causal claim." }],
      theory_pathways: [pathwayOption("structuration-theory", "primary", "Rules, resources, and recursive social practice", "Recurrent practices and their structural conditions", "Practice episodes, rules, resources, documents, and accounts of enactment", "Explains reproduction and change without a simple structure-agency split", "Does not substitute for a field/capital or relation-enabled-resource mechanism", [sources.structurationConstitution.id]), pathwayOption("practice-theory-bourdieu", "supporting", "Habitus, capital, field position, and symbolic recognition", "A relationally defined field and its positions", "Trajectories, classifications, capital conversion, and recognition evidence", "Makes stratification and field-specific value analysable", "Requires defensible field and capital evidence, not a generic organisational setting", [sources.practice.id]), pathwayOption("multiple-streams-framework", "not_recommended", "Agenda setting and policy choice", "A dated policy process", "Policy indicators, proposals, politics, and coupling records", "Useful for a bounded policy-process question", "Does not primarily explain social practice, field inequality, or relation-enabled access", [sources.multipleStreamsKingdon.id])],
      entry_points: [pathwayEntry("field", "sociology-of-education", "Sociology of Education", "Route for educational field and resource questions."), pathwayEntry("field", "organizational-sociology", "Organizational Sociology", "Route for recurrent practice and institutional mechanisms."), pathwayEntry("topic", "organizational-routines-and-structural-change", "Organizational routines and structural change", "Existing practice-and-structure comparison."), pathwayEntry("theory", "practice-theory-bourdieu", "Practice Theory (Bourdieu)", "Theory page with field and capital boundaries."), pathwayEntry("scholar", "anthony-giddens", "Anthony Giddens", "Existing scholar profile for the cited structuration route."), pathwayEntry("work", "struct-giddens-1984", "The Constitution of Society", "Source-backed work for recurrent-practice analysis."), pathwayEntry("concept", "rules-and-resources", "Rules and Resources", "Core structuration concept route.")],
      sources: [sources.lifeCourse, sources.structurationConstitution, sources.practice, sources.socialCapital, sources.institutional, sources.multipleStreamsKingdon], l1Claim: "The linked corpus records verify the bounded theoretical vocabularies used to organise this sociology navigation route.", l1SourceId: sources.structurationConstitution.id,
    }) },
  },
];

const fields: Array<Omit<SeedField, "status" | "publishedAt">> = [
  {
    slug: "teacher-education-professional-development", titleEn: "Teacher Education & Professional Development", descriptionEn: "A Syntag route for teacher professional learning, growth, and professional-self questions.", disciplineSlug: "education",
    content: { en: pathwayContent({ overview: "This field route distinguishes professional learning and change from professional self-understanding. It treats Communities of Practice as a conditional social-learning lens, not a label for every training group.", core_questions: ["Is the central process professional learning and change?", "Is the question about teachers' professional self-understanding?", "Is sustained shared practice evidenced?"], question_categories: [{ category: "Learning and growth", description: "Use a named growth model when change across domains or conditions is central.", theory_slugs: ["teacher-professional-development-theory"] }, { category: "Professional self", description: "Use an identity lens when interpretation of professional self and work is central.", theory_slugs: ["teacher-identity-theory"] }, { category: "Participation", description: "Require mutual engagement, joint enterprise, and shared repertoire before using CoP.", theory_slugs: ["communities-of-practice"] }], selection_path: [{ step: "Name the process", prompt: "Is the study explaining learning/change or professional self-understanding?", routing_rule: "Use development and identity as distinct starting lenses." }, { step: "Inspect participation", prompt: "Is there sustained shared practice rather than only a programme or team?", routing_rule: "Use CoP only where its practice conditions are evidenced." }, { step: "Specify materials", prompt: "What materials show the proposed process?", routing_rule: "Match accounts, practice evidence, documents, and observation to the selected mechanism." }], theory_pathways: [pathwayOption("teacher-professional-development-theory", "primary", "Professional learning, growth, and change across connected domains", "Teacher learning processes, practice, and conditions", "Learning histories, practice evidence, programme documents, and contextual accounts", "Supports a named, non-linear growth model", "Does not make attendance or satisfaction evidence of development", [sources.teacherDevelopmentClarke.id]), pathwayOption("teacher-identity-theory", "supporting", "Professional self-understanding and vulnerability in work context", "Teachers' interpreted professional selves", "Narratives, reflective materials, role expectations, and interactional accounts", "Clarifies how teachers make sense of professional work", "Does not by itself model learning or practice change", [sources.teacherIdentity.id]), pathwayOption("communities-of-practice", "not_recommended", "Learning through sustained participation in shared practice", "A community of practice", "Observation, participation episodes, artefacts, and boundary evidence", "Useful only when participation conditions are established", "Not a primary label for a formal training group without shared-practice evidence", [sources.communitiesWenger.id])], entry_points: [pathwayEntry("topic", "teachers-professional-identity-during-reform", "Teachers' professional identity during reform", "Compare identity with professional development."), pathwayEntry("theory", "teacher-professional-development-theory", "Teacher Professional Development Theory", "Primary learning-and-change route."), pathwayEntry("scholar", "geert-kelchtermans", "Geert Kelchtermans", "Existing scholar profile for the supporting professional-self lens."), pathwayEntry("work", "teacher-development-clarke-hollingsworth-2002", "Elaborating a Model of Teacher Professional Growth", "Source-backed work for the primary growth route."), pathwayEntry("concept", "professional-learning", "Professional Learning", "Core concept route.")], sources: [sources.teacherDevelopmentClarke, sources.teacherDevelopmentTimperley, sources.teacherIdentity, sources.communitiesWenger], l1Claim: "The linked records verify the bounded teacher-development, identity, and participation vocabularies cited on this route.", l1SourceId: sources.teacherDevelopmentClarke.id }) },
  },
  {
    slug: "rural-remote-education", titleEn: "Rural & Remote Education", descriptionEn: "A cautious Syntag route for access, pathways, and institutional questions in rural or remote education settings.", disciplineSlug: "education",
    content: { en: pathwayContent({ overview: "This is an editorial navigation label, not a claim that rural and remote education is homogeneous or has one dedicated theory. The current evidence supports only a question-specific pathway route and inclusion/equity context.", core_questions: ["Are timing, linked lives, institutions, and pathways central?", "Is the issue unequal access or participation with an explicit comparator?", "Is the policy question agenda setting or frontline implementation?"], question_categories: [{ category: "Pathways", description: "Use Life Course only for questions about time, timing, linked lives, and institutional pathways.", theory_slugs: ["life-course-theory"] }, { category: "Equity", description: "Specify the population, comparator, and proposed mechanism before using an equity lens.", theory_slugs: ["educational-equity-theory"] }, { category: "Policy delivery", description: "Separate agenda setting from frontline implementation.", theory_slugs: ["street-level-bureaucracy", "multiple-streams-framework"] }], selection_path: [{ step: "Avoid geographic essentialism", prompt: "What concrete access, pathway, policy, or institutional process is being studied?", routing_rule: "Do not infer one rural/remote mechanism from location alone." }, { step: "Choose the unit", prompt: "Is evidence about a pathway, population/comparator, policy process, or frontline interaction?", routing_rule: "Match the theory to that unit." }, { step: "State the boundary", prompt: "What would make the candidate a poor fit?", routing_rule: "Keep theory use conditional on evidence and setting." }], theory_pathways: [pathwayOption("life-course-theory", "primary", "Timing, linked lives, institutions, and historically situated pathways", "Transitions and pathways across time", "Dated transitions, relational accounts, institutional records, and historical context", "Organises temporal and relational sequences", "Does not provide a rural-specific causal account", [sources.lifeCourse.id]), pathwayOption("educational-equity-theory", "supporting", "Normative inquiry into avoidable inequality", "A population and explicit comparator", "Access, allocation, participation, and outcome evidence", "Makes an equity criterion explicit", "Does not make geographic difference itself a mechanism", [sources.equity.id]), pathwayOption("multiple-streams-framework", "not_recommended", "Agenda setting and policy choice", "A dated policy process", "Problem, proposal, political, and coupling evidence", "Can examine a bounded agenda question", "Is not primary for pathways or access after policy adoption", [sources.multipleStreamsKingdon.id])], entry_points: [pathwayEntry("theory", "life-course-theory", "Life Course Theory", "Current primary pathway route."), pathwayEntry("field", "educational-equity-policy", "Educational Equity & Policy", "Adjacent route when a comparator and policy arrangement are explicit."), pathwayEntry("topic", "educational-transitions-over-time", "Educational transitions over time", "Existing transition comparison."), pathwayEntry("scholar", "glen-h-elder-jr", "Glen H. Elder Jr.", "Existing scholar profile for the primary life-course route."), pathwayEntry("work", "elder-1998-life-course", "The Life Course as Developmental Theory", "Source-backed work for the primary pathway route."), pathwayEntry("concept", "transition", "Transition", "Core temporal concept route.")], sources: [sources.unescoEducation, sources.equity, sources.lifeCourse, sources.multipleStreamsKingdon], l1Claim: "The linked records verify the bounded education, inclusion, life-course, and policy-process vocabularies used on this route.", l1SourceId: sources.unescoEducation.id }) },
  },
  {
    slug: "educational-equity-policy", titleEn: "Educational Equity & Policy", descriptionEn: "A Syntag route for normative educational inequality, policy agenda, and frontline implementation questions.", disciplineSlug: "education",
    content: { en: pathwayContent({ overview: "This route keeps an equity question distinct from the explanatory mechanism selected to investigate it. UNESCO and OECD sources provide institutional context, not one universal equity standard.", core_questions: ["What inequality, population, comparator, and normative basis are at issue?", "Is the policy question about agenda setting or frontline delivery?", "What mechanism, beyond inequity itself, is being proposed?"], question_categories: [{ category: "Equity question", description: "Make the normative basis, comparator, and dimension of inequality explicit.", theory_slugs: ["educational-equity-theory"] }, { category: "Frontline implementation", description: "Use Street-Level Bureaucracy when consequential discretion and client interaction are evidenced.", theory_slugs: ["street-level-bureaucracy"] }, { category: "Agenda setting", description: "Use MSF only for distinct streams, timing, and coupling before adoption.", theory_slugs: ["multiple-streams-framework"] }], selection_path: [{ step: "Define equity", prompt: "Who is compared, on what dimension, and against which standard?", routing_rule: "Do not use equity as a synonym for any group difference." }, { step: "Locate policy stage", prompt: "Does the material concern agenda/choice or frontline delivery?", routing_rule: "Use MSF and Street-Level Bureaucracy for their distinct stages." }, { step: "Add an explanatory lens", prompt: "What mechanism could produce the observed inequality?", routing_rule: "Do not convert a normative framing into an established causal account." }], theory_pathways: [pathwayOption("educational-equity-theory", "primary", "Normative and empirical inquiry into avoidable educational inequality", "A population, comparator, and institutional arrangement", "Access, allocation, participation, recognition, and outcome materials", "Requires explicit normative and comparative reasoning", "Does not establish the causal process behind an unequal outcome", [sources.equity.id]), pathwayOption("street-level-bureaucracy", "supporting", "Frontline discretion under implementation constraints", "Case-level public-service interaction", "Guidance, workload, resource, interaction, and decision records", "Explains delivery conditions after policy adoption", "Does not explain agenda setting or provide an equity standard", [sources.streetLevel.id]), pathwayOption("multiple-streams-framework", "not_recommended", "Agenda setting, alternatives, and coupling", "A dated policy process", "Problem indicators, proposals, politics, and policy-window evidence", "Can explain a bounded agenda question", "Not primary for frontline delivery after adoption", [sources.multipleStreamsKingdon.id])], entry_points: [pathwayEntry("topic", "inequality-in-educational-and-social-fields", "Inequality in educational and social fields", "Existing question comparison for a separate explanatory route."), pathwayEntry("theory", "educational-equity-theory", "Educational Equity Theory", "Primary normative screening route."), pathwayEntry("theory", "street-level-bureaucracy", "Street-Level Bureaucracy", "Implementation route."), pathwayEntry("scholar", "pierre-bourdieu", "Pierre Bourdieu", "Adjacent scholar route for field-and-capital explanation; not an equity-theory attribution."), pathwayEntry("work", "practice-capital-1986", "The Forms of Capital", "Adjacent explanatory resource for field-conditioned inequality, not a universal equity standard."), pathwayEntry("concept", "educational-equity", "Educational Equity", "Core concept route.")], sources: [sources.equity, sources.equityOecd, sources.streetLevel, sources.multipleStreamsKingdon], l1Claim: "The linked UNESCO, OECD, and theory records verify the bounded equity, implementation, and agenda-setting vocabularies cited on this route.", l1SourceId: sources.equity.id }) },
  },
  {
    slug: "life-course-aging-studies", titleEn: "Life Course & Aging Studies", descriptionEn: "A Syntag route for pathways, timing, linked lives, and historical context across lives.", disciplineSlug: "sociology",
    content: { en: pathwayContent({ overview: "The cited life-course works support pathways across historical context and life span. This route does not treat aging as uniform or claim a separate, exhaustive disciplinary boundary.", core_questions: ["Which pathway, transition, or turning point is central?", "How do timing, linked lives, and institutions enter the account?", "Is narrative interpretation supplementary to an explanatory life-course mechanism?"], question_categories: [{ category: "Temporal pathways", description: "Use Life Course for timing, sequence, linked lives, and historical context.", theory_slugs: ["life-course-theory"] }, { category: "Narrated biography", description: "Use life history as an interpretive complement when narration and representation are central.", theory_slugs: ["teacher-life-history-research"] }, { category: "Policy agenda", description: "Keep policy-process accounts separate from individual or relational pathways.", theory_slugs: ["multiple-streams-framework"] }], selection_path: [{ step: "Name the temporal object", prompt: "Is it a trajectory, transition, or claimed turning point?", routing_rule: "Do not treat any chronological list as a pathway mechanism." }, { step: "Specify context", prompt: "Which linked lives, institutions, and historical conditions are evidenced?", routing_rule: "Use Life Course only with context beyond age or sequence alone." }, { step: "Separate method from theory", prompt: "Is narrative material the explanation or evidence?", routing_rule: "Use life history as a method/tradition complement where appropriate." }], theory_pathways: [pathwayOption("life-course-theory", "primary", "Pathways, timing, linked lives, and historical context", "Transitions and trajectories across lives", "Dated sequences, historical records, relational accounts, and institutional context", "Links biography to time and social context", "Does not establish causality from temporal order alone", [sources.lifeCourse.id]), pathwayOption("teacher-life-history-research", "supporting", "Interpreted narration of lives in social and historical context", "Narrated life histories and contextual materials", "Narratives, documents, reflexive notes, and ethical records", "Supports careful interpretation of biographical material", "Does not itself supply life-course mechanisms or population estimates", [sources.lifeHistory.id]), pathwayOption("multiple-streams-framework", "not_recommended", "Agenda setting and policy choice", "A policy process", "Policy indicators, proposals, politics, and coupling records", "Useful for a distinct policy-stage question", "Does not explain an individual's or cohort's pathway", [sources.multipleStreamsKingdon.id])], entry_points: [pathwayEntry("topic", "educational-transitions-over-time", "Educational transitions over time", "Existing temporal comparison."), pathwayEntry("theory", "life-course-theory", "Life Course Theory", "Primary pathway route."), pathwayEntry("scholar", "glen-h-elder-jr", "Glen H. Elder Jr.", "Existing scholar profile for the primary life-course route."), pathwayEntry("work", "elder-1998-life-course", "The Life Course as Developmental Theory", "Source-backed work for the primary pathway route."), pathwayEntry("concept", "trajectory", "Trajectory", "Core temporal concept route.")], sources: [sources.lifeCourse, sources.lifeCourseHandbook, sources.lifeHistory, sources.multipleStreamsKingdon], l1Claim: "The linked records verify the bounded life-course, life-history, and policy-process vocabularies cited on this route.", l1SourceId: sources.lifeCourse.id }) },
  },
  {
    slug: "sociology-of-education", titleEn: "Sociology of Education", descriptionEn: "A Syntag route for resource access, field position, capital conversion, recognition, and educational inequality questions.", disciplineSlug: "sociology",
    content: { en: pathwayContent({ overview: "Coleman and Bourdieu offer distinct source-backed vocabularies for relations and capital in education. This route does not claim an exhaustive map of sociology of education.", core_questions: ["Is unequal access explained through relation-enabled resources?", "Are field position, capital conversion, and recognition central?", "Has the study stated an equity comparator rather than only a difference?"], question_categories: [{ category: "Relation-enabled access", description: "Name the tie, resource, mechanism, and analysis unit.", theory_slugs: ["social-capital-theory"] }, { category: "Field and capital", description: "Establish positions, stakes, capital value, conversion, and recognition.", theory_slugs: ["practice-theory-bourdieu"] }, { category: "Normative inequality", description: "State the comparator and normative basis before using equity framing.", theory_slugs: ["educational-equity-theory"] }], selection_path: [{ step: "Distinguish mechanism", prompt: "Is the mechanism tie-enabled access or field-conditioned value and recognition?", routing_rule: "Keep Social Capital and Bourdieu's Practice Theory analytically distinct." }, { step: "Set the unit", prompt: "Is evidence at dyad/network, field, institution, or population level?", routing_rule: "Do not infer benefit from a tie count or field position from a label alone." }, { step: "State equity separately", prompt: "What is the normative comparator?", routing_rule: "Use equity as a framing only after its standard is explicit." }], theory_pathways: [pathwayOption("social-capital-theory", "primary", "Relation-enabled resource access and mobilisation", "A specified actor, tie, network, or organisation", "Requests, referrals, exchanges, support, non-access, and institutional gatekeeping", "Clarifies how particular relations make resources reachable", "Does not make every contact beneficial or explain field-specific value", [sources.socialCapital.id]), pathwayOption("practice-theory-bourdieu", "supporting", "Field position, capital, habitus, and symbolic recognition", "A relationally defined field and positions within it", "Capital conversion, classifications, trajectories, and recognition evidence", "Explains stratification beyond tie counts", "Requires field and capital evidence rather than demographic shorthand", [sources.practiceCapital.id]), pathwayOption("educational-equity-theory", "not_recommended", "Normative inquiry into avoidable inequality", "A population and explicit comparator", "Access, allocation, participation, and outcome evidence", "Clarifies the normative question", "Not primary if the study has no stated equity criterion or comparison", [sources.equity.id])], entry_points: [pathwayEntry("topic", "inequality-in-educational-and-social-fields", "Inequality in educational and social fields", "Existing inequality comparison."), pathwayEntry("theory", "social-capital-theory", "Social Capital Theory", "Relation-enabled access route."), pathwayEntry("scholar", "pierre-bourdieu", "Pierre Bourdieu", "Existing scholar profile for the supporting field-and-capital route."), pathwayEntry("work", "practice-capital-1986", "The Forms of Capital", "Source-backed work for the supporting field-and-capital route."), pathwayEntry("concept", "relational-resource-access", "Relational Resource Access", "Core relation-and-resource concept.")], sources: [sources.socialCapital, sources.practiceCapital, sources.equity, sources.unescoEducation], l1Claim: "The linked records verify the bounded social-capital, capital-conversion, and equity vocabularies cited on this route.", l1SourceId: sources.socialCapital.id }) },
  },
  {
    slug: "organizational-sociology", titleEn: "Organizational Sociology", descriptionEn: "A Syntag route for recurrent practice, rules and resources, legitimacy, formal structure, and organisational fields.", disciplineSlug: "sociology",
    content: { en: pathwayContent({ overview: "Giddens, Meyer and Rowan, and DiMaggio and Powell provide distinct accounts of recurrent practice, institutionalised formal structure, and field-level similarity. This route distinguishes their mechanisms rather than treating any organisation as evidence of either.", core_questions: ["How are rules and resources enacted in recurrent practice?", "How do legitimacy, formal structure, and possible decoupling matter?", "Is similarity explained by a named institutional mechanism rather than resemblance alone?"], question_categories: [{ category: "Recursive practice", description: "Trace rules/resources as practices are reproduced or altered.", theory_slugs: ["structuration-theory"] }, { category: "Institutional organisation", description: "Examine legitimacy, formal structure, decoupling, and named field pressures.", theory_slugs: ["institutional-theory"] }, { category: "Relations and resources", description: "Use social-capital theory only when resource access through specified relations is the mechanism.", theory_slugs: ["social-capital-theory"] }], selection_path: [{ step: "Name the mechanism", prompt: "Is the explanation recursive practice or institutional legitimacy/field pressure?", routing_rule: "Do not collapse Structuration and Institutional Theory into generic structure." }, { step: "Choose evidence", prompt: "What would show rules/resources, formal adoption, decoupling, or a specific pressure?", routing_rule: "Similarity or an organisation chart alone is insufficient." }, { step: "Check alternatives", prompt: "Is relation-enabled resource access actually central?", routing_rule: "Use Social Capital only if a specified relational mechanism is evidenced." }], theory_pathways: [pathwayOption("structuration-theory", "primary", "Rules, resources, and recursive enactment", "Recurrent organisational practices", "Routine episodes, procedural materials, resource allocations, and accounts of enactment", "Explains how practice can reproduce or alter arrangements", "Does not by itself explain legitimacy or field isomorphism", [sources.structurationConstitution.id]), pathwayOption("institutional-theory", "supporting", "Institutionalised rules, legitimacy, formal structure, and fields", "Organisations in a defined institutional field", "Formal structures, field comparisons, pressure accounts, and enactment evidence", "Distinguishes formal adoption from ongoing activity", "Does not establish institutional mechanism from similarity alone", [sources.institutionalMeyerRowan.id]), pathwayOption("social-capital-theory", "not_recommended", "Relation-enabled resource access", "Specified ties or networks", "Resource requests, referrals, exchanges, and non-access cases", "Useful for a separate relational-resource question", "Not primary when no relation-enabled resource mechanism is proposed", [sources.socialCapital.id])], entry_points: [pathwayEntry("topic", "organizational-routines-and-structural-change", "Organizational routines and structural change", "Existing structure-and-practice comparison."), pathwayEntry("theory", "structuration-theory", "Structuration Theory", "Primary recursive-practice route."), pathwayEntry("scholar", "anthony-giddens", "Anthony Giddens", "Existing scholar profile for the primary structuration route."), pathwayEntry("work", "struct-giddens-1984", "The Constitution of Society", "Source-backed work for the primary recursive-practice route."), pathwayEntry("concept", "rules-and-resources", "Rules and Resources", "Core structuration concept.")], sources: [sources.structurationConstitution, sources.institutionalMeyerRowan, sources.institutional, sources.socialCapital], l1Claim: "The linked records verify the bounded structuration, institutional, and social-capital vocabularies cited on this route.", l1SourceId: sources.structurationConstitution.id }) },
  },
];

const disciplineTheories: SeedTheoryDiscipline[] = [
  ...["life-course-theory", "teacher-identity-theory", "communities-of-practice", "teacher-professional-development-theory", "teacher-life-history-research", "educational-equity-theory", "institutional-theory", "street-level-bureaucracy", "multiple-streams-framework"].map((theorySlug) => ({ disciplineSlug: "education", theorySlug, relevance: "primary" as const })),
  ...["life-course-theory", "structuration-theory", "communities-of-practice", "practice-theory-bourdieu", "social-capital-theory", "institutional-theory"].map((theorySlug) => ({ disciplineSlug: "sociology", theorySlug, relevance: "primary" as const })),
];

const fieldTheories: SeedTheoryField[] = [
  { fieldSlug: "teacher-education-professional-development", theorySlug: "teacher-identity-theory" },
  { fieldSlug: "teacher-education-professional-development", theorySlug: "teacher-professional-development-theory" },
  { fieldSlug: "rural-remote-education", theorySlug: "life-course-theory" },
  { fieldSlug: "educational-equity-policy", theorySlug: "educational-equity-theory" },
  { fieldSlug: "educational-equity-policy", theorySlug: "street-level-bureaucracy" },
  { fieldSlug: "life-course-aging-studies", theorySlug: "life-course-theory" },
  { fieldSlug: "sociology-of-education", theorySlug: "social-capital-theory" },
  { fieldSlug: "organizational-sociology", theorySlug: "institutional-theory" },
];

const genealogy: SeedGenealogy[] = [
  { id: "life-course:teacher-life-history", sourceSlug: "life-course-theory", targetSlug: "teacher-life-history-research", relationType: "integrated_with", descriptionEn: "The two can be combined in a bounded study of biography and time, but Life Course Theory is an explanatory perspective and teacher life-history research is an interpretive research tradition.", strength: 3 },
  { id: "life-course:teacher-development", sourceSlug: "life-course-theory", targetSlug: "teacher-professional-development-theory", relationType: "extended_by", descriptionEn: "Career development extends attention to timing and transitions in professional lives.", strength: 4 },
  { id: "life-course:teacher-identity", sourceSlug: "life-course-theory", targetSlug: "teacher-identity-theory", relationType: "integrated_with", descriptionEn: "Temporal biography and professional identity can be connected in teacher research.", strength: 4 },
  { id: "teacher-identity:teacher-development", sourceSlug: "teacher-identity-theory", targetSlug: "teacher-professional-development-theory", relationType: "integrated_with", descriptionEn: "Identity, commitment, and learning can be analysed together across teachers' careers.", strength: 4 },
  { id: "practice:social-capital", sourceSlug: "practice-theory-bourdieu", targetSlug: "social-capital-theory", relationType: "branched_from", descriptionEn: "Theories of social capital overlap with Bourdieu's broader account of capital and social relations.", strength: 4 },
  { id: "practice:institutional", sourceSlug: "practice-theory-bourdieu", targetSlug: "institutional-theory", relationType: "integrated_with", descriptionEn: "Both theories can be used to examine how fields, positions, norms, and legitimacy shape organisational practice.", strength: 3 },
  { id: "practice:structuration", sourceSlug: "practice-theory-bourdieu", targetSlug: "structuration-theory", relationType: "critiqued_by", descriptionEn: "They offer distinct accounts of how structure and agency relate in social practice.", strength: 3 },
  { id: "street-level:multiple-streams", sourceSlug: "street-level-bureaucracy", targetSlug: "multiple-streams-framework", relationType: "integrated_with", descriptionEn: "Together they connect agenda change with frontline enactment after policy adoption.", strength: 4 },
];

const scholars: SeedScholar[] = [
  {
    slug: "glen-h-elder-jr",
    name: "Glen H. Elder Jr.",
    bioEn: "Sociologist whose source-backed profile and writings support a bounded contribution to life-course research.",
    content: { en: {
      overview: "A sociologist whose SAGE author record identifies a life-course studies research programme; this page limits its claims to the source-backed contribution represented in Syntag's Life Course Theory entry.",
      academic_identity: { discipline: "Sociology and psychology", role: "Research professor and life-course studies researcher", source_ids: [sources.elderSageProfile.id] },
      theory_relationships: [{ theory_slug: "life-course-theory", relationship: "Key contributor", description: "Elder's 1998 article is a primary source record for the Life Course Theory page; Syntag treats this as a bounded contribution, not sole ownership of the broader tradition.", source_ids: [sources.lifeCourse.id, sources.lifeCourseHandbook.id] }],
      representative_works: [{ title: "The Life Course as Developmental Theory", work_slug: "elder-1998-life-course", contribution: "Provides the corpus's direct life-course framing of development across time, context, and biography.", source_ids: [sources.lifeCourse.id] }, { title: "The Emergence and Development of Life Course Theory", contribution: "A coauthored historical and conceptual synthesis used for the page's development context.", source_ids: [sources.lifeCourseHandbook.id] }],
      scholarly_relations: [{ kind: "development", description: "The 2003 coauthored chapter is presented as a historical and conceptual synthesis of life-course theory; it is not evidence that Elder singly founded every life-course tradition.", source_ids: [sources.lifeCourseHandbook.id] }],
      attribution_boundaries: ["Do not attribute every life-course principle, the entire tradition, or all life-history methods to Elder alone.", "Do not turn the source-backed contribution into a claim that temporal sequences alone cause later outcomes."],
      reading_path: [{ order: 1, title: "The Life Course as Developmental Theory", purpose: "Start with the corpus's direct theoretical anchor.", source_id: sources.lifeCourse.id }, { order: 2, title: "The Emergence and Development of Life Course Theory", purpose: "Read the coauthored historical synthesis before assigning sole-originator status.", source_id: sources.lifeCourseHandbook.id }, { order: 3, title: "SAGE author profile", purpose: "Check the limited academic-positioning claim.", source_id: sources.elderSageProfile.id }],
      sources: [sources.elderSageProfile, sources.lifeCourse, sources.lifeCourseHandbook],
      verification: [{ claim: "SAGE identifies Elder with sociology, psychology, and a life-course studies research programme; the DOI records the 1998 article.", evidence_level: "L1", source_id: sources.elderSageProfile.id, status: "verified" }, { claim: "The key-contributor wording and attribution boundary are bounded Syntag editorial synthesis rather than a claim of sole authorship of life-course scholarship.", evidence_level: "L2", status: "editorial" }, { claim: "Reading choices and research use should depend on the study question, data access, ethics, and disciplinary guidance.", evidence_level: "L3", status: "proposed" }],
    } },
    status: "published",
    publishedAt,
  },
  {
    slug: "geert-kelchtermans",
    name: "Geert Kelchtermans",
    bioEn: "Education scholar whose source-backed work provides a bounded professional self-understanding lens for teacher identity.",
    content: { en: {
      overview: "An education scholar whose KU Leuven profile and 2009 article support this page's limited account of teacher professional self-understanding.",
      academic_identity: { discipline: "Education", role: "Professor researching educational innovation and teachers' professional development", source_ids: [sources.kelchtermansKuProfile.id] },
      theory_relationships: [{ theory_slug: "teacher-identity-theory", relationship: "Key contributor", description: "The 2009 article provides the professional self-understanding lens used by the Teacher Identity Theory page; it does not establish one founder for the whole field.", source_ids: [sources.teacherIdentity.id, sources.kelchtermansKuProfile.id] }],
      representative_works: [{ title: "Who I Am in How I Teach Is the Message", work_slug: "kelchtermans-2009-teacher-identity", contribution: "Provides the corpus's cited route from teachers' professional self-understanding to identity analysis.", source_ids: [sources.teacherIdentity.id] }],
      scholarly_relations: [{ kind: "development", description: "KU Leuven documents a narrative-biographical focus on teacher professional development; Syntag uses this only to explain a bounded continuity with professional self-understanding.", source_ids: [sources.kelchtermansKuProfile.id] }],
      attribution_boundaries: ["Do not attribute the Beijaard, Meijer, and Verloop field review or all dialogical identity approaches to Kelchtermans.", "Do not describe Teacher Identity Theory as a unified theory founded by a single scholar."],
      reading_path: [{ order: 1, title: "Who I Am in How I Teach Is the Message", purpose: "Start with the direct professional self-understanding source.", source_id: sources.teacherIdentity.id }, { order: 2, title: "Reconsidering Research on Teachers' Professional Identity", purpose: "Distinguish the field review from this scholar's specific lens.", source_id: sources.teacherIdentityBeijaard.id }, { order: 3, title: "KU Leuven profile", purpose: "Check the limited academic-positioning and research-area claim.", source_id: sources.kelchtermansKuProfile.id }],
      sources: [sources.kelchtermansKuProfile, sources.teacherIdentity, sources.teacherIdentityBeijaard],
      verification: [{ claim: "KU Leuven identifies Kelchtermans's education research area and the DOI records the 2009 article.", evidence_level: "L1", source_id: sources.kelchtermansKuProfile.id, status: "verified" }, { claim: "The key-contributor wording and field boundary are bounded Syntag editorial synthesis.", evidence_level: "L2", status: "editorial" }, { claim: "Reading choices and research use should depend on the study question, data access, ethics, and disciplinary guidance.", evidence_level: "L3", status: "proposed" }],
    } },
    status: "published",
    publishedAt,
  },
  {
    slug: "anthony-giddens",
    name: "Anthony Giddens",
    bioEn: "Sociologist whose source-backed books provide the corpus's bounded Structuration Theory anchor.",
    content: { en: {
      overview: "A sociologist listed by the LSE among Sociology emeriti; this profile confines its theoretical claims to the Structuration Theory formulation represented by the corpus's publisher records.",
      academic_identity: { discipline: "Sociology", role: "Sociologist and sociology professor", source_ids: [sources.giddensLseProfile.id] },
      theory_relationships: [{ theory_slug: "structuration-theory", relationship: "Founder of Structuration Theory", description: "The Constitution of Society is the corpus's integrated Structuration Theory formulation; this founder relation is limited to Structuration Theory rather than every account of structure and agency.", source_ids: [sources.structurationConstitution.id] }],
      representative_works: [{ title: "Central Problems in Social Theory", contribution: "An earlier corpus source for action, structure, power, and time-space.", source_ids: [sources.structurationCentral.id] }, { title: "The Constitution of Society", work_slug: "struct-giddens-1984", contribution: "The corpus's integrated formulation for rules, resources, duality, and recursive practice.", source_ids: [sources.structurationConstitution.id] }],
      scholarly_relations: [{ kind: "development", description: "Syntag treats the 1979 and 1984 publisher records as an earlier formation and later integrated formulation; later Sewell and Archer entries are alternatives or reformulations, not asserted personal relationships.", source_ids: [sources.structurationCentral.id, sources.structurationConstitution.id, sources.structurationSewell.id, sources.structurationArcher.id] }],
      attribution_boundaries: ["Do not attribute every account of structure and agency to Giddens.", "Do not treat Structuration Theory as interchangeable with Sewell's reformulation or Archer's morphogenetic alternative."],
      reading_path: [{ order: 1, title: "Central Problems in Social Theory", purpose: "Read the earlier formation source first.", source_id: sources.structurationCentral.id }, { order: 2, title: "The Constitution of Society", purpose: "Read the corpus's integrated Structuration Theory formulation.", source_id: sources.structurationConstitution.id }, { order: 3, title: "Sewell and Archer", purpose: "Compare cited later reformulation and alternative rather than collapsing them into Structuration Theory.", source_id: sources.structurationSewell.id }, { order: 4, title: "LSE profile", purpose: "Check the limited academic-positioning claim.", source_id: sources.giddensLseProfile.id }],
      sources: [sources.giddensLseProfile, sources.structurationCentral, sources.structurationConstitution, sources.structurationSewell, sources.structurationArcher],
      verification: [{ claim: "The LSE profile records Giddens in Sociology and University of California Press records the two cited books.", evidence_level: "L1", source_id: sources.giddensLseProfile.id, status: "verified" }, { claim: "The founder wording is limited to Structuration Theory and the development comparison is bounded Syntag editorial synthesis.", evidence_level: "L2", status: "editorial" }, { claim: "Reading choices and research use should depend on the study question, data access, ethics, and disciplinary guidance.", evidence_level: "L3", status: "proposed" }],
    } },
    status: "published",
    publishedAt,
  },
  {
    slug: "pierre-bourdieu",
    name: "Pierre Bourdieu",
    bioEn: "Sociologist whose source-backed writings anchor this corpus's Bourdieu-specific Practice Theory entry.",
    content: { en: {
      overview: "A sociologist documented by the Collège de France; this profile limits its contribution claim to the Bourdieu-specific Practice Theory entry and its cited sources.",
      academic_identity: { discipline: "Sociology", role: "Professor holding the Sociology chair at the Collège de France", source_ids: [sources.bourdieuCollegeProfile.id, sources.bourdieuCollegeChair.id] },
      theory_relationships: [{ theory_slug: "practice-theory-bourdieu", relationship: "Founder of the Bourdieu-specific Practice Theory entry", description: "Outline of a Theory of Practice anchors the corpus's account of habitus, field, capital, and practice; this does not make Bourdieu the founder of every practice theory or social-capital tradition.", source_ids: [sources.practice.id] }],
      representative_works: [{ title: "Outline of a Theory of Practice", work_slug: "bourdieu-1977-outline-practice", contribution: "The corpus's direct source for habitus, field, and relational practice.", source_ids: [sources.practice.id] }, { title: "The Logic of Practice", contribution: "A cited publisher record for practical sense, practice, and symbolic domination.", source_ids: [sources.practiceLogic.id] }, { title: "An Invitation to Reflexive Sociology", contribution: "A verified coauthored work with Loïc J. D. Wacquant used for a bounded reflexivity connection.", source_ids: [sources.practiceReflexive.id] }],
      scholarly_relations: [{ kind: "collaboration", description: "The University of Chicago Press record verifies Bourdieu and Loïc J. D. Wacquant as coauthors of An Invitation to Reflexive Sociology; it does not establish a broader collaboration network or mentorship claim.", source_ids: [sources.practiceReflexive.id] }],
      attribution_boundaries: ["Do not attribute all capital theory, every social-capital tradition, all practice theory, or later applications to Bourdieu.", "Keep Coleman and Lin's social-capital traditions distinct, and do not infer a personal relation from a theory comparison."],
      reading_path: [{ order: 1, title: "Outline of a Theory of Practice", purpose: "Start with the corpus's main Practice Theory anchor.", source_id: sources.practice.id }, { order: 2, title: "The Logic of Practice", purpose: "Read the publisher record for the later practice formulation.", source_id: sources.practiceLogic.id }, { order: 3, title: "An Invitation to Reflexive Sociology", purpose: "Use the verified coauthored work for the limited collaboration and reflexivity boundary.", source_id: sources.practiceReflexive.id }, { order: 4, title: "Collège de France profile", purpose: "Check the limited academic-positioning claim.", source_id: sources.bourdieuCollegeProfile.id }],
      sources: [sources.bourdieuCollegeProfile, sources.bourdieuCollegeChair, sources.practice, sources.practiceLogic, sources.practiceReflexive],
      verification: [{ claim: "Collège de France records Bourdieu's Sociology chair and the publisher and DOI records identify the cited works.", evidence_level: "L1", source_id: sources.bourdieuCollegeProfile.id, status: "verified" }, { claim: "The founder wording is limited to the Bourdieu-specific entry and the attribution boundaries are bounded Syntag editorial synthesis.", evidence_level: "L2", status: "editorial" }, { claim: "Reading choices and research use should depend on the study question, data access, ethics, and disciplinary guidance.", evidence_level: "L3", status: "proposed" }],
    } },
    status: "published",
    publishedAt,
  },
];

const theoryScholars: SeedTheoryScholar[] = [
  {
    theorySlug: "life-course-theory",
    scholarSlug: "glen-h-elder-jr",
    role: "key_contributor",
    sourceUrls: [sources.lifeCourse.url],
    evidenceNotesEn: "The Life Course Theory page uses Elder's 1998 article as its L1 source record, so the relation records Elder as a key contributor without claiming sole authorship of all life-course scholarship.",
  },
  {
    theorySlug: "teacher-identity-theory",
    scholarSlug: "geert-kelchtermans",
    role: "key_contributor",
    sourceUrls: [sources.teacherIdentity.url],
    evidenceNotesEn: "The teacher identity page is anchored to Kelchtermans' cited article on teacher self-understanding, supporting a key-contributor relation.",
  },
  {
    theorySlug: "structuration-theory",
    scholarSlug: "anthony-giddens",
    role: "founder",
    sourceUrls: [sources.structurationConstitution.url],
    evidenceNotesEn: "The Structuration Theory page is anchored to Giddens' The Constitution of Society, supporting a founder relation for this corpus entry.",
  },
  {
    theorySlug: "practice-theory-bourdieu",
    scholarSlug: "pierre-bourdieu",
    role: "founder",
    sourceUrls: [sources.practice.url],
    evidenceNotesEn: "The practice theory page is anchored to Bourdieu's Outline of a Theory of Practice, supporting a founder relation for this Bourdieu-specific entry.",
  },
];

const topics: SeedTopic[] = [
  {
    slug: "teachers-professional-identity-during-reform",
    questionEn: "How do teachers negotiate professional identity during education reform?",
    content: { en: pathwayContent({
      overview: "This page compares professional self-understanding, professional growth, and life-history inquiry for a reform question. The recommendation is editorial and depends on whether the study can evidence interpretation of self and work in context.",
      core_questions: ["How do teachers interpret and negotiate professional selves during reform?", "Is learning or practice change a distinct supporting process?", "Would a narrative tradition supply material without becoming the explanatory theory?"],
      question_categories: [{ category: "Professional self-understanding", description: "Identity is central when teachers' interpretation of self and work is the explanatory object.", theory_slugs: ["teacher-identity-theory"] }, { category: "Professional learning", description: "Growth models can support a distinct learning or practice-change question.", theory_slugs: ["teacher-professional-development-theory"] }, { category: "Narrated lives", description: "Life history can provide interpretive material without replacing an identity mechanism.", theory_slugs: ["teacher-life-history-research"] }],
      selection_path: [{ step: "Locate the reform effect", prompt: "Is the question about professional self-understanding, learning/change, or narrated experience?", routing_rule: "Use the lens that names the proposed process, not reform as a generic context." }, { step: "Set the unit", prompt: "Are accounts about interpreted professional selves, growth processes, or life histories?", routing_rule: "Do not treat a story as a complete identity or causal account." }, { step: "Plan materials", prompt: "What materials show the proposed process and its conditions?", routing_rule: "Use narrative, documentary, and practice material conditionally and ethically." }],
      theory_pathways: [pathwayOption("teacher-identity-theory", "primary", "Professional self-understanding, agency, and vulnerability in teaching context", "Teachers' interpreted professional selves", "Interviews, reflective writing, role-expectation documents, and interactional accounts", "Directly matches negotiation of professional identity", "Does not by itself establish professional learning effects or policy causation", [sources.teacherIdentity.id, sources.teacherIdentityLasky.id]), pathwayOption("teacher-professional-development-theory", "supporting", "Professional learning, growth, and practice change", "Teacher learning processes and conditions", "Learning histories, practice evidence, programme records, and contextual accounts", "Can specify a distinct learning/change process", "Should not replace an identity lens when self-understanding is the central object", [sources.teacherDevelopmentClarke.id]), pathwayOption("teacher-life-history-research", "not_recommended", "Interpretive inquiry into narrated lives", "Narrated life histories", "Life-history interviews, contextual documents, and reflexive notes", "Can enrich narrative material", "Not primary because it is a research tradition rather than an explanatory identity mechanism", [sources.lifeHistoryTeachers.id])],
      entry_points: [pathwayEntry("theory", "teacher-identity-theory", "Teacher Identity Theory", "Primary editorial recommendation."), pathwayEntry("theory", "teacher-professional-development-theory", "Teacher Professional Development Theory", "Supporting route for learning and change."), pathwayEntry("concept", "teacher-self-understanding", "Teacher Self-Understanding", "Core concept route.")],
      sources: [sources.teacherIdentity, sources.teacherIdentityLasky, sources.teacherDevelopmentClarke, sources.lifeHistoryTeachers], l1Claim: "The linked records verify the bounded identity, reform-context, professional-growth, and life-history vocabularies cited on this topic page.", l1SourceId: sources.teacherIdentity.id,
    }) },
    status: "published",
    publishedAt,
  },
  {
    slug: "educational-transitions-over-time",
    questionEn: "How do educational transitions unfold across time, relationships, and institutions?",
    content: { en: pathwayContent({
      overview: "This page routes a temporal transition question to Life Course Theory while keeping narrative life-history inquiry and agenda-setting analysis distinct. The primary label is an editorial fit judgment, not a universal ranking.",
      core_questions: ["Which transition, pathway, or turning point is central?", "How do linked lives, institutions, and historical conditions enter the account?", "Is narrated biography supplementary to, rather than proof of, an explanatory pathway?"],
      question_categories: [{ category: "Temporal pathway", description: "Use Life Course when timing, linked lives, and historical context are central.", theory_slugs: ["life-course-theory"] }, { category: "Narrated biography", description: "Use life history as an interpretive complement when representation and narration are central.", theory_slugs: ["teacher-life-history-research"] }, { category: "Policy agenda", description: "Keep MSF for agenda/choice questions rather than a transition after policy is set.", theory_slugs: ["multiple-streams-framework"] }],
      selection_path: [{ step: "Name the temporal object", prompt: "Is the object a transition, trajectory, or claimed turning point?", routing_rule: "Do not infer a pathway mechanism from chronology alone." }, { step: "Map contexts", prompt: "Which linked lives, institutions, and historical conditions are evidenced?", routing_rule: "Use Life Course only where those contexts can be examined." }, { step: "Separate process from material", prompt: "Does narrative material interpret a life or prove the proposed mechanism?", routing_rule: "Keep a life-history method complement distinct from the primary explanatory theory." }],
      theory_pathways: [pathwayOption("life-course-theory", "primary", "Transitions, timing, linked lives, and historical context", "Pathways and transitions across lives", "Dated sequences, relational accounts, institutional records, and historical context", "Matches the temporal-relational structure of the question", "Does not establish causality from temporal order alone", [sources.lifeCourse.id, sources.lifeCourseHandbook.id]), pathwayOption("teacher-life-history-research", "supporting", "Interpretive narration of lives in social and historical context", "Narrated life histories", "Narratives, documents, reflexive notes, and ethics materials", "Can interpret biographical meaning", "Does not itself explain all life-course mechanisms or population patterns", [sources.lifeHistoryTeachers.id]), pathwayOption("multiple-streams-framework", "not_recommended", "Agenda setting and policy choice under ambiguity", "A dated policy process", "Problem indicators, proposals, political records, and coupling evidence", "Can analyse a separate agenda-setting question", "Does not primarily explain a transition after policy adoption", [sources.multipleStreamsKingdon.id])],
      entry_points: [pathwayEntry("theory", "life-course-theory", "Life Course Theory", "Primary editorial recommendation."), pathwayEntry("concept", "transition", "Transition", "Core temporal concept route."), pathwayEntry("work", "elder-1998-life-course", "The Life Course as Developmental Theory", "Core reading route.")],
      sources: [sources.lifeCourse, sources.lifeCourseHandbook, sources.lifeHistoryTeachers, sources.multipleStreamsKingdon], l1Claim: "The linked records verify the bounded life-course, life-history, and policy-process vocabularies cited on this topic page.", l1SourceId: sources.lifeCourse.id,
    }) },
    status: "published",
    publishedAt,
  },
  {
    slug: "organizational-routines-and-structural-change",
    questionEn: "How do organizational routines reproduce or change structural rules and resources?",
    content: { en: pathwayContent({
      overview: "This page compares recursive practice with institutional organisation and relation-enabled resource access. It recommends Structuration Theory only for evidence about rules, resources, and recurrent enactment.",
      core_questions: ["How are rules and resources drawn on, reproduced, or altered in practice?", "Do legitimacy, formal adoption, or field pressure provide a distinct mechanism?", "Is resource access through specified relations actually the central explanation?"],
      question_categories: [{ category: "Recursive practice", description: "Trace rules/resources in recurrent organisational practices.", theory_slugs: ["structuration-theory"] }, { category: "Institutional organisation", description: "Use Institutional Theory for legitimacy, formal structure, decoupling, or field pressure.", theory_slugs: ["institutional-theory"] }, { category: "Relation-enabled resources", description: "Use Social Capital only with a named relational-access mechanism.", theory_slugs: ["social-capital-theory"] }],
      selection_path: [{ step: "Name the process", prompt: "Is the claimed process recursive enactment, institutional pressure, or relation-enabled access?", routing_rule: "Do not use a generic structure-and-agency label." }, { step: "Set the unit", prompt: "Is evidence about a practice episode, organisation, field, or network?", routing_rule: "Match the theory to the unit rather than the organisation name." }, { step: "Check materials", prompt: "What would show rule/resource use, formal adoption, or resource mobilisation?", routing_rule: "Do not infer a mechanism from similarity or contact counts alone." }],
      theory_pathways: [pathwayOption("structuration-theory", "primary", "Rules, resources, and recursive social practice", "Recurrent organisational practices", "Routine episodes, procedures, resource allocations, and accounts of enactment", "Directly matches reproduction or change of rules/resources", "Does not itself establish institutional legitimacy or social-capital mechanisms", [sources.structurationConstitution.id]), pathwayOption("institutional-theory", "supporting", "Institutionalised rules, legitimacy, formal structure, and organisational fields", "Organisations in a defined field", "Formal structures, field comparisons, pressure accounts, and practice evidence", "Adds legitimacy and possible decoupling where evidenced", "Do not infer isomorphism or decoupling from resemblance alone", [sources.institutionalMeyerRowan.id, sources.institutional.id]), pathwayOption("social-capital-theory", "not_recommended", "Relation-enabled resource access", "Specified actors, ties, or networks", "Requests, referrals, exchanges, resource mobilisation, and non-access cases", "Can support a separate relational-resource question", "Not primary where no relation-enabled resource mechanism is proposed", [sources.socialCapital.id])],
      entry_points: [pathwayEntry("theory", "structuration-theory", "Structuration Theory", "Primary editorial recommendation."), pathwayEntry("theory", "institutional-theory", "Institutional Theory", "Supporting route for legitimacy and formal structure."), pathwayEntry("concept", "rules-and-resources", "Rules and Resources", "Core structuration concept route.")],
      sources: [sources.structurationConstitution, sources.institutionalMeyerRowan, sources.institutional, sources.socialCapital], l1Claim: "The linked records verify the bounded structuration, institutional, and social-capital vocabularies cited on this topic page.", l1SourceId: sources.structurationConstitution.id,
    }) },
    status: "published",
    publishedAt,
  },
  {
    slug: "inequality-in-educational-and-social-fields",
    questionEn: "How do resources, dispositions, and field positions shape inequality?",
    content: { en: pathwayContent({
      overview: "This page routes a field-and-capital inequality question to Bourdieu's Practice Theory while preserving Social Capital for a narrower relation-enabled resource mechanism and Communities of Practice for a different participation question.",
      core_questions: ["Which field positions, capitals, classifications, and forms of recognition are at issue?", "Is a relation-enabled resource-access mechanism separately evidenced?", "Is sustained participation, rather than field position, the process to explain?"],
      question_categories: [{ category: "Field and capital", description: "Use Bourdieu when habitus, capital, field position, and recognition form the proposed mechanism.", theory_slugs: ["practice-theory-bourdieu"] }, { category: "Relation-enabled access", description: "Use Social Capital for specified relations through which resources become accessible or mobilised.", theory_slugs: ["social-capital-theory"] }, { category: "Participation and learning", description: "Use CoP only where participation conditions, not field inequality, are central.", theory_slugs: ["communities-of-practice"] }],
      selection_path: [{ step: "Define the field", prompt: "What positions, stakes, capitals, and criteria of value are evidenced?", routing_rule: "Do not rename any setting a field without relational evidence." }, { step: "Separate access from value", prompt: "Is the mechanism resource access through ties or field-conditioned capital value and recognition?", routing_rule: "Keep Social Capital distinct from Bourdieu's wider relational account." }, { step: "Test the participation alternative", prompt: "Is sustained practice and membership the central process?", routing_rule: "Do not make CoP primary when field position and capital are the required evidence." }],
      theory_pathways: [pathwayOption("practice-theory-bourdieu", "primary", "Habitus, capital, field position, and symbolic recognition", "A relationally defined field and positions within it", "Capital conversion, classifications, trajectories, recognition, and countercases", "Directly organises the question's resources, dispositions, and field positions", "Requires defensible field and capital evidence; does not make social origin destiny", [sources.practice.id, sources.practiceCapital.id]), pathwayOption("social-capital-theory", "supporting", "Relation-enabled access to and mobilisation of resources", "Specified actors, ties, networks, or organisations", "Requests, referrals, exchanges, support, gatekeeping, and non-access cases", "Can specify a narrower resource-access mechanism", "Does not explain field-specific capital value or recognition by tie count alone", [sources.socialCapital.id]), pathwayOption("communities-of-practice", "not_recommended", "Learning through sustained participation in a shared practice", "A community of practice", "Participation episodes, observation, artefacts, and boundary evidence", "Useful for a different participation-and-learning question", "Not primary where field position, capital, and recognition are the proposed mechanisms", [sources.communitiesWenger.id])],
      entry_points: [pathwayEntry("theory", "practice-theory-bourdieu", "Practice Theory (Bourdieu)", "Primary editorial recommendation."), pathwayEntry("theory", "social-capital-theory", "Social Capital Theory", "Supporting resource-access route."), pathwayEntry("concept", "field", "Field", "Core relational concept route.")],
      sources: [sources.practice, sources.practiceCapital, sources.socialCapital, sources.communitiesWenger], l1Claim: "The linked records verify the bounded practice-theory, social-capital, and participation vocabularies cited on this topic page.", l1SourceId: sources.practice.id,
    }) },
    status: "published",
    publishedAt,
  },
];

const topicTheories: SeedTopicTheory[] = [
  {
    topicSlug: "teachers-professional-identity-during-reform",
    theorySlug: "teacher-identity-theory",
    suitability: "high",
    suitabilityNotesEn: "Teacher Identity Theory is suitable because the question asks how teachers interpret, narrate, and negotiate professional selves under changing work conditions.",
    recommendation: "primary",
    sourceUrls: [sources.teacherIdentity.url],
    evidenceNotesEn: "The cited Kelchtermans article anchors the page's account of professional self-understanding and vulnerability; the topic fit is an editorial research-design judgement based on that page content.",
  },
  {
    topicSlug: "teachers-professional-identity-during-reform",
    theorySlug: "teacher-professional-development-theory",
    suitability: "medium",
    suitabilityNotesEn: "Teacher Professional Development Theory can support a distinct question about learning, growth, or practice change during reform; it does not replace an identity lens when professional self-understanding is the explanatory object.",
    recommendation: "supporting",
    sourceUrls: [sources.teacherDevelopmentClarke.url],
    evidenceNotesEn: "The Clarke and Hollingsworth record supports a named professional-growth model. Its supporting role here is a bounded Syntag editorial judgement.",
  },
  {
    topicSlug: "teachers-professional-identity-during-reform",
    theorySlug: "teacher-life-history-research",
    suitability: "low",
    suitabilityNotesEn: "Teacher Life History Research can supply interpreted narrative material, but it is not recommended as the primary explanatory lens when the question is how professional identity is negotiated.",
    recommendation: "not_recommended",
    sourceUrls: [sources.lifeHistoryTeachers.url],
    evidenceNotesEn: "The Goodson record supports life-history inquiry in educational settings; the non-primary recommendation is a bounded Syntag editorial judgement.",
  },
  {
    topicSlug: "educational-transitions-over-time",
    theorySlug: "life-course-theory",
    suitability: "high",
    suitabilityNotesEn: "Life Course Theory is suitable because the question foregrounds transition timing, linked lives, institutions, and historically situated sequences.",
    recommendation: "primary",
    sourceUrls: [sources.lifeCourse.url],
    evidenceNotesEn: "The cited Elder article anchors the page's life-course framing; the topic fit is an editorial judgement constrained to transition-oriented research questions.",
  },
  {
    topicSlug: "educational-transitions-over-time",
    theorySlug: "teacher-life-history-research",
    suitability: "medium",
    suitabilityNotesEn: "Teacher Life History Research can support interpretation of narrated educational transitions, but it remains a research tradition complement rather than the primary explanatory pathway theory.",
    recommendation: "supporting",
    sourceUrls: [sources.lifeHistoryTeachers.url],
    evidenceNotesEn: "The Goodson record supports educational life-history inquiry; its supporting role is a bounded Syntag editorial judgement.",
  },
  {
    topicSlug: "educational-transitions-over-time",
    theorySlug: "multiple-streams-framework",
    suitability: "low",
    suitabilityNotesEn: "Multiple Streams Framework is not recommended as primary because the stated question is about transitions across time and relationships rather than agenda setting or policy choice.",
    recommendation: "not_recommended",
    sourceUrls: [sources.multipleStreamsKingdon.url],
    evidenceNotesEn: "The Kingdon publisher record anchors agenda-setting vocabulary; the non-primary recommendation is a bounded Syntag editorial judgement.",
  },
  {
    topicSlug: "organizational-routines-and-structural-change",
    theorySlug: "structuration-theory",
    suitability: "high",
    suitabilityNotesEn: "Structuration Theory is suitable because the question asks how everyday routines draw on, reproduce, or alter rules and resources.",
    recommendation: "primary",
    sourceUrls: [sources.structurationConstitution.url],
    evidenceNotesEn: "The cited Giddens book anchors the page's structuration vocabulary; the topic fit is an editorial judgement for research on recursive practice and structure.",
  },
  {
    topicSlug: "organizational-routines-and-structural-change",
    theorySlug: "institutional-theory",
    suitability: "medium",
    suitabilityNotesEn: "Institutional Theory can support a distinct question about legitimacy, formal structure, decoupling, or field pressure, but it does not replace a recursive practice mechanism without those conditions.",
    recommendation: "supporting",
    sourceUrls: [sources.institutionalMeyerRowan.url],
    evidenceNotesEn: "The Meyer and Rowan DOI supports institutionalised formal-structure vocabulary; the supporting role is a bounded Syntag editorial judgement.",
  },
  {
    topicSlug: "organizational-routines-and-structural-change",
    theorySlug: "social-capital-theory",
    suitability: "low",
    suitabilityNotesEn: "Social Capital Theory is not recommended as primary where the question does not specify relation-enabled access to or mobilisation of a resource.",
    recommendation: "not_recommended",
    sourceUrls: [sources.socialCapital.url],
    evidenceNotesEn: "The Coleman DOI supports a social-structure and action vocabulary; the non-primary recommendation is a bounded Syntag editorial judgement.",
  },
  {
    topicSlug: "inequality-in-educational-and-social-fields",
    theorySlug: "practice-theory-bourdieu",
    suitability: "high",
    suitabilityNotesEn: "Bourdieu's practice theory is suitable because the question requires analysis of habitus, capital, field positions, and symbolic recognition.",
    recommendation: "primary",
    sourceUrls: [sources.practice.url],
    evidenceNotesEn: "The cited Bourdieu book anchors the page's account of habitus, capital, and field; the topic fit is an editorial judgement for inequality questions involving field relations.",
  },
  {
    topicSlug: "inequality-in-educational-and-social-fields",
    theorySlug: "social-capital-theory",
    suitability: "medium",
    suitabilityNotesEn: "Social Capital Theory can support a narrower question about relation-enabled access to resources, but it does not replace analysis of field position, capital value, and recognition.",
    recommendation: "supporting",
    sourceUrls: [sources.socialCapital.url],
    evidenceNotesEn: "The Coleman DOI supports a relation-and-resource vocabulary; the supporting role is a bounded Syntag editorial judgement.",
  },
  {
    topicSlug: "inequality-in-educational-and-social-fields",
    theorySlug: "communities-of-practice",
    suitability: "low",
    suitabilityNotesEn: "Communities of Practice is not recommended as primary where the required explanation is field position, capital, and recognition rather than sustained participation in a shared practice.",
    recommendation: "not_recommended",
    sourceUrls: [sources.communitiesWenger.url],
    evidenceNotesEn: "The Wenger publisher record supports social participation and practice vocabulary; the non-primary recommendation is a bounded Syntag editorial judgement.",
  },
];

function workCandidate(draft: Omit<SeedWork, "content" | "status" | "publishedAt"> & { source: ContentSource; overview: string; coreQuestion: string; centralArgument: string; contribution: string; readingFocus: string[] }): SeedWork {
  return {
    slug: draft.slug, title: draft.title, authors: draft.authors, year: draft.year, publisher: draft.publisher, doi: draft.doi,
    status: "published", publishedAt,
    content: { en: {
      overview: draft.overview,
      core_question: draft.coreQuestion,
      central_argument: draft.centralArgument,
      theoretical_contribution: draft.contribution,
      reading_focus: draft.readingFocus,
      legal_access: [{ label: "Open the authoritative bibliographic record", guidance: "Use the linked publisher, DOI, university, journal, library, or institutional record to locate lawful access through a library or the rights holder.", source_id: draft.source.id }],
      sources: [draft.source],
      verification: [{ claim: "The linked record verifies this work's bibliographic details and lawful access route.", evidence_level: "L1", source_id: draft.source.id, status: "verified" }, { claim: "The central argument, theoretical contribution, relationship, and reading emphasis are bounded Syntag editorial syntheses, not quotations or claims of universal consensus.", evidence_level: "L2", status: "editorial" }, { claim: "Reading priorities should be adapted to the research question, prior knowledge, access, and disciplinary guidance.", evidence_level: "L3", status: "proposed" }],
    } },
  };
}

const works: SeedWork[] = [
  workCandidate({ slug: "elder-1998-life-course", title: "The Life Course as Developmental Theory", authors: [{ name: "Glen H. Elder Jr." }], year: 1998, publisher: "Child Development", doi: "10.1111/j.1467-8624.1998.tb06128.x", source: sources.lifeCourse, overview: "A life-course framing of development across time, social context, and biography.", coreQuestion: "How can development be understood across lives rather than at one age?", centralArgument: "Developmental pathways must be read in relation to time, social context, and biography rather than as isolated age-bound outcomes.", contribution: "Provides a primary orientation to life-course pathways, transitions, turning points, timing, and linked lives.", readingFocus: ["Identify the distinction between pathway, transition, and turning point.", "Note the limits on inferring causation from temporal order."] }),
  workCandidate({ slug: "beijaard-meijer-verloop-2004-identity", title: "Reconsidering Research on Teachers' Professional Identity", authors: [{ name: "Douwe Beijaard" }, { name: "Paulien C. Meijer" }, { name: "Nico Verloop" }], year: 2004, publisher: "Teaching and Teacher Education", source: sources.teacherIdentityBeijaard, overview: "A field review that differentiates strands of teacher professional-identity research.", coreQuestion: "What has teacher-identity research meant by professional identity?", centralArgument: "Teacher identity is approached through multiple conceptual strands rather than one fixed attribute.", contribution: "Supplies a field-review route for selecting and delimiting a teacher-identity lens.", readingFocus: ["Compare the conceptual strands before adopting an identity definition.", "Do not treat a review as evidence of one universal identity process."] }),
  workCandidate({ slug: "kelchtermans-2009-teacher-identity", title: "Who I Am in How I Teach Is the Message", authors: [{ name: "Geert Kelchtermans", role: "author" }], year: 2009, publisher: "Teachers and Teaching", doi: "10.1080/13540600902875332", source: sources.teacherIdentity, overview: "A professional self-understanding route into teacher identity.", coreQuestion: "How is teaching connected to a teacher's professional self-understanding?", centralArgument: "Teachers' interpretation of self and work is central to understanding how they teach.", contribution: "Provides a bounded source for teacher self-understanding within the wider identity field.", readingFocus: ["Separate professional self-understanding from a fixed personality trait.", "Use it as one identity lens, not as the whole field."] }),
  workCandidate({ slug: "struct-giddens-1984", title: "The Constitution of Society: Outline of the Theory of Structuration", authors: [{ name: "Anthony Giddens" }], year: 1984, publisher: "University of California Press", source: sources.structurationConstitution, overview: "The central integrated formulation of Structuration Theory.", coreQuestion: "How are social practices produced and reproduced?", centralArgument: "Recurrent practices draw on and reproduce or modify rules and resources through a duality of structure.", contribution: "Provides the core vocabulary of rules, resources, duality, power, and recursive practice.", readingFocus: ["Trace rules and resources in recurrent practices.", "Do not reduce the theory to a generic structure-agency balance."] }),
  workCandidate({ slug: "lave-wenger-1991-situated-learning", title: "Situated Learning: Legitimate Peripheral Participation", authors: [{ name: "Jean Lave" }, { name: "Etienne Wenger" }], year: 1991, publisher: "Cambridge University Press", doi: "10.1017/CBO9780511815355", source: sources.communities, overview: "A situated-learning account of newcomers' participation in practice.", coreQuestion: "How do newcomers learn through participation in a practice?", centralArgument: "Learning is examined through legitimate peripheral participation in situated social practice.", contribution: "Anchors legitimate peripheral participation and situated learning for Communities of Practice.", readingFocus: ["Examine access, legitimacy, and consequential participation.", "Do not assume a universal novice-to-expert progression."] }),
  workCandidate({ slug: "cop-wenger-1998", title: "Communities of Practice: Learning, Meaning, and Identity", authors: [{ name: "Etienne Wenger" }], year: 1998, publisher: "Cambridge University Press", source: sources.communitiesWenger, overview: "A social-participation formulation of learning, meaning, and identity.", coreQuestion: "How are learning, meaning, and identity organised through social participation?", centralArgument: "Practice, community, meaning, and identity are negotiated through participation rather than formal membership alone.", contribution: "Develops mutual engagement, joint enterprise, and shared repertoire.", readingFocus: ["Test whether sustained practice and participation are evidenced.", "Distinguish a community of practice from a named team or programme."] }),
  workCandidate({ slug: "bourdieu-1977-outline-practice", title: "Outline of a Theory of Practice", authors: [{ name: "Pierre Bourdieu" }], year: 1977, publisher: "Cambridge University Press", doi: "10.1017/CBO9780511812507", source: sources.practice, overview: "A foundational relational account of patterned practice.", coreQuestion: "How can patterned practice be understood without reducing it to rules or conscious calculation?", centralArgument: "Practice is shaped through socially formed dispositions and relations of power without mechanically determining every action.", contribution: "Anchors habitus, practice, and relational attention to structure and power.", readingFocus: ["Separate habitus from deterministic personality claims.", "Do not name any social setting a field without relational evidence."] }),
  workCandidate({ slug: "practice-capital-1986", title: "The Forms of Capital", authors: [{ name: "Pierre Bourdieu" }], year: 1986, publisher: "Handbook of Theory and Research for the Sociology of Education", source: sources.practiceCapital, overview: "A source for Bourdieu's account of capital forms, accumulation, and conversion.", coreQuestion: "How do economic, cultural, social, and symbolic resources accumulate and convert?", centralArgument: "The value and conversion of resources are relational and field dependent.", contribution: "Supports capital conversion and the Bourdieu tradition of social capital without merging it with other traditions.", readingFocus: ["Specify which capital form and field-specific recognition are at issue.", "Keep Bourdieu's social-capital formulation distinct from Coleman or Lin."] }),
  workCandidate({ slug: "coleman-1988-social-capital", title: "Social Capital in the Creation of Human Capital", authors: [{ name: "James S. Coleman" }], year: 1988, publisher: "American Journal of Sociology", doi: "10.1086/228943", source: sources.socialCapital, overview: "A social-capital formulation concerned with relational structures and their possible resources or constraints.", coreQuestion: "How can social structure enter an account of action and human capital?", centralArgument: "Specified social relations can make resources and constraints relevant to action.", contribution: "Anchors the Coleman strand of Social Capital Theory.", readingFocus: ["Name the relation and resource rather than counting contacts.", "Do not treat obligation or trust as automatically beneficial."] }),
  workCandidate({ slug: "social-lin-2001", title: "Social Capital: A Theory of Social Structure and Action", authors: [{ name: "Nan Lin" }], year: 2001, publisher: "Cambridge University Press", doi: "10.1017/CBO9780511815447", source: sources.socialLin, overview: "A network and resource-access formulation of social capital.", coreQuestion: "How do social connections make resources accessible in action?", centralArgument: "Connections are analysed in relation to access and mobilisation of resources, not as uniformly positive assets.", contribution: "Anchors the Lin strand of Social Capital Theory.", readingFocus: ["Distinguish access, mobilisation, and outcome.", "Document non-access and unequal resource quality as well as ties."] }),
  workCandidate({ slug: "day-1999-developing-teachers", title: "Developing Teachers: The Challenges of Lifelong Learning", authors: [{ name: "Christopher Day" }], year: 1999, publisher: "Falmer Press", source: sources.teacherDevelopment, overview: "A lifelong-learning orientation for teacher development.", coreQuestion: "How can teachers' development be understood across working lives?", centralArgument: "Teacher development must be considered in relation to continuing learning and professional work.", contribution: "Provides an L1 anchor for the plural Teacher Professional Development entry.", readingFocus: ["Treat the work as one source within a plural field.", "Do not call it the founding text of a single closed theory."] }),
  workCandidate({ slug: "teacher-development-clarke-hollingsworth-2002", title: "Elaborating a Model of Teacher Professional Growth", authors: [{ name: "David Clarke" }, { name: "Hilary Hollingsworth" }], year: 2002, publisher: "Teaching and Teacher Education", doi: "10.1016/S0742-051X(02)00053-7", source: sources.teacherDevelopmentClarke, overview: "A named non-linear model of teacher professional growth.", coreQuestion: "How can teacher growth be conceptualised across connected domains?", centralArgument: "Professional growth can involve non-linear change across connected external, personal, practice, and outcome domains.", contribution: "Supplies the Interconnected Model of Professional Growth as one specified model.", readingFocus: ["Name the model rather than generalising all development from it.", "Look for mediating processes and counterexamples."] }),
  workCandidate({ slug: "goodson-2013-narrative-theory", title: "Developing Narrative Theory: Life Histories and Personal Representation", authors: [{ name: "Ivor F. Goodson" }], year: 2013, publisher: "Routledge", source: sources.lifeHistory, overview: "A narrative and life-history research orientation.", coreQuestion: "How are life histories and personal representation theorised in narrative inquiry?", centralArgument: "Narrated lives are interpreted representations situated in social and historical contexts.", contribution: "Anchors the narrative and life-history orientation of the Teacher Life History Research entry.", readingFocus: ["Treat accounts as interpreted and ethically mediated.", "Do not infer causal effects from narrative sequence alone."] }),
  workCandidate({ slug: "unesco-2020-inclusion-education", title: "Global Education Monitoring Report 2020: Inclusion and Education—All Means All", authors: [{ name: "UNESCO" }], year: 2020, publisher: "UNESCO", source: sources.equity, overview: "An authoritative institutional reference for education inclusion and equity context.", coreQuestion: "What institutional evidence and policy framing concern inclusion and education?", centralArgument: "Educational inclusion and equity require attention to institutional conditions and exclusions.", contribution: "Provides context for the Educational Equity entry, not a single equity theory.", readingFocus: ["Keep the report type and institutional context visible.", "Do not treat it as one universal equity metric or canonical theory."] }),
  workCandidate({ slug: "equity-sen-1992", title: "Inequality Reexamined", authors: [{ name: "Amartya Sen" }], year: 1992, publisher: "Harvard University Press", source: sources.equitySen, overview: "A normative capability and equality resource for making an equity basis explicit.", coreQuestion: "How should inequality be assessed?", centralArgument: "An account of inequality requires explicit normative criteria rather than an unexamined single metric.", contribution: "Provides one normative route for Educational Equity inquiry.", readingFocus: ["State the normative basis adopted for the research question.", "Do not recast this work as an education-specific causal theory or sole equity definition."] }),
  workCandidate({ slug: "dimaggio-powell-1983-iron-cage", title: "The Iron Cage Revisited: Institutional Isomorphism and Collective Rationality in Organizational Fields", authors: [{ name: "Paul J. DiMaggio" }, { name: "Walter W. Powell" }], year: 1983, publisher: "American Sociological Review", source: sources.institutional, overview: "A central organisational neo-institutionalist account of fields and isomorphism.", coreQuestion: "Why do organisations in a field become similar?", centralArgument: "Organisational similarity must be explained through specified institutional mechanisms and field relations.", contribution: "Anchors organisational fields and institutional isomorphism.", readingFocus: ["Identify the mechanism before inferring isomorphism.", "Do not treat resemblance alone as evidence of coercion, imitation, or normativity."] }),
  workCandidate({ slug: "institutional-meyer-rowan-1977", title: "Institutionalized Organizations: Formal Structure as Myth and Ceremony", authors: [{ name: "John W. Meyer" }, { name: "Brian Rowan" }], year: 1977, publisher: "American Journal of Sociology", doi: "10.1086/226550", source: sources.institutionalMeyerRowan, overview: "An organisational neo-institutionalist route to formal structure, legitimacy, and decoupling.", coreQuestion: "How can formal structures relate to institutionalised rules and legitimacy?", centralArgument: "Formal arrangements can be institutionally significant without being identical to ongoing activity.", contribution: "Provides a source for formal structure and possible decoupling.", readingFocus: ["Distinguish formal adoption from enacted practice.", "Do not label any document-practice gap decoupling without evidence."] }),
  workCandidate({ slug: "lipsky-2010-street-level-bureaucracy", title: "Street-Level Bureaucracy: Dilemmas of the Individual in Public Services", authors: [{ name: "Michael Lipsky" }], year: 2010, publisher: "Russell Sage Foundation", source: sources.streetLevel, overview: "A frontline implementation perspective on discretion and constraint.", coreQuestion: "How are public policies enacted under frontline constraints?", centralArgument: "Case-level implementation is shaped by discretion, client interaction, resources, demands, and organisational conditions.", contribution: "Anchors Street-Level Bureaucracy's account of delivered policy.", readingFocus: ["Establish public-service implementation and consequential discretion.", "Do not treat discretion as automatically good, bad, or unconstrained."] }),
  workCandidate({ slug: "kingdon-1995-agendas-alternatives", title: "Agendas, Alternatives, and Public Policies", authors: [{ name: "John W. Kingdon" }], year: 1995, publisher: "HarperCollinsCollege", source: sources.multipleStreams, overview: "A classic agenda-setting orientation for the Multiple Streams Framework.", coreQuestion: "How do problems, policies, politics, opportunities, and actors shape agenda change?", centralArgument: "Agenda change requires analysis of distinct streams, timing, actors, and coupling rather than a post-hoc three-factor story.", contribution: "Anchors the Multiple Streams Framework's agenda-setting vocabulary.", readingFocus: ["Trace the separate development of streams and a claimed coupling event.", "Keep the work's agenda-setting scope distinct from implementation."] }),
];

function conceptCandidate(draft: { slug: string; termEn: string; definition: string; source: ContentSource; theorySlug: string; meaning: string; observable: string; misuse: string; workSlug: string; workTitle: string; scholar: { name: string; scholarSlug?: string; relevance: string }; additionalSources?: ContentSource[]; variations?: ConceptContent["theory_variations"]; additionalWorks?: ConceptContent["related_works"] }): SeedConcept {
  return {
    slug: draft.slug, termEn: draft.termEn, definitionEn: draft.definition,
    status: "published", publishedAt,
    content: { en: {
      overview: draft.definition,
      theory_variations: draft.variations ?? [{ theory_slug: draft.theorySlug, relationship: "Core concept source", meaning: draft.meaning, source_ids: [draft.source.id] }],
      observable_manifestations: [draft.observable],
      misuse_risks: [draft.misuse],
      related_works: [{ work_slug: draft.workSlug, title: draft.workTitle, relationship: "Core source work", relevance: "A reviewed source record used to delimit this concept." }, ...(draft.additionalWorks ?? [])],
      related_scholars: [{ name: draft.scholar.name, scholar_slug: draft.scholar.scholarSlug, relevance: draft.scholar.relevance }],
      sources: [draft.source, ...(draft.additionalSources ?? [])],
      verification: [{ claim: "The linked record provides the source-specific vocabulary and bibliographic anchor for this concept page.", evidence_level: "L1", source_id: draft.source.id, status: "verified" }, { claim: "The definition, cross-theory distinction, related-entity explanation, and misuse warning are Syntag editorial synthesis, not a quotation or universal consensus.", evidence_level: "L2", status: "editorial" }, { claim: "Observable research manifestations are study-dependent options, not a measurement recipe or automatic inference.", evidence_level: "L3", status: "proposed" }],
    } },
  };
}

const concepts: SeedConcept[] = [
  conceptCandidate({ slug: "trajectory", termEn: "Trajectory", definition: "A longer-term pathway through roles, statuses, or domains, distinct from one bounded event.", source: sources.lifeCourse, theorySlug: "life-course-theory", meaning: "In Life Course Theory, trajectory is an analytic temporal pattern; it differs from a life history, which foregrounds interpreted narration.", observable: "Dated role or status sequences, durations, and contextual records may be examined.", misuse: "Treating any chronological list as a trajectory or inferring causation from order alone.", workSlug: "elder-1998-life-course", workTitle: "The Life Course as Developmental Theory", scholar: { name: "Glen H. Elder Jr.", scholarSlug: "glen-h-elder-jr", relevance: "Associated life-course contributor." } }),
  conceptCandidate({ slug: "transition", termEn: "Transition", definition: "A bounded change in role, status, or setting whose timing and sequence can matter for a pathway.", source: sources.lifeCourse, theorySlug: "life-course-theory", meaning: "A transition need not redirect a later trajectory; it differs from a turning point.", observable: "Entry and exit dates, role changes, and accounts of conditions may be compared.", misuse: "Calling every reported event a turning point.", workSlug: "elder-1998-life-course", workTitle: "The Life Course as Developmental Theory", scholar: { name: "Glen H. Elder Jr.", scholarSlug: "glen-h-elder-jr", relevance: "Associated life-course contributor." } }),
  conceptCandidate({ slug: "turning-point", termEn: "Turning Point", definition: "A transition supported by evidence as redirecting a later pathway or its meaning.", source: sources.lifeCourse, theorySlug: "life-course-theory", meaning: "It concerns biographical redirection and differs from a Multiple Streams policy window, which concerns agenda opportunity.", observable: "Before-and-after sequences, contemporaneous records, and accounts of changed alternatives may be compared.", misuse: "Inferring redirection only because an event was memorable.", workSlug: "elder-1998-life-course", workTitle: "The Life Course as Developmental Theory", scholar: { name: "Glen H. Elder Jr.", scholarSlug: "glen-h-elder-jr", relevance: "Associated life-course contributor." } }),
  conceptCandidate({ slug: "teacher-professional-identity", termEn: "Teacher Professional Identity", definition: "Teachers' negotiated understanding of who they are and may become in relation to professional work, contexts, and others.", source: sources.teacherIdentityBeijaard, theorySlug: "teacher-identity-theory", meaning: "It is an analytic account of professional self-relation, not a fixed trait or Bourdieu's habitus.", observable: "Self-descriptions, role claims, dilemmas, interactional positioning, and role-expectation documents may be analysed.", misuse: "Coding any attitude, demographic category, or stable personality trait as identity.", workSlug: "beijaard-meijer-verloop-2004-identity", workTitle: "Reconsidering Research on Teachers' Professional Identity", scholar: { name: "Geert Kelchtermans", scholarSlug: "geert-kelchtermans", relevance: "Existing scholar page provides a related self-understanding lens." } }),
  conceptCandidate({ slug: "teacher-self-understanding", termEn: "Teacher Self-Understanding", definition: "The reflective and interpretive dimension through which a teacher makes sense of teaching self and work.", source: sources.teacherIdentity, theorySlug: "teacher-identity-theory", meaning: "It can be studied through life-history narratives but does not make narration a transparent factual record.", observable: "Narrative accounts, reflective writing, and accounts of recognition or vulnerability may be analysed.", misuse: "Treating one interview answer as a complete or unchanging identity.", workSlug: "kelchtermans-2009-teacher-identity", workTitle: "Who I Am in How I Teach Is the Message", scholar: { name: "Geert Kelchtermans", scholarSlug: "geert-kelchtermans", relevance: "Source author and existing scholar page." } }),
  conceptCandidate({ slug: "duality-of-structure", termEn: "Duality of Structure", definition: "Structures are understood as both the medium and outcome of recurrent social practice.", source: sources.structurationConstitution, theorySlug: "structuration-theory", meaning: "It differs from treating structure and agency as two independent variables or analytically separated stages.", observable: "Episodes where actors draw on, reproduce, modify, or contest arrangements may be examined.", misuse: "Making a generic claim that structure and agency interact without identified practice.", workSlug: "struct-giddens-1984", workTitle: "The Constitution of Society", scholar: { name: "Anthony Giddens", scholarSlug: "anthony-giddens", relevance: "Source author and existing scholar page." } }),
  conceptCandidate({ slug: "rules-and-resources", termEn: "Rules and Resources", definition: "Interpretive and material means drawn on in the conduct and organisation of practice.", source: sources.structurationConstitution, theorySlug: "structuration-theory", meaning: "A rule or resource used in practice is not itself evidence of field-level institutional conformity.", observable: "Procedures, artefacts, allocations, and accounts of invocation or bypass may be examined.", misuse: "Reading a formal rule as proof of enactment.", workSlug: "struct-giddens-1984", workTitle: "The Constitution of Society", scholar: { name: "Anthony Giddens", scholarSlug: "anthony-giddens", relevance: "Source author and existing scholar page." } }),
  conceptCandidate({ slug: "recursive-practice", termEn: "Recursive Practice", definition: "Recurrent action through which social arrangements are sustained or altered over time.", source: sources.structurationConstitution, theorySlug: "structuration-theory", meaning: "It differs from Bourdieu's practical logic because its vocabulary centres recursive rules and resources.", observable: "Repeated routines, deviations, repairs, and changed coordination may be compared.", misuse: "Calling any repetition reproduction without comparing conditions and consequences.", workSlug: "struct-giddens-1984", workTitle: "The Constitution of Society", scholar: { name: "Anthony Giddens", scholarSlug: "anthony-giddens", relevance: "Source author and existing scholar page." } }),
  conceptCandidate({ slug: "legitimate-peripheral-participation", termEn: "Legitimate Peripheral Participation", definition: "A situated-learning account of newcomers' participation and access in a practice.", source: sources.communities, theorySlug: "communities-of-practice", meaning: "It differs from generic onboarding because legitimacy, participation, and consequential practice must be evidenced.", observable: "Task access, mentoring, recognition, artefact use, and exclusion episodes may be examined.", misuse: "Assuming a linear movement from peripheral to full participation.", workSlug: "lave-wenger-1991-situated-learning", workTitle: "Situated Learning", scholar: { name: "Etienne Wenger", relevance: "Source coauthor; no scholar profile is claimed in this phase." } }),
  conceptCandidate({ slug: "mutual-engagement", termEn: "Mutual Engagement", definition: "Sustained engagement among participants around a shared practice, not mere co-location or formal membership.", source: sources.communitiesWenger, theorySlug: "communities-of-practice", meaning: "It may matter for learning and competence without making relation-enabled resource access the primary mechanism.", observable: "Recurring interaction, jointly handled problems, and mutual recognition may be examined.", misuse: "Labelling all teams or networks a community of practice.", workSlug: "cop-wenger-1998", workTitle: "Communities of Practice", scholar: { name: "Etienne Wenger", relevance: "Source author; no scholar profile is claimed in this phase." } }),
  conceptCandidate({ slug: "shared-repertoire", termEn: "Shared Repertoire", definition: "Shared routines, language, stories, tools, and resources through which a practice is recognised and negotiated.", source: sources.communitiesWenger, theorySlug: "communities-of-practice", meaning: "It is analysed as a participation and meaning resource, not simply as a formal organisational rule or handbook.", observable: "Recurring terms, artefacts, routines, and contested meanings may be examined.", misuse: "Treating a written handbook as evidence that participants share a repertoire.", workSlug: "cop-wenger-1998", workTitle: "Communities of Practice", scholar: { name: "Etienne Wenger", relevance: "Source author; no scholar profile is claimed in this phase." } }),
  conceptCandidate({ slug: "habitus", termEn: "Habitus", definition: "Durable, socially shaped dispositions that orient perception, judgment, and practical action.", source: sources.practice, theorySlug: "practice-theory-bourdieu", meaning: "It differs from teacher self-understanding and from an immutable personality trait.", observable: "Patterned practical judgments, biography-linked accounts, and counter-cases may be examined.", misuse: "Treating habitus as destiny or inferring it from class labels alone.", workSlug: "bourdieu-1977-outline-practice", workTitle: "Outline of a Theory of Practice", scholar: { name: "Pierre Bourdieu", scholarSlug: "pierre-bourdieu", relevance: "Source author and existing scholar page." } }),
  conceptCandidate({ slug: "field", termEn: "Field", definition: "A structured arena of positions, stakes, struggles, and forms of recognition.", source: sources.practice, theorySlug: "practice-theory-bourdieu", meaning: "It differs from an institution because not every organisation, sector, or interview setting constitutes a field.", observable: "Position relations, valued resources, classification disputes, and entry or exit mechanisms may be examined.", misuse: "Renaming any context a field without showing relations and stakes.", workSlug: "bourdieu-1977-outline-practice", workTitle: "Outline of a Theory of Practice", scholar: { name: "Pierre Bourdieu", scholarSlug: "pierre-bourdieu", relevance: "Source author and existing scholar page." } }),
  conceptCandidate({ slug: "capital-conversion", termEn: "Capital Conversion", definition: "The context-dependent relation through which resources can be accumulated, recognised, or converted.", source: sources.practiceCapital, theorySlug: "practice-theory-bourdieu", meaning: "In Bourdieu's approach, conversion depends on recognition and field relations rather than resource possession alone.", observable: "Credential use, referrals, recognition decisions, exchanges, and failed conversions may be examined.", misuse: "Assuming that possession of a resource has value in every field.", workSlug: "practice-capital-1986", workTitle: "The Forms of Capital", scholar: { name: "Pierre Bourdieu", scholarSlug: "pierre-bourdieu", relevance: "Source author and existing scholar page." } }),
  conceptCandidate({ slug: "symbolic-power", termEn: "Symbolic Power", definition: "Power exercised through socially recognised classifications, legitimacy, and meanings rather than only direct coercion.", source: sources.practiceSymbolic, theorySlug: "practice-theory-bourdieu", meaning: "It differs from organisational legitimacy by analysing classification and domination rather than organisational appropriateness alone.", observable: "Naming practices, credential valuation, routine deference, and contested authority may be examined.", misuse: "Calling any persuasive language symbolic power without a social recognition relation.", workSlug: "bourdieu-1977-outline-practice", workTitle: "Outline of a Theory of Practice", scholar: { name: "Pierre Bourdieu", scholarSlug: "pierre-bourdieu", relevance: "Related Practice Theory scholar." } }),
  conceptCandidate({ slug: "relational-resource-access", termEn: "Relational Resource Access", definition: "Access to information, support, influence, or opportunities made possible through specified social relations.", source: sources.socialLin, theorySlug: "social-capital-theory", meaning: "Within Social Capital Theory, Coleman treats obligations and relational structure as conditions for action, while Lin centres access to and mobilisation of resources; neither formulation makes every tie beneficial.", observable: "Concrete requests, referrals, information flows, support episodes, and non-access cases may be examined.", misuse: "Counting contacts as proof of resources or benefit.", workSlug: "social-lin-2001", workTitle: "Social Capital", scholar: { name: "Nan Lin", relevance: "Source author; no scholar profile is claimed in this phase." }, additionalSources: [sources.socialCapital, sources.practiceCapital], variations: [{ theory_slug: "social-capital-theory", relationship: "Coleman and Lin formulations", meaning: "Coleman treats obligations and relational structure as conditions for action, while Lin centres access to and mobilisation of resources; neither formulation makes every tie beneficial.", source_ids: [sources.socialCapital.id, sources.socialLin.id] }, { theory_slug: "practice-theory-bourdieu", relationship: "Bourdieu tradition", meaning: "Bourdieu treats social capital as a capital form whose value and conversion depend on group membership, field position, other capitals, and recognition rather than access alone.", source_ids: [sources.practiceCapital.id] }], additionalWorks: [{ work_slug: "coleman-1988-social-capital", title: "Social Capital in the Creation of Human Capital", relationship: "Coleman formulation", relevance: "Supplies the relational-structure and obligation formulation distinguished on this page." }, { work_slug: "practice-capital-1986", title: "The Forms of Capital", relationship: "Bourdieu tradition source", relevance: "Supplies the field- and conversion-dependent Bourdieu formulation distinguished on this page." }] }),
  conceptCandidate({ slug: "obligation-and-reciprocity", termEn: "Obligation and Reciprocity", definition: "Expectations of exchange, return, or claim-making that may organise relation-enabled action in a stated social-capital formulation.", source: sources.socialCapital, theorySlug: "social-capital-theory", meaning: "It is not a universally beneficial trust variable: obligations can impose costs and exclusions.", observable: "Requests, refusals, reciprocal transfers, sanctions, and reported burdens may be examined.", misuse: "Assuming reciprocity is equal, voluntary, or positive in all ties.", workSlug: "coleman-1988-social-capital", workTitle: "Social Capital in the Creation of Human Capital", scholar: { name: "James S. Coleman", relevance: "Source author; no scholar profile is claimed in this phase." } }),
  conceptCandidate({ slug: "professional-learning", termEn: "Professional Learning", definition: "Ongoing learning related to teachers' knowledge, practice, roles, and working conditions.", source: sources.teacherDevelopmentClarke, theorySlug: "teacher-professional-development-theory", meaning: "It differs from Communities of Practice because learning may be organised through multiple models and contexts, not only participation in a community of practice.", observable: "Learning opportunities, changed practices, mediating conditions, and counterexamples may be examined.", misuse: "Treating attendance, satisfaction, or one workshop as evidence of development or learner outcomes.", workSlug: "teacher-development-clarke-hollingsworth-2002", workTitle: "Elaborating a Model of Teacher Professional Growth", scholar: { name: "Christopher Day", relevance: "Related source author in the Teacher Professional Development entry." }, additionalWorks: [{ work_slug: "day-1999-developing-teachers", title: "Developing Teachers: The Challenges of Lifelong Learning", relationship: "Lifelong-learning source", relevance: "Provides the related lifelong-learning orientation within this plural field." }] }),
  conceptCandidate({ slug: "life-history", termEn: "Life History", definition: "An interpretive inquiry into narrated lives in social and historical context.", source: sources.lifeHistory, theorySlug: "teacher-life-history-research", meaning: "It differs from a life-course trajectory by foregrounding personal representation and interpretation rather than supplying an explanatory pathway theory.", observable: "Narrated biography, contextual documents, and reflexive notes may be considered with ethics safeguards.", misuse: "Treating personal narrative as an unmediated factual chronology or population estimate.", workSlug: "goodson-2013-narrative-theory", workTitle: "Developing Narrative Theory", scholar: { name: "Ivor F. Goodson", relevance: "Source author; no scholar profile is claimed in this phase." } }),
  conceptCandidate({ slug: "educational-equity", termEn: "Educational Equity", definition: "An explicit normative and empirical inquiry into avoidable inequalities in educational access, participation, treatment, resources, recognition, or outcomes.", source: sources.equity, theorySlug: "educational-equity-theory", meaning: "It differs from social capital and Bourdieu because those can explain unequal access or advantage but do not themselves state the equity standard.", observable: "Population or comparator definitions, access records, allocation rules, accounts, and outcome distributions may be examined.", misuse: "Using equity as a slogan without a stated dimension, comparison, normative basis, and mechanism.", workSlug: "unesco-2020-inclusion-education", workTitle: "Global Education Monitoring Report 2020", scholar: { name: "UNESCO", relevance: "Institutional author of the source record." }, additionalWorks: [{ work_slug: "equity-sen-1992", title: "Inequality Reexamined", relationship: "Normative resource", relevance: "Offers one explicit capability and equality route without becoming the sole equity definition." }] }),
  conceptCandidate({ slug: "institutional-isomorphism", termEn: "Institutional Isomorphism", definition: "Processes through which organisations in a field become more similar under specified institutional pressures.", source: sources.institutional, theorySlug: "institutional-theory", meaning: "It differs from Structuration's recursive practice because it concerns field-level patterned similarity and mechanism, not every routine.", observable: "Cross-organisation comparisons, standards, pressure accounts, and adoption timing may be examined.", misuse: "Inferring coercive, mimetic, or normative pressure solely from similarity.", workSlug: "dimaggio-powell-1983-iron-cage", workTitle: "The Iron Cage Revisited", scholar: { name: "Paul J. DiMaggio", relevance: "Source author; no scholar profile is claimed in this phase." } }),
  conceptCandidate({ slug: "decoupling", termEn: "Decoupling", definition: "A possible separation between formal structures and ongoing activity in an organisational neo-institutionalist account.", source: sources.institutionalMeyerRowan, theorySlug: "institutional-theory", meaning: "It differs from non-compliance because a document-practice difference alone does not establish the organisational relation or its function.", observable: "Formal policies, observed practices, implementation records, and multiple-position accounts may be compared.", misuse: "Treating any gap or implementation difficulty as decoupling.", workSlug: "institutional-meyer-rowan-1977", workTitle: "Institutionalized Organizations", scholar: { name: "John W. Meyer", relevance: "Source author; no scholar profile is claimed in this phase." } }),
  conceptCandidate({ slug: "frontline-discretion", termEn: "Frontline Discretion", definition: "Situated judgement exercised by frontline public-service workers while applying policy to cases under organisational conditions.", source: sources.streetLevel, theorySlug: "street-level-bureaucracy", meaning: "It differs from general worker autonomy and from Multiple Streams agenda change.", observable: "Case-processing choices, rule interpretation, workload conditions, coping episodes, and client interaction may be examined.", misuse: "Treating discretion as misconduct, benevolence, or unconstrained personal choice without the service setting.", workSlug: "lipsky-2010-street-level-bureaucracy", workTitle: "Street-Level Bureaucracy", scholar: { name: "Michael Lipsky", relevance: "Source author; no scholar profile is claimed in this phase." } }),
  conceptCandidate({ slug: "streams-coupling-policy-window", termEn: "Streams, Coupling, and Policy Window", definition: "A linked MSF vocabulary in which problem, policy, and political processes remain analytically distinct while a temporary window can enable coupling.", source: sources.multipleStreams, theorySlug: "multiple-streams-framework", meaning: "It differs from a life-course turning point because it concerns policy agenda opportunity and actor strategy, not individual pathways.", observable: "Dated indicators, proposals, political events, actor accounts, and evidence of claimed coupling may be examined.", misuse: "Assigning streams retrospectively after an outcome or using MSF as an implementation theory.", workSlug: "kingdon-1995-agendas-alternatives", workTitle: "Agendas, Alternatives, and Public Policies", scholar: { name: "John W. Kingdon", relevance: "Source author; no scholar profile is claimed in this phase." } }),
];

const theoryWorks: SeedTheoryWork[] = [
  ["life-course-theory", "elder-1998-life-course", "founding_text"], ["teacher-identity-theory", "beijaard-meijer-verloop-2004-identity", "synthesis"], ["teacher-identity-theory", "kelchtermans-2009-teacher-identity", "major_development"], ["structuration-theory", "struct-giddens-1984", "founding_text"], ["communities-of-practice", "lave-wenger-1991-situated-learning", "founding_text"], ["communities-of-practice", "cop-wenger-1998", "core_work"], ["teacher-identity-theory", "cop-wenger-1998", "adjacent_theory_source"], ["practice-theory-bourdieu", "bourdieu-1977-outline-practice", "founding_text"], ["practice-theory-bourdieu", "practice-capital-1986", "core_concept_source"], ["social-capital-theory", "coleman-1988-social-capital", "founding_text"], ["social-capital-theory", "social-lin-2001", "major_development"], ["social-capital-theory", "practice-capital-1986", "tradition_source"], ["teacher-professional-development-theory", "day-1999-developing-teachers", "major_development"], ["teacher-professional-development-theory", "teacher-development-clarke-hollingsworth-2002", "major_development"], ["teacher-life-history-research", "goodson-2013-narrative-theory", "major_development"], ["educational-equity-theory", "unesco-2020-inclusion-education", "institutional_context_source"], ["educational-equity-theory", "equity-sen-1992", "normative_resource"], ["institutional-theory", "dimaggio-powell-1983-iron-cage", "founding_text"], ["institutional-theory", "institutional-meyer-rowan-1977", "major_development"], ["street-level-bureaucracy", "lipsky-2010-street-level-bureaucracy", "founding_text"], ["multiple-streams-framework", "kingdon-1995-agendas-alternatives", "founding_text"]
].map(([theorySlug, workSlug, relationship]) => {
  const work = works.find((entry) => entry.slug === workSlug)!;
  return { theorySlug, workSlug, relationship: relationship as SeedTheoryWork["relationship"], sourceUrls: work.content.en.sources.map((source) => source.url), evidenceNotesEn: "This reviewed relation is limited to the work's source-backed contribution and is not a claim that the work exhausts the theory." };
});

const theoryConcepts: SeedTheoryConcept[] = concepts.flatMap((concept) => concept.content.en.theory_variations.map((variation) => ({ theorySlug: variation.theory_slug, conceptSlug: concept.slug, importance: "core" })));

const verifications: SeedVerification[] = theories.flatMap((entry) => {
  const pageSources = entry.content.en.sources ?? [];
  if (pageSources.length === 0) throw new Error(`${entry.slug} must have an L1 source`);
  return [
    { entitySlug: entry.slug, fieldPath: "content_jsonb.en.sources", level: "L1_verified" as const, sources: pageSources.map((source) => source.url), notes: "Traceable source records reviewed for the page's factual and bibliographic claims." },
    { entitySlug: entry.slug, fieldPath: "content_jsonb.en.fit_and_boundaries", level: "L2_editorial" as const, sources: [], notes: "Editorial explanation and theory-fit judgement." },
    { entitySlug: entry.slug, fieldPath: "content_jsonb.en.research_guidance", level: "L3_pending" as const, sources: [], notes: "Research-design guidance requiring study-specific and supervisor review." },
  ];
});

export const seedCorpus: SeedCorpus = {
  disciplines: disciplines.map((record) => ({ ...record, status: "published", publishedAt })),
  fields: fields.map((record) => ({ ...record, status: "published", publishedAt })),
  theories,
  works,
  concepts,
  theoryWorks,
  theoryConcepts,
  disciplineTheories,
  fieldTheories,
  genealogy,
  scholars: [...scholars, ...firstEnrichmentBatch.scholars],
  theoryScholars: [...theoryScholars, ...firstEnrichmentBatch.theoryScholars],
  topics: [...topics, ...firstEnrichmentBatch.topics],
  topicTheories: [...topicTheories, ...firstEnrichmentBatch.topicTheories],
  verifications,
};
