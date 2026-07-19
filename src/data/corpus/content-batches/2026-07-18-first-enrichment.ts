import type {
  SeedScholar,
  SeedTheoryScholar,
  SeedTopic,
  SeedTopicTheory,
} from "../shared/entities.ts";
import type { PathwayContent, TheoryPathway } from "../../templates/pathway-template.ts";
import type { ContentSource } from "../../templates/theory-template.ts";

export interface FirstEnrichmentSourcePool {
  teacherDevelopmentClarke: ContentSource;
  teacherDevelopmentTimperley: ContentSource;
  teacherIdentity: ContentSource;
  communities: ContentSource;
  communitiesWenger: ContentSource;
  communitiesCox: ContentSource;
  streetLevel: ContentSource;
  streetLevelOjp: ContentSource;
  institutional: ContentSource;
  institutionalMeyerRowan: ContentSource;
  multipleStreams: ContentSource;
  equity: ContentSource;
  equityOecd: ContentSource;
  socialCapital: ContentSource;
  practice: ContentSource;
  practiceCapital: ContentSource;
}

export interface FirstEnrichmentBatch {
  scholars: SeedScholar[];
  theoryScholars: SeedTheoryScholar[];
  topics: SeedTopic[];
  topicTheories: SeedTopicTheory[];
}

const publishedAt = "2026-07-18T00:00:00.000Z";

function pathway(
  overview: string,
  coreQuestions: string[],
  questionCategories: PathwayContent["question_categories"],
  selectionPath: PathwayContent["selection_path"],
  theoryPathways: TheoryPathway[],
  entryPoints: PathwayContent["entry_points"],
  sources: ContentSource[],
  l1SourceId: string,
): PathwayContent {
  return {
    overview,
    core_questions: coreQuestions,
    question_categories: questionCategories,
    selection_path: selectionPath,
    theory_pathways: theoryPathways,
    entry_points: entryPoints,
    sources,
    verification: [
      {
        claim: "The registered sources provide the bounded bibliographic or source-defined vocabulary used on this page.",
        evidence_level: "L1",
        source_id: l1SourceId,
        status: "verified",
      },
      {
        claim: "Theory routing, comparison, and primary/supporting/not-recommended labels are Syntag editorial judgments, not universal rules.",
        evidence_level: "L2",
        status: "editorial",
      },
      {
        claim: "Research-design suggestions depend on the question, setting, ethics, access, and disciplinary guidance.",
        evidence_level: "L3",
        status: "proposed",
      },
    ],
  };
}

function topicTheory(
  topicSlug: string,
  theorySlug: string,
  recommendation: SeedTopicTheory["recommendation"],
  suitability: SeedTopicTheory["suitability"],
  suitabilityNotesEn: string,
  sourceUrl: string,
): SeedTopicTheory {
  return {
    topicSlug,
    theorySlug,
    suitability,
    suitabilityNotesEn,
    recommendation,
    sourceUrls: [sourceUrl],
    evidenceNotesEn: "This theory fit is an L2 Syntag editorial judgment constrained by the listed theory source record; it is not a universal ranking or claim-level approval.",
  };
}

const laveProfile: ContentSource = {
  id: "lave-lchc-profile",
  citation: "Laboratory of Comparative Human Cognition. Jean Lave profile.",
  url: "https://lchcautobio.ucsd.edu/jean-lave/",
  source_kind: "university",
  evidence_level: "L1",
  supports: ["Academic positioning", "Named academic appointment as stated by the profile"],
};

const wengerProfile: ContentSource = {
  id: "wenger-uoc-profile",
  citation: "Open University of Catalonia. Etienne Wenger biographical profile.",
  url: "https://www.uoc.edu/web/esp/art/uoc/ssanz1003/ewenger1003_cv.html",
  source_kind: "university",
  evidence_level: "L1",
  supports: ["Learning-theory positioning", "Reported work history as stated by the profile"],
};

const lipskyProfile: ContentSource = {
  id: "lipsky-harvard-kennedy-profile",
  citation: "Harvard Kennedy School, Project on Indigenous Governance and Development. Michael Lipsky profile.",
  url: "https://indigenousgov.hks.harvard.edu/people/michael-lipsky",
  source_kind: "university",
  evidence_level: "L1",
  supports: ["Political-science positioning", "Documented academic career facts"],
};

const lipskyOriginalPublication: ContentSource = {
  id: "lipsky-1980-russell-sage-publication-history",
  citation: "Russell Sage Foundation. Expanded Thirtieth Anniversary Edition of Street-Level Bureaucracy project record.",
  url: "https://www.russellsage.org/research/grants/expanded-thirtieth-anniversary-edition-street-level-bureaucracy-dilemmas-individual",
  source_kind: "publisher",
  evidence_level: "L1",
  supports: ["Original 1980 publication history", "2010 expanded-edition context"],
};

const kingdonProfile: ContentSource = {
  id: "kingdon-michigan-profile",
  citation: "University of Michigan, Department of Political Science. John W. Kingdon profile.",
  url: "https://lsa.umich.edu/polisci/people/emeriti/kingdon.html",
  source_kind: "university",
  evidence_level: "L1",
  supports: ["Professor Emeritus status", "Named work and first-publication information as stated by the profile"],
};

export function createFirstEnrichmentBatch(sources: FirstEnrichmentSourcePool): FirstEnrichmentBatch {
  const teacherLearningTopic = "teacher-professional-learning-and-change";
  const policyImplementationTopic = "education-policy-implementation-frontline-discretion";
  const accessTopic = "access-to-educational-support-and-opportunity";
  const copTeacherLearningTopic = "communities-of-practice-in-teacher-learning";

  const topics: SeedTopic[] = [
    {
      slug: teacherLearningTopic,
      questionEn: "How do teachers' professional learning experiences lead to changes in practice?",
      status: "draft",
      content: { en: pathway(
        "This topic is a question-first route for studies of teacher learning and changes in practice. Its theory choices are L2 Syntag editorial judgments: source records list bounded vocabulary, while claim-level review remains pending.",
        ["What learning process and practice change are being studied?", "What material shows change rather than attendance or satisfaction?", "Is sustained shared practice central enough to warrant a Communities of Practice lens?"],
        [
          { category: "Professional growth and change", description: "Questions about teacher learning, mediating processes, and changed practice.", theory_slugs: ["teacher-professional-development-theory"] },
          { category: "Participation-based learning", description: "Questions about sustained shared practice and participation.", theory_slugs: ["communities-of-practice"] },
          { category: "Professional self-understanding", description: "Questions centred on teachers' interpreted professional selves.", theory_slugs: ["teacher-identity-theory"] },
        ],
        [
          { step: "Name the change claim", prompt: "What changed: knowledge, belief, practice, role, or collaboration?", routing_rule: "Use a named professional-growth model when learning and practice change are the explanatory object." },
          { step: "Check evidence", prompt: "What shows learning and change rather than participation alone?", routing_rule: "Do not infer practice change from attendance, satisfaction, or a programme label." },
          { step: "Inspect participation", prompt: "Is there sustained mutual engagement, joint enterprise, and shared repertoire?", routing_rule: "Use Communities of Practice only when the participation conditions can be evidenced." },
        ],
        [
          { theory_slug: "teacher-professional-development-theory", role: "primary", explanatory_focus: "Professional learning, mediating processes, and changes in teaching practice", analysis_unit: "Teacher learning processes and practice-change episodes", data_materials: "Teacher accounts, practice episodes, programme documents, and contextual materials", strengths: "Offers a named professional-growth route without treating development as one closed theory", limitations: "Does not prove that participation caused changed practice or learner outcomes", source_ids: [sources.teacherDevelopmentClarke.id, sources.teacherDevelopmentTimperley.id] },
          { theory_slug: "communities-of-practice", role: "supporting", explanatory_focus: "Learning through sustained participation in shared practice", analysis_unit: "A socially sustained practice and its participants", data_materials: "Participation episodes, shared artefacts, boundary evidence, and participant accounts", strengths: "Clarifies social participation when mutual engagement, joint enterprise, and repertoire are evidenced", limitations: "A programme, department, or attendance list is not automatically a community of practice", source_ids: [sources.communities.id, sources.communitiesWenger.id] },
          { theory_slug: "teacher-identity-theory", role: "not_recommended", explanatory_focus: "Professional self-understanding in work context", analysis_unit: "Teachers' interpreted professional selves", data_materials: "Narratives, reflective materials, role expectations, and interactional accounts", strengths: "Can support a separate question about professional self-understanding", limitations: "Is not primary when learning and practice change, rather than identity, are the stated explanatory object", source_ids: [sources.teacherIdentity.id] },
        ],
        [
          { entity_type: "field", slug: "teacher-education-professional-development", label: "Teacher Education & Professional Development", relevance: "Field-level route for teacher-learning questions." },
          { entity_type: "topic", slug: copTeacherLearningTopic, label: "Communities of Practice in teacher learning", relevance: "Use for a narrower shared-practice question." },
          { entity_type: "theory", slug: "teacher-professional-development-theory", label: "Teacher Professional Development Theory", relevance: "Primary editorial route." },
          { entity_type: "work", slug: "teacher-development-clarke-hollingsworth-2002", label: "Elaborating a Model of Teacher Professional Growth", relevance: "Named model source record." },
          { entity_type: "concept", slug: "professional-learning", label: "Professional Learning", relevance: "Core concept route." },
        ],
        [sources.teacherDevelopmentClarke, sources.teacherDevelopmentTimperley, sources.communities, sources.communitiesWenger, sources.teacherIdentity],
        sources.teacherDevelopmentClarke.id,
      ) },
    },
    {
      slug: policyImplementationTopic,
      questionEn: "How do frontline educators and administrators exercise discretion when implementing education policy?",
      status: "draft",
      content: { en: pathway(
        "This topic isolates implementation after policy adoption from agenda setting and policy choice. Its pathways are L2 Syntag editorial judgments; sources are listed for bounded vocabulary and claim-level review remains pending.",
        ["What adopted policy or service is being implemented?", "Which frontline actor makes a consequential decision in a service interaction?", "What organisational conditions shape the decision?"],
        [
          { category: "Frontline delivery", description: "Case-level or school-level enactment under policy and organisational constraints.", theory_slugs: ["street-level-bureaucracy"] },
          { category: "Formal policy and legitimacy", description: "Formal adoption, legitimacy, institutionalised rules, or decoupling.", theory_slugs: ["institutional-theory"] },
          { category: "Agenda and policy choice", description: "Pre-adoption attention, alternatives, timing, and coupling.", theory_slugs: ["multiple-streams-framework"] },
        ],
        [
          { step: "Locate the policy stage", prompt: "Is the study about agenda setting, adoption, or frontline delivery?", routing_rule: "Use Street-Level Bureaucracy for post-adoption implementation and Multiple Streams for agenda or choice." },
          { step: "Name the frontline actor", prompt: "Who makes a consequential service or case-level judgment?", routing_rule: "Do not use Street-Level Bureaucracy without a frontline implementation role and interaction." },
          { step: "Specify conditions", prompt: "Which rules, resources, workload, ambiguity, or accountability pressures are evidenced?", routing_rule: "Treat discretion as situated under conditions rather than personal autonomy or misconduct." },
        ],
        [
          { theory_slug: "street-level-bureaucracy", role: "primary", explanatory_focus: "Frontline policy enactment, discretion, client interaction, and organisational constraints", analysis_unit: "A frontline implementation episode or case-level decision", data_materials: "Policy guidance, interviews, decision records, case materials, and implementation observations", strengths: "Matches a post-adoption question about delivered policy under constraints", limitations: "Does not explain why an issue reached the agenda or prove that discretion is beneficial or harmful", source_ids: [sources.streetLevel.id, sources.streetLevelOjp.id] },
          { theory_slug: "institutional-theory", role: "supporting", explanatory_focus: "Formal structures, legitimacy, institutional rules, and possible decoupling", analysis_unit: "An organisation or organisational field with formal policy arrangements", data_materials: "Formal documents, organisational comparisons, pressure accounts, and practice evidence", strengths: "Can explain formal adoption or legitimacy conditions alongside case-level implementation", limitations: "A document-practice gap alone does not establish decoupling or replace a frontline mechanism", source_ids: [sources.institutional.id, sources.institutionalMeyerRowan.id] },
          { theory_slug: "multiple-streams-framework", role: "not_recommended", explanatory_focus: "Agenda attention, alternatives, timing, and policy-process ambiguity", analysis_unit: "A dated agenda-setting or policy-choice process", data_materials: "Problem indicators, proposals, political records, and coupling evidence", strengths: "Can analyse a distinct pre-adoption stage", limitations: "Is not primary for everyday frontline delivery after adoption", source_ids: [sources.multipleStreams.id] },
        ],
        [
          { entity_type: "field", slug: "educational-equity-policy", label: "Educational Equity & Policy", relevance: "Field-level route for policy questions." },
          { entity_type: "theory", slug: "street-level-bureaucracy", label: "Street-Level Bureaucracy", relevance: "Primary editorial route." },
          { entity_type: "theory", slug: "multiple-streams-framework", label: "Multiple Streams Framework", relevance: "Contrast route for agenda-setting questions." },
          { entity_type: "work", slug: "lipsky-2010-street-level-bureaucracy", label: "Street-Level Bureaucracy", relevance: "Primary source record." },
          { entity_type: "concept", slug: "frontline-discretion", label: "Frontline Discretion", relevance: "Core implementation concept." },
        ],
        [sources.streetLevel, sources.streetLevelOjp, sources.institutional, sources.institutionalMeyerRowan, sources.multipleStreams],
        sources.streetLevel.id,
      ) },
    },
    {
      slug: accessTopic,
      questionEn: "How do students gain or lose access to educational support and opportunity?",
      status: "draft",
      content: { en: pathway(
        "This topic separates a normative equity comparison from a relation-enabled access mechanism and a field/capital explanation. Its pathways are L2 Syntag editorial judgments; sources are listed and claim-level review remains pending.",
        ["What support or opportunity is at issue?", "Which students or groups are compared, and on what basis?", "What mechanism shapes access, non-access, or gatekeeping?"],
        [
          { category: "Equity and opportunity", description: "Normative questions about access, distribution, participation, recognition, or outcomes with an explicit comparator.", theory_slugs: ["educational-equity-theory"] },
          { category: "Relational resource access", description: "Information, referrals, trust, advocacy, or support through specified relations.", theory_slugs: ["social-capital-theory"] },
          { category: "Field-conditioned advantage", description: "Capital value, recognition, field position, and conversion.", theory_slugs: ["practice-theory-bourdieu"] },
        ],
        [
          { step: "Specify the opportunity", prompt: "Is the issue support, counselling, coursework, resources, recognition, or a pathway?", routing_rule: "Do not use an access lens while the support or opportunity remains unnamed." },
          { step: "Define the comparator", prompt: "Who is compared with whom, and why is the difference significant?", routing_rule: "Use Educational Equity only with a stated dimension, comparator, and normative basis." },
          { step: "Choose the mechanism", prompt: "Is access shaped by allocation, relations, field/capital, or frontline delivery?", routing_rule: "Keep the normative equity frame separate from the explanatory mechanism." },
        ],
        [
          { theory_slug: "educational-equity-theory", role: "primary", explanatory_focus: "Normative inquiry into avoidable inequality in access and opportunity", analysis_unit: "A population or group with an explicit comparator", data_materials: "Access, allocation, participation, treatment, and outcome evidence with a stated comparison", strengths: "Makes the evaluative standard explicit rather than treating equity as a slogan", limitations: "Does not identify a causal mechanism without an additional explanatory lens", source_ids: [sources.equity.id, sources.equityOecd.id] },
          { theory_slug: "social-capital-theory", role: "supporting", explanatory_focus: "Relation-enabled access to and mobilisation of specified resources", analysis_unit: "Specified actors, relations, resources, and access episodes", data_materials: "Requests, referrals, information flows, support records, and non-access cases", strengths: "Can specify how relations condition access without treating every tie as beneficial", limitations: "Does not itself supply the equity standard or show that a contact produced benefit", source_ids: [sources.socialCapital.id] },
          { theory_slug: "practice-theory-bourdieu", role: "not_recommended", explanatory_focus: "Field position, capital conversion, classification, and recognition", analysis_unit: "A relationally defined field and positions within it", data_materials: "Field positions, capital forms, conversion, recognition, and countercases", strengths: "Can be useful where opportunity is explicitly field-conditioned", limitations: "Is not primary when field, capital, conversion, and recognition evidence are absent", source_ids: [sources.practice.id, sources.practiceCapital.id] },
        ],
        [
          { entity_type: "field", slug: "educational-equity-policy", label: "Educational Equity & Policy", relevance: "Field-level route for equity and policy questions." },
          { entity_type: "topic", slug: "inequality-in-educational-and-social-fields", label: "Inequality in educational and social fields", relevance: "Contrast field/capital explanation." },
          { entity_type: "theory", slug: "educational-equity-theory", label: "Educational Equity Theory", relevance: "Primary editorial route." },
          { entity_type: "work", slug: "unesco-2020-inclusion-education", label: "Global Education Monitoring Report 2020", relevance: "Institutional context source." },
          { entity_type: "concept", slug: "relational-resource-access", label: "Relational Resource Access", relevance: "Supporting mechanism concept." },
        ],
        [sources.equity, sources.equityOecd, sources.socialCapital, sources.practice, sources.practiceCapital],
        sources.equity.id,
      ) },
    },
    {
      slug: copTeacherLearningTopic,
      questionEn: "When is Communities of Practice a good fit for studying teacher learning?",
      status: "draft",
      content: { en: pathway(
        "This topic is a fit check for teacher learning through socially sustained shared practice, not a label for every team, programme, or platform. Its routes are L2 Syntag editorial judgments; sources are listed and claim-level review remains pending.",
        ["What is the shared practice, and who participates in it?", "Is there evidence of mutual engagement, joint enterprise, and shared repertoire?", "Is the actual mechanism professional growth or relation-enabled resource access instead?"],
        [
          { category: "Participation and practice", description: "Learning through sustained participation, mutual engagement, joint enterprise, and shared repertoire.", theory_slugs: ["communities-of-practice"] },
          { category: "Teacher professional growth", description: "Learning opportunities, practice change, and development conditions.", theory_slugs: ["teacher-professional-development-theory"] },
          { category: "Resource access through ties", description: "Information, support, referrals, or resources accessed through relations.", theory_slugs: ["social-capital-theory"] },
        ],
        [
          { step: "Test CoP conditions", prompt: "What evidence shows mutual engagement, joint enterprise, and shared repertoire?", routing_rule: "Do not classify formal membership, attendance, or a programme label as a community of practice." },
          { step: "Name the learning process", prompt: "How does participation connect to learning, competence, or changed practice?", routing_rule: "Keep shared-practice evidence distinct from a generic professional-development label." },
          { step: "Separate alternatives", prompt: "Is the mechanism growth across domains or resource access through relations?", routing_rule: "Use professional development or social capital where their different mechanism is primary." },
        ],
        [
          { theory_slug: "communities-of-practice", role: "primary", explanatory_focus: "Learning through social participation in sustained shared practice", analysis_unit: "A community of practice or bounded participation setting", data_materials: "Practice observation, participation episodes, shared artefacts, boundary evidence, and participant accounts", strengths: "Makes mutual engagement, joint enterprise, repertoire, access, and participation visible", limitations: "A teacher team, workshop, online group, or formal membership is not automatically a community of practice", source_ids: [sources.communities.id, sources.communitiesWenger.id, sources.communitiesCox.id] },
          { theory_slug: "teacher-professional-development-theory", role: "supporting", explanatory_focus: "Teacher growth, changed practice, mediating processes, and learning conditions", analysis_unit: "Teacher learning and practice-change processes", data_materials: "Learning histories, practice evidence, programme records, and contextual accounts", strengths: "Can extend a participation account to a distinct professional-growth question", limitations: "Does not make every development programme a community of practice", source_ids: [sources.teacherDevelopmentClarke.id, sources.teacherDevelopmentTimperley.id] },
          { theory_slug: "social-capital-theory", role: "not_recommended", explanatory_focus: "Relation-enabled resource access", analysis_unit: "Specified relations and resource-access episodes", data_materials: "Requests, referrals, information flows, support exchanges, and non-access cases", strengths: "Can support a separate access-to-support question", limitations: "Is not primary when shared practice and participation, rather than resource access through ties, are the proposed mechanism", source_ids: [sources.socialCapital.id] },
        ],
        [
          { entity_type: "field", slug: "teacher-education-professional-development", label: "Teacher Education & Professional Development", relevance: "Field-level route for teacher learning." },
          { entity_type: "topic", slug: teacherLearningTopic, label: "Teacher professional learning and change", relevance: "Broader learning-and-practice-change route." },
          { entity_type: "theory", slug: "communities-of-practice", label: "Communities of Practice", relevance: "Primary editorial route." },
          { entity_type: "work", slug: "cop-wenger-1998", label: "Communities of Practice: Learning, Meaning, and Identity", relevance: "Core source record." },
          { entity_type: "concept", slug: "shared-repertoire", label: "Shared Repertoire", relevance: "Core practice evidence concept." },
        ],
        [sources.communities, sources.communitiesWenger, sources.communitiesCox, sources.teacherDevelopmentClarke, sources.teacherDevelopmentTimperley, sources.socialCapital],
        sources.communitiesWenger.id,
      ) },
    },
  ];

  const scholars: SeedScholar[] = [
    {
      slug: "jean-lave",
      name: "Jean Lave",
      bioEn: "Social anthropologist whose source-backed profile and coauthored work support a bounded contribution to the Communities of Practice entry.",
      status: "published",
      publishedAt,
      content: { en: {
        overview: "Jean Lave is a social anthropologist whose documented work examines learning, everyday life, and social practice. This page limits its account to the cited profile and the coauthored corpus source.",
        academic_identity: { discipline: "Social anthropology", role: "Scholar of learning and social practice", source_ids: [laveProfile.id] },
        theory_relationships: [{ theory_slug: "communities-of-practice", relationship: "Key contributor", description: "With Etienne Wenger, Lave coauthored the corpus source for legitimate peripheral participation; Syntag treats this as a bounded contribution rather than sole ownership of Communities of Practice.", source_ids: [sources.communities.id] }],
        representative_works: [{ title: "Situated Learning: Legitimate Peripheral Participation", work_slug: "lave-wenger-1991-situated-learning", contribution: "The coauthored corpus source for situated learning and legitimate peripheral participation.", source_ids: [sources.communities.id] }],
        scholarly_relations: [{ kind: "collaboration", description: "The Cambridge record documents Lave and Wenger as coauthors of Situated Learning; it establishes coauthorship of this work only.", source_ids: [sources.communities.id] }],
        attribution_boundaries: ["Do not describe Lave as the sole founder of Communities of Practice or all situated-learning scholarship.", "Do not infer a relationship with Wenger beyond the documented coauthored work."],
        reading_path: [{ order: 1, title: "Situated Learning", purpose: "Start with the documented coauthored source for legitimate peripheral participation.", source_id: sources.communities.id }, { order: 2, title: "Communities of Practice", purpose: "Distinguish Wenger's later formulation from the 1991 coauthored work.", source_id: sources.communitiesWenger.id }, { order: 3, title: "University-hosted profile", purpose: "Check the limited academic-positioning claim.", source_id: laveProfile.id }],
        sources: [laveProfile, sources.communities, sources.communitiesWenger],
        verification: [{ claim: "The university profile and Cambridge record identify Lave and the cited coauthored work.", evidence_level: "L1", source_id: laveProfile.id, status: "verified" }, { claim: "The key-contributor label and attribution boundary are bounded Syntag editorial synthesis.", evidence_level: "L2", status: "editorial" }, { claim: "Reading choices depend on the research question, access, and disciplinary guidance.", evidence_level: "L3", status: "proposed" }],
      } },
    },
    {
      slug: "etienne-wenger",
      name: "Etienne Wenger",
      bioEn: "Learning-theory scholar whose source-backed works support a bounded contribution to the Communities of Practice entry.",
      status: "published",
      publishedAt,
      content: { en: {
        overview: "Etienne Wenger is associated with learning-theory research on communities of practice. This page limits its claims to the cited university-hosted profile and the two documented corpus works.",
        academic_identity: { discipline: "Learning theory", role: "Scholar associated with Communities of Practice research", source_ids: [wengerProfile.id] },
        theory_relationships: [{ theory_slug: "communities-of-practice", relationship: "Key contributor", description: "Wenger coauthored the 1991 corpus source and authored the 1998 Communities of Practice source; this is a bounded contribution rather than a sole-founder claim.", source_ids: [sources.communities.id, sources.communitiesWenger.id] }],
        representative_works: [{ title: "Situated Learning: Legitimate Peripheral Participation", work_slug: "lave-wenger-1991-situated-learning", contribution: "The coauthored corpus source for legitimate peripheral participation.", source_ids: [sources.communities.id] }, { title: "Communities of Practice: Learning, Meaning, and Identity", work_slug: "cop-wenger-1998", contribution: "The corpus source for the social-participation formulation of Communities of Practice.", source_ids: [sources.communitiesWenger.id] }],
        scholarly_relations: [{ kind: "collaboration", description: "The Cambridge record documents Wenger and Lave as coauthors of Situated Learning; it establishes coauthorship of this work only.", source_ids: [sources.communities.id] }],
        attribution_boundaries: ["Do not describe Wenger as the sole founder of Communities of Practice or collapse the 1991 coauthored work into a sole-author account.", "Do not infer an unlisted title, date, current affiliation, or personal relationship from the profile."],
        reading_path: [{ order: 1, title: "Situated Learning", purpose: "Read the coauthored legitimate-peripheral-participation source first.", source_id: sources.communities.id }, { order: 2, title: "Communities of Practice", purpose: "Read the separate social-participation formulation.", source_id: sources.communitiesWenger.id }, { order: 3, title: "University-hosted profile", purpose: "Check the limited academic-positioning claim.", source_id: wengerProfile.id }],
        sources: [wengerProfile, sources.communities, sources.communitiesWenger],
        verification: [{ claim: "The university profile and Cambridge records identify Wenger and the two cited works.", evidence_level: "L1", source_id: wengerProfile.id, status: "verified" }, { claim: "The key-contributor label and attribution boundary are bounded Syntag editorial synthesis.", evidence_level: "L2", status: "editorial" }, { claim: "Reading choices depend on the research question, access, and disciplinary guidance.", evidence_level: "L3", status: "proposed" }],
      } },
    },
    {
      slug: "michael-lipsky",
      name: "Michael Lipsky",
      bioEn: "Political scientist and public-policy scholar whose source-backed work anchors a bounded Street-Level Bureaucracy profile.",
      status: "published",
      publishedAt,
      content: { en: {
        overview: "Michael Lipsky is a political scientist and public-policy scholar. This page limits its account to the cited academic profile and publisher records for Street-Level Bureaucracy.",
        academic_identity: { discipline: "Political science and public policy", role: "Political scientist and public-policy scholar", source_ids: [lipskyProfile.id] },
        theory_relationships: [{ theory_slug: "street-level-bureaucracy", relationship: "Key contributor", description: "Lipsky authored the corpus source for a bounded account of frontline public-service implementation, discretion, client interaction, and organisational constraints.", source_ids: [sources.streetLevel.id, sources.streetLevelOjp.id] }],
        representative_works: [{ title: "Street-Level Bureaucracy: Dilemmas of the Individual in Public Services", work_slug: "lipsky-2010-street-level-bureaucracy", contribution: "The corpus source for a bounded account of frontline implementation and discretion.", source_ids: [sources.streetLevel.id] }],
        scholarly_relations: [{ kind: "development", description: "The Russell Sage publication-history record identifies the original 1980 publication, and the separate Russell Sage book record identifies the 2010 expanded edition; this is a publication-history sequence, not a relation to another scholar.", source_ids: [lipskyOriginalPublication.id, sources.streetLevel.id] }],
        attribution_boundaries: ["Do not describe Lipsky as the sole founder of all street-level scholarship or treat every frontline worker as a street-level bureaucrat.", "Do not treat discretion as automatically beneficial, harmful, autonomous, or an explanation of agenda setting."],
        reading_path: [{ order: 1, title: "Street-Level Bureaucracy (1980 publication history)", purpose: "Begin by distinguishing the original publication from the later expanded edition.", source_id: lipskyOriginalPublication.id }, { order: 2, title: "Street-Level Bureaucracy (2010 expanded edition)", purpose: "Use the corpus's publisher record for the cited edition and bounded vocabulary.", source_id: sources.streetLevel.id }, { order: 3, title: "Harvard Kennedy School profile", purpose: "Check the limited academic-positioning claim.", source_id: lipskyProfile.id }],
        sources: [lipskyProfile, lipskyOriginalPublication, sources.streetLevel, sources.streetLevelOjp],
        verification: [{ claim: "The Harvard profile and Russell Sage records identify Lipsky and the cited publication history.", evidence_level: "L1", source_id: lipskyProfile.id, status: "verified" }, { claim: "The key-contributor label and attribution boundary are bounded Syntag editorial synthesis.", evidence_level: "L2", status: "editorial" }, { claim: "Reading choices depend on the research question, access, and disciplinary guidance.", evidence_level: "L3", status: "proposed" }],
      } },
    },
    {
      slug: "john-w-kingdon",
      name: "John W. Kingdon",
      bioEn: "Political scientist whose candidate profile remains draft while existing corpus edition metadata is reconciled.",
      status: "draft",
      content: { en: {
        overview: "John W. Kingdon is Professor Emeritus of Political Science at the University of Michigan. This draft profile is limited to the university record and the corpus's retained 1995 library record while edition metadata remains under review.",
        academic_identity: { discipline: "Political science", role: "Professor Emeritus of Political Science", source_ids: [kingdonProfile.id] },
        theory_relationships: [{ theory_slug: "multiple-streams-framework", relationship: "Key contributor", description: "Kingdon authored the retained corpus work used for the Multiple Streams Framework's bounded agenda-setting orientation; the candidate remains draft pending edition-metadata reconciliation.", source_ids: [sources.multipleStreams.id] }],
        representative_works: [{ title: "Agendas, Alternatives, and Public Policies", work_slug: "kingdon-1995-agendas-alternatives", contribution: "The retained corpus library record for the framework's agenda-setting orientation.", source_ids: [sources.multipleStreams.id] }],
        scholarly_relations: [{ kind: "development", description: "Editorially, the corpus distinguishes the original 1984 work from retained edition records; this is publication-history treatment, not a relation to another scholar.", source_ids: [sources.multipleStreams.id] }],
        attribution_boundaries: ["Do not describe Kingdon as the sole founder of every Multiple Streams Framework refinement or application.", "Do not treat agenda-setting vocabulary as a theory of post-adoption frontline implementation or conflate the retained edition records with a distinct 2013 publisher edition."],
        reading_path: [{ order: 1, title: "University of Michigan profile", purpose: "Check the limited academic-positioning and first-publication information.", source_id: kingdonProfile.id }, { order: 2, title: "Retained 1995 library record", purpose: "Use only the internally consistent corpus edition record while the wider edition audit remains pending.", source_id: sources.multipleStreams.id }],
        sources: [kingdonProfile, sources.multipleStreams],
        verification: [{ claim: "The university profile and retained library record identify Kingdon and the bounded work record.", evidence_level: "L1", source_id: kingdonProfile.id, status: "verified" }, { claim: "The key-contributor label, edition boundary, and draft decision are bounded Syntag editorial synthesis.", evidence_level: "L2", status: "editorial" }, { claim: "Reading choices depend on the research question, access, and disciplinary guidance.", evidence_level: "L3", status: "proposed" }],
      } },
    },
  ];

  const theoryScholars: SeedTheoryScholar[] = [
    { theorySlug: "communities-of-practice", scholarSlug: "jean-lave", role: "key_contributor", sourceUrls: [sources.communities.url], evidenceNotesEn: "The Lave and Wenger source records the cited coauthored work. This key-contributor relation is a bounded editorial attribution, not a sole-founder claim." },
    { theorySlug: "communities-of-practice", scholarSlug: "etienne-wenger", role: "key_contributor", sourceUrls: [sources.communitiesWenger.url], evidenceNotesEn: "The Wenger publisher record and coauthored source support a bounded key-contributor relation, not a claim of sole origin for Communities of Practice." },
    { theorySlug: "street-level-bureaucracy", scholarSlug: "michael-lipsky", role: "key_contributor", sourceUrls: [sources.streetLevel.url], evidenceNotesEn: "The Lipsky publisher record anchors the corpus's bounded Street-Level Bureaucracy account; key contributor is deliberately narrower than founder." },
    { theorySlug: "multiple-streams-framework", scholarSlug: "john-w-kingdon", role: "key_contributor", sourceUrls: [sources.multipleStreams.url], evidenceNotesEn: "The retained Kingdon library record supports a bounded key-contributor relation; the related scholar remains draft pending edition-metadata reconciliation." },
  ];

  const topicTheories: SeedTopicTheory[] = [
    topicTheory(teacherLearningTopic, "teacher-professional-development-theory", "primary", "high", "Use this editorial route when learning processes and changes in teacher practice are the explanatory object.", sources.teacherDevelopmentClarke.url),
    topicTheory(teacherLearningTopic, "communities-of-practice", "supporting", "medium", "Use this editorial route only when sustained participation in shared practice is evidenced.", sources.communitiesWenger.url),
    topicTheory(teacherLearningTopic, "teacher-identity-theory", "not_recommended", "low", "Do not make identity primary when learning and practice change, rather than professional self-understanding, are central.", sources.teacherIdentity.url),
    topicTheory(policyImplementationTopic, "street-level-bureaucracy", "primary", "high", "Use this editorial route for frontline implementation after policy adoption under documented organisational conditions.", sources.streetLevel.url),
    topicTheory(policyImplementationTopic, "institutional-theory", "supporting", "medium", "Use this editorial route when formal adoption, legitimacy, institutional rules, or decoupling are separately evidenced.", sources.institutionalMeyerRowan.url),
    topicTheory(policyImplementationTopic, "multiple-streams-framework", "not_recommended", "low", "Do not make agenda-setting vocabulary primary for post-adoption frontline delivery.", sources.multipleStreams.url),
    topicTheory(accessTopic, "educational-equity-theory", "primary", "high", "Use this editorial route for an explicit normative comparison of access or opportunity.", sources.equity.url),
    topicTheory(accessTopic, "social-capital-theory", "supporting", "medium", "Use this editorial route when specified relations plausibly enable access to a defined resource.", sources.socialCapital.url),
    topicTheory(accessTopic, "practice-theory-bourdieu", "not_recommended", "low", "Do not make Bourdieu primary when field, capital conversion, and recognition evidence are absent.", sources.practice.url),
    topicTheory(copTeacherLearningTopic, "communities-of-practice", "primary", "high", "Use this editorial route only when shared practice, participation, and the CoP conditions can be evidenced.", sources.communitiesWenger.url),
    topicTheory(copTeacherLearningTopic, "teacher-professional-development-theory", "supporting", "medium", "Use this editorial route for a distinct question about teacher growth and practice change beyond one shared practice.", sources.teacherDevelopmentClarke.url),
    topicTheory(copTeacherLearningTopic, "social-capital-theory", "not_recommended", "low", "Do not make relation-enabled resource access primary when shared practice and participation are the proposed mechanism.", sources.socialCapital.url),
  ];

  return { scholars, theoryScholars, topics, topicTheories };
}
