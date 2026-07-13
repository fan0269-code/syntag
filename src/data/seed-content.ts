import type {
  ContentSource,
  TheoryContent,
  TheoryDepth,
} from "./templates/theory-template.ts";

export interface SeedDiscipline {
  slug: string;
  titleEn: string;
  descriptionEn: string;
}

export interface SeedField {
  slug: string;
  titleEn: string;
  disciplineSlug: string;
}

export interface SeedTheory {
  slug: string;
  primary: boolean;
  depth: TheoryDepth;
  titleEn: string;
  summaryEn: string;
  content: { en: TheoryContent };
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

export interface SeedScholar {
  slug: string;
  name: string;
  bioEn: string;
  status: "published" | "draft";
  publishedAt: string;
}

export interface SeedTheoryScholar {
  theorySlug: string;
  scholarSlug: string;
  role: "founder" | "key_contributor" | "extender" | "critic" | "synthesizer";
  sourceUrls: string[];
  evidenceNotesEn: string;
}

export interface SeedTopic {
  slug: string;
  questionEn: string;
  status: "published" | "draft";
  publishedAt: string;
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

function theory(draft: TheoryDraft): SeedTheory {
  return {
    slug: draft.slug,
    primary: true,
    depth: draft.depth,
    titleEn: draft.titleEn,
    summaryEn: draft.summaryEn,
    content: { en: contentFor(draft) },
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
  teacherIdentity: {
    id: "kelchtermans-2009-teacher-identity",
    citation: "Kelchtermans, G. (2009). Who I am in how I teach is the message. Teachers and Teaching, 15(2), 257-272.",
    url: "https://doi.org/10.1080/13540600902875332",
    source_kind: "doi",
    evidence_level: "L1",
    supports: ["Bibliographic record", "Teacher self-understanding"],
  },
  structuration: {
    id: "giddens-1984-constitution",
    citation: "Giddens, A. (1984). The Constitution of Society: Outline of the Theory of Structuration. Polity Press.",
    url: "https://openlibrary.org/books/OL20781260M/The_constitution_of_society",
    source_kind: "library",
    evidence_level: "L1",
    supports: ["Bibliographic record", "Theory of structuration"],
  },
  communities: {
    id: "lave-wenger-1991-situated-learning",
    citation: "Lave, J., & Wenger, E. (1991). Situated Learning: Legitimate Peripheral Participation. Cambridge University Press.",
    url: "https://doi.org/10.1017/CBO9780511815355",
    source_kind: "doi",
    evidence_level: "L1",
    supports: ["Bibliographic record", "Legitimate peripheral participation"],
  },
  practice: {
    id: "bourdieu-1977-outline-practice",
    citation: "Bourdieu, P. (1977). Outline of a Theory of Practice. Cambridge University Press.",
    url: "https://doi.org/10.1017/CBO9780511812507",
    source_kind: "doi",
    evidence_level: "L1",
    supports: ["Bibliographic record", "Habitus, field, and practice"],
  },
  socialCapital: {
    id: "coleman-1988-social-capital",
    citation: "Coleman, J. S. (1988). Social capital in the creation of human capital. American Journal of Sociology, 94, S95-S120.",
    url: "https://doi.org/10.1086/228943",
    source_kind: "doi",
    evidence_level: "L1",
    supports: ["Bibliographic record", "Social capital"],
  },
  teacherDevelopment: {
    id: "day-1999-developing-teachers",
    citation: "Day, C. (1999). Developing Teachers: The Challenges of Lifelong Learning. Falmer Press.",
    url: "https://www.routledge.com/Developing-Teachers-The-Challenges-of-Lifelong-Learning/Day/p/book/9780750707480",
    source_kind: "publisher",
    evidence_level: "L1",
    supports: ["Publisher bibliographic record", "Teacher development"],
  },
  lifeHistory: {
    id: "goodson-2013-narrative-theory",
    citation: "Goodson, I. F. (2013). Developing Narrative Theory: Life Histories and Personal Representation. Routledge.",
    url: "https://www.routledge.com/Developing-Narrative-Theory-Life-Histories-and-Personal-Representation/Goodson/p/book/9780415603614",
    source_kind: "publisher",
    evidence_level: "L1",
    supports: ["Publisher bibliographic record", "Life-history research"],
  },
  equity: {
    id: "unesco-2020-inclusion-education",
    citation: "UNESCO. (2020). Global Education Monitoring Report 2020: Inclusion and Education—All Means All.",
    url: "https://unesdoc.unesco.org/ark:/48223/pf0000373718",
    source_kind: "authoritative_web",
    evidence_level: "L1",
    supports: ["Institutional report record", "Educational inclusion and equity context"],
  },
  institutional: {
    id: "dimaggio-powell-1983-iron-cage",
    citation: "DiMaggio, P. J., & Powell, W. W. (1983). The iron cage revisited. American Sociological Review, 48(2), 147-160.",
    url: "https://doi.org/10.2307/2095101",
    source_kind: "doi",
    evidence_level: "L1",
    supports: ["Bibliographic record", "Institutional isomorphism"],
  },
  streetLevel: {
    id: "lipsky-2010-street-level-bureaucracy",
    citation: "Lipsky, M. (2010). Street-Level Bureaucracy: Dilemmas of the Individual in Public Services (30th anniversary expanded ed.). Russell Sage Foundation.",
    url: "https://www.russellsage.org/publications/book/street-level-bureaucracy",
    source_kind: "publisher",
    evidence_level: "L1",
    supports: ["Publisher bibliographic record", "Street-level bureaucracy"],
  },
  multipleStreams: {
    id: "kingdon-2011-agendas-alternatives",
    citation: "Kingdon, J. W. (1995). Agendas, Alternatives, and Public Policies (2nd ed.). HarperCollinsCollege.",
    url: "https://openlibrary.org/books/OL24924045M/Agendas_alternatives_and_public_policies",
    source_kind: "library",
    evidence_level: "L1",
    supports: ["Library bibliographic record", "Multiple streams framework"],
  },
} as const satisfies Record<string, ContentSource>;

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
  }),
  theory({
    slug: "teacher-professional-development-theory", depth: "D1", titleEn: "Teacher Professional Development Theory",
    summaryEn: "Teacher Professional Development Theory provides a lens for studying teachers' continuing learning, changing practice, commitment, and career-related development.",
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
  }),
  theory({
    slug: "teacher-life-history-research", depth: "D1", titleEn: "Teacher Life History Research",
    summaryEn: "Teacher Life History Research uses biographical accounts to study how teachers' lives, work, memories, and social contexts shape professional meaning.",
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
  }),
  theory({
    slug: "educational-equity-theory", depth: "D1", titleEn: "Educational Equity Theory",
    summaryEn: "Educational Equity Theory is an editorial umbrella for examining unequal access, participation, recognition, resources, and outcomes in education.",
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
  }),
  theory({
    slug: "institutional-theory", depth: "D1", titleEn: "Institutional Theory",
    summaryEn: "Institutional Theory explains how organisational rules, norms, expectations, and legitimacy pressures shape practices and forms of similarity.",
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
  }),
  theory({
    slug: "street-level-bureaucracy", depth: "D1", titleEn: "Street-Level Bureaucracy",
    summaryEn: "Street-Level Bureaucracy examines how frontline public workers exercise discretion while implementing policy under resource, demand, and organisational constraints.",
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
  }),
  theory({
    slug: "multiple-streams-framework", depth: "D1", titleEn: "Multiple Streams Framework",
    summaryEn: "The Multiple Streams Framework explains agenda change through the temporary coupling of problem, policy, and political streams, often around policy windows.",
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
  }),
];

const disciplines: SeedDiscipline[] = [
  { slug: "education", titleEn: "Education", descriptionEn: "Research on learning, teaching, institutions, policy, and educational inequality." },
  { slug: "sociology", titleEn: "Sociology", descriptionEn: "Research on social relations, institutions, inequality, and patterned social practice." },
];

const fields: SeedField[] = [
  { slug: "teacher-education-professional-development", titleEn: "Teacher Education & Professional Development", disciplineSlug: "education" },
  { slug: "rural-remote-education", titleEn: "Rural & Remote Education", disciplineSlug: "education" },
  { slug: "educational-equity-policy", titleEn: "Educational Equity & Policy", disciplineSlug: "education" },
  { slug: "life-course-aging-studies", titleEn: "Life Course & Aging Studies", disciplineSlug: "sociology" },
  { slug: "sociology-of-education", titleEn: "Sociology of Education", disciplineSlug: "sociology" },
  { slug: "organizational-sociology", titleEn: "Organizational Sociology", disciplineSlug: "sociology" },
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
  { id: "life-course:teacher-life-history", sourceSlug: "life-course-theory", targetSlug: "teacher-life-history-research", relationType: "precursor_of", descriptionEn: "Life-course principles inform biographical analysis of teachers' professional lives.", strength: 4 },
  { id: "life-course:teacher-development", sourceSlug: "life-course-theory", targetSlug: "teacher-professional-development-theory", relationType: "extended_by", descriptionEn: "Career development extends attention to timing and transitions in professional lives.", strength: 4 },
  { id: "life-course:teacher-identity", sourceSlug: "life-course-theory", targetSlug: "teacher-identity-theory", relationType: "integrated_with", descriptionEn: "Temporal biography and professional identity can be connected in teacher research.", strength: 4 },
  { id: "teacher-identity:teacher-development", sourceSlug: "teacher-identity-theory", targetSlug: "teacher-professional-development-theory", relationType: "integrated_with", descriptionEn: "Identity, commitment, and learning can be analysed together across teachers' careers.", strength: 4 },
  { id: "practice:social-capital", sourceSlug: "practice-theory-bourdieu", targetSlug: "social-capital-theory", relationType: "branched_from", descriptionEn: "Theories of social capital overlap with Bourdieu's broader account of capital and social relations.", strength: 4 },
  { id: "practice:institutional", sourceSlug: "practice-theory-bourdieu", targetSlug: "institutional-theory", relationType: "integrated_with", descriptionEn: "Both theories can be used to examine how fields, positions, norms, and legitimacy shape organisational practice.", strength: 3 },
  { id: "practice:structuration", sourceSlug: "practice-theory-bourdieu", targetSlug: "structuration-theory", relationType: "critiqued_by", descriptionEn: "They offer distinct accounts of how structure and agency relate in social practice.", strength: 3 },
  { id: "street-level:multiple-streams", sourceSlug: "street-level-bureaucracy", targetSlug: "multiple-streams-framework", relationType: "integrated_with", descriptionEn: "Together they connect agenda change with frontline enactment after policy adoption.", strength: 4 },
];

const publishedAt = "2026-07-12T00:00:00.000Z";

const scholars: SeedScholar[] = [
  {
    slug: "glen-h-elder-jr",
    name: "Glen H. Elder Jr.",
    bioEn: "Sociologist associated with life-course research; this profile is anchored to the cited 1998 Child Development article used for the Life Course Theory page.",
    status: "published",
    publishedAt,
  },
  {
    slug: "geert-kelchtermans",
    name: "Geert Kelchtermans",
    bioEn: "Education scholar whose cited Teachers and Teaching article is used here as a traceable source for teacher identity and professional self-understanding.",
    status: "published",
    publishedAt,
  },
  {
    slug: "anthony-giddens",
    name: "Anthony Giddens",
    bioEn: "Sociologist whose book The Constitution of Society is the cited source anchor for Structuration Theory in this corpus.",
    status: "published",
    publishedAt,
  },
  {
    slug: "pierre-bourdieu",
    name: "Pierre Bourdieu",
    bioEn: "Sociologist whose Outline of a Theory of Practice is the cited source anchor for habitus, field, capital, and practice in this corpus.",
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
    sourceUrls: [sources.structuration.url],
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
    status: "published",
    publishedAt,
  },
  {
    slug: "educational-transitions-over-time",
    questionEn: "How do educational transitions unfold across time, relationships, and institutions?",
    status: "published",
    publishedAt,
  },
  {
    slug: "organizational-routines-and-structural-change",
    questionEn: "How do organizational routines reproduce or change structural rules and resources?",
    status: "published",
    publishedAt,
  },
  {
    slug: "inequality-in-educational-and-social-fields",
    questionEn: "How do resources, dispositions, and field positions shape inequality?",
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
    topicSlug: "educational-transitions-over-time",
    theorySlug: "life-course-theory",
    suitability: "high",
    suitabilityNotesEn: "Life Course Theory is suitable because the question foregrounds transition timing, linked lives, institutions, and historically situated sequences.",
    recommendation: "primary",
    sourceUrls: [sources.lifeCourse.url],
    evidenceNotesEn: "The cited Elder article anchors the page's life-course framing; the topic fit is an editorial judgement constrained to transition-oriented research questions.",
  },
  {
    topicSlug: "organizational-routines-and-structural-change",
    theorySlug: "structuration-theory",
    suitability: "high",
    suitabilityNotesEn: "Structuration Theory is suitable because the question asks how everyday routines draw on, reproduce, or alter rules and resources.",
    recommendation: "primary",
    sourceUrls: [sources.structuration.url],
    evidenceNotesEn: "The cited Giddens book anchors the page's structuration vocabulary; the topic fit is an editorial judgement for research on recursive practice and structure.",
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
];

const verifications: SeedVerification[] = theories.flatMap((entry) => {
  const source = entry.content.en.sources?.[0];
  if (!source) throw new Error(`${entry.slug} must have an L1 source`);
  return [
    { entitySlug: entry.slug, fieldPath: "content_jsonb.en.sources", level: "L1_verified" as const, sources: [source.url], notes: "Traceable source record reviewed for the page's foundational bibliographic anchor." },
    { entitySlug: entry.slug, fieldPath: "content_jsonb.en.fit_and_boundaries", level: "L2_editorial" as const, sources: [], notes: "Editorial explanation and theory-fit judgement." },
    { entitySlug: entry.slug, fieldPath: "content_jsonb.en.research_guidance", level: "L3_pending" as const, sources: [], notes: "Research-design guidance requiring study-specific and supervisor review." },
  ];
});

export const seedCorpus: SeedCorpus = {
  disciplines,
  fields,
  theories,
  disciplineTheories,
  fieldTheories,
  genealogy,
  scholars,
  theoryScholars,
  topics,
  topicTheories,
  verifications,
};
