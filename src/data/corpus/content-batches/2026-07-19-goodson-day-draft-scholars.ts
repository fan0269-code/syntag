import type { ContentSource } from "../../templates/theory-template.ts";
import type { SeedScholar, SeedTheoryScholar } from "../shared/entities.ts";

export interface GoodsonDayDraftScholarSourcePool {
  teacherDevelopment: ContentSource;
  teacherDevelopmentIdentity: ContentSource;
  lifeHistory: ContentSource;
  lifeHistoryTeachers: ContentSource;
  lifeHistoryGoodsonSikes: ContentSource;
}

export interface GoodsonDayDraftScholarBatch {
  scholars: SeedScholar[];
  theoryScholars: SeedTheoryScholar[];
}

const goodsonBrightonProfile: ContentSource = {
  id: "goodson-brighton-2018-profile",
  citation: "University of Brighton. (2018). National honour for Professor Goodson.",
  url: "https://www.brighton.ac.uk/about-us/news-and-events/news/2018/10-10-national-honour-for-professor-goodson.aspx",
  source_kind: "university",
  evidence_level: "L1",
  supports: [
    "Page-time academic positioning in 2018",
    "Professor of Learning Theory title stated by the university page",
  ],
};

const goodsonBeraProfile: ContentSource = {
  id: "goodson-bera-profile",
  citation: "British Educational Research Association. Ivor Goodson profile.",
  url: "https://www.bera.ac.uk/person/ivor-goodson",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: [
    "Education-research positioning",
    "Curriculum and life-history research areas stated by the profile",
  ],
};

const dayNottinghamProfile: ContentSource = {
  id: "day-nottingham-profile",
  citation: "University of Nottingham, School of Education. Christopher Day profile.",
  url: "https://www.nottingham.ac.uk/Education/People/christopher.day",
  source_kind: "university",
  evidence_level: "L1",
  supports: [
    "Professor of Education title shown on the profile",
    "Teacher professionalism and development research areas shown on the profile",
  ],
};

export function createGoodsonDayDraftScholarBatch(
  sources: GoodsonDayDraftScholarSourcePool,
): GoodsonDayDraftScholarBatch {
  const scholars: SeedScholar[] = [
    {
      slug: "ivor-f-goodson",
      name: "Ivor F. Goodson",
      bioEn: "Education researcher whose cited work supports a bounded draft profile in teacher life-history and narrative research.",
      status: "draft",
      content: {
        en: {
          overview: "A 2018 University of Brighton page identified Ivor F. Goodson as Professor of Learning Theory and described his affiliations at that page's time. The BERA profile describes his work on curriculum, life-history approaches, and teachers' lives and work. This draft does not state a current appointment.",
          academic_identity: {
            discipline: "Education research",
            role: "Professor of Learning Theory as identified by a 2018 University of Brighton page",
            source_ids: [goodsonBrightonProfile.id, goodsonBeraProfile.id],
          },
          theory_relationships: [
            {
              theory_slug: "teacher-life-history-research",
              relationship: "Key contributor candidate",
              description: "Goodson's cited works are source anchors for this qualitative research-tradition entry. The relation is bounded editorial synthesis, not ownership or origin of the whole tradition.",
              source_ids: [goodsonBeraProfile.id, sources.lifeHistory.id, sources.lifeHistoryTeachers.id, sources.lifeHistoryGoodsonSikes.id],
            },
          ],
          representative_works: [
            {
              title: "Developing Narrative Theory: Life Histories and Personal Representation",
              work_slug: "goodson-2013-narrative-theory",
              contribution: "Goodson's authored 2013 work provides a narrative and life-history source anchor.",
              source_ids: [sources.lifeHistory.id],
            },
            {
              title: "Studying Teachers' Lives",
              contribution: "Goodson edited this 1992 volume; the record is not treated as a single-authored book.",
              source_ids: [sources.lifeHistoryTeachers.id],
            },
            {
              title: "Life History Research in Educational Settings: Learning from Lives",
              contribution: "Goodson and Pat Sikes coauthored this specific 2001 work on educational life-history research.",
              source_ids: [sources.lifeHistoryGoodsonSikes.id],
            },
          ],
          scholarly_relations: [
            {
              kind: "collaboration",
              description: "The publisher record identifies Ivor F. Goodson and Pat Sikes as coauthors of the specific 2001 work; it does not establish mentorship, influence, or a wider or continuing collaboration network.",
              source_ids: [sources.lifeHistoryGoodsonSikes.id],
            },
          ],
          attribution_boundaries: [
            "Do not attribute the whole teacher-life-history or narrative research tradition to Goodson; the corpus relation is bounded editorial synthesis.",
            "Do not expand the documented 2001 Goodson and Sikes coauthorship into mentorship, influence, lineage, or a long-term collaboration claim.",
            "Keep the 1992 editor role distinct from sole authorship, and keep the 2018 title and affiliations limited to that page's time.",
          ],
          reading_path: [
            {
              order: 1,
              title: "University of Brighton profile (2018)",
              purpose: "Check the time-bounded academic-positioning statement.",
              source_id: goodsonBrightonProfile.id,
            },
            {
              order: 2,
              title: "BERA Ivor Goodson profile",
              purpose: "Check the bounded curriculum and life-history research positioning.",
              source_id: goodsonBeraProfile.id,
            },
            {
              order: 3,
              title: "Studying Teachers' Lives",
              purpose: "Distinguish Goodson's editor role and orient to teacher-life research.",
              source_id: sources.lifeHistoryTeachers.id,
            },
            {
              order: 4,
              title: "Life History Research in Educational Settings",
              purpose: "Read the specific Goodson and Sikes coauthored work without extending the relation beyond it.",
              source_id: sources.lifeHistoryGoodsonSikes.id,
            },
          ],
          sources: [
            goodsonBrightonProfile,
            goodsonBeraProfile,
            sources.lifeHistory,
            sources.lifeHistoryTeachers,
            sources.lifeHistoryGoodsonSikes,
          ],
          verification: [
            {
              claim: "The 2018 University of Brighton page supports the exact, time-bounded identity wording on this draft.",
              evidence_level: "L1",
              source_id: goodsonBrightonProfile.id,
              status: "verified",
            },
            {
              claim: "The BERA profile supports the bounded curriculum, life-history, and teachers' lives research positioning on this draft.",
              evidence_level: "L1",
              source_id: goodsonBeraProfile.id,
              status: "verified",
            },
            {
              claim: "The 2013 bibliographic record supports Goodson's authorship of Developing Narrative Theory.",
              evidence_level: "L1",
              source_id: sources.lifeHistory.id,
              status: "verified",
            },
            {
              claim: "The Google Books bibliographic record supports Goodson's editor role for Studying Teachers' Lives.",
              evidence_level: "L1",
              source_id: sources.lifeHistoryTeachers.id,
              status: "verified",
            },
            {
              claim: "The WorldCat bibliographic record supports Ivor Goodson and Patricia J. Sikes as coauthors of the 2001 work.",
              evidence_level: "L1",
              source_id: sources.lifeHistoryGoodsonSikes.id,
              status: "verified",
            },
            {
              claim: "The key-contributor label and attribution boundaries are bounded Syntag editorial synthesis, not a source-declared origin claim or claim-level approval.",
              evidence_level: "L2",
              status: "editorial",
            },
            {
              claim: "Reading order and research use remain conditional on the question, ethics, access, and human claim-level review.",
              evidence_level: "L3",
              status: "proposed",
            },
          ],
        },
      },
    },
    {
      slug: "christopher-day",
      name: "Christopher Day",
      bioEn: "Education researcher whose cited work supports a bounded draft profile in teacher professional learning and development.",
      status: "draft",
      content: {
        en: {
          overview: "The University of Nottingham profile identifies Christopher Day as Professor of Education and describes work on teacher professionalism, teachers' work and lives, and professional learning and development. This draft limits its claims to that displayed profile and the cited works.",
          academic_identity: {
            discipline: "Education research",
            role: "Professor of Education as identified by the University of Nottingham profile",
            source_ids: [dayNottinghamProfile.id],
          },
          theory_relationships: [
            {
              theory_slug: "teacher-professional-development-theory",
              relationship: "Key contributor candidate",
              description: "Day's cited book is one source anchor within this plural editorial entry. The relation is bounded Syntag editorial synthesis, not a claim that Day created a single teacher-development theory.",
              source_ids: [dayNottinghamProfile.id, sources.teacherDevelopment.id, sources.teacherDevelopmentIdentity.id],
            },
          ],
          representative_works: [
            {
              title: "Developing Teachers: The Challenges of Lifelong Learning",
              work_slug: "day-1999-developing-teachers",
              contribution: "Day's authored 1999 book provides a bibliographic anchor for lifelong teacher development.",
              source_ids: [sources.teacherDevelopment.id],
            },
            {
              title: "The personal and professional selves of teachers: Stable and unstable identities",
              contribution: "Day, Alison Kington, Gordon Stobart, and Pam Sammons coauthored this specific 2006 article.",
              source_ids: [sources.teacherDevelopmentIdentity.id],
            },
          ],
          scholarly_relations: [
            {
              kind: "collaboration",
              description: "The article record identifies Christopher Day, Alison Kington, Gordon Stobart, and Pam Sammons as coauthors of the specific 2006 article; it does not establish a wider personal or research network.",
              source_ids: [sources.teacherDevelopmentIdentity.id],
            },
          ],
          attribution_boundaries: [
            "The teacher-professional-development entry is a plural editorial umbrella, not a single theory created by Day or any one scholar.",
            "Do not attribute the Guskey, Clarke and Hollingsworth, or Timperley and colleagues models or evidence synthesis to Day.",
            "Do not infer mentorship, lineage, influence, or a continuing collaboration network from the documented four-author 2006 article.",
          ],
          reading_path: [
            {
              order: 1,
              title: "University of Nottingham Christopher Day profile",
              purpose: "Check the limited academic and research-positioning claims.",
              source_id: dayNottinghamProfile.id,
            },
            {
              order: 2,
              title: "Developing Teachers",
              purpose: "Begin with Day's 1999 authored book on lifelong teacher development.",
              source_id: sources.teacherDevelopment.id,
            },
            {
              order: 3,
              title: "The personal and professional selves of teachers: Stable and unstable identities",
              purpose: "Read the four-author 2006 article while keeping its coauthorship boundary explicit.",
              source_id: sources.teacherDevelopmentIdentity.id,
            },
          ],
          sources: [dayNottinghamProfile, sources.teacherDevelopment, sources.teacherDevelopmentIdentity],
          verification: [
            {
              claim: "The University of Nottingham profile supports Day's exact identity and bounded research-profile wording on this draft.",
              evidence_level: "L1",
              source_id: dayNottinghamProfile.id,
              status: "verified",
            },
            {
              claim: "The 1999 bibliographic record supports Day's authorship of Developing Teachers.",
              evidence_level: "L1",
              source_id: sources.teacherDevelopment.id,
              status: "verified",
            },
            {
              claim: "The 2006 article record supports Day, Kington, Stobart, and Sammons as the four coauthors of the specific article.",
              evidence_level: "L1",
              source_id: sources.teacherDevelopmentIdentity.id,
              status: "verified",
            },
            {
              claim: "The plural-entry relation, key-contributor label, and attribution boundaries are bounded Syntag editorial synthesis, not a founder claim or claim-level approval.",
              evidence_level: "L2",
              status: "editorial",
            },
            {
              claim: "Reading order and research use remain conditional on the question, setting, ethics, access, and human claim-level review.",
              evidence_level: "L3",
              status: "proposed",
            },
          ],
        },
      },
    },
  ];

  const theoryScholars: SeedTheoryScholar[] = [
    {
      theorySlug: "teacher-life-history-research",
      scholarSlug: "ivor-f-goodson",
      role: "key_contributor",
      sourceUrls: [sources.lifeHistory.url],
      evidenceNotesEn: "Goodson's cited work is a source anchor for this research-tradition entry. The key-contributor label is bounded Syntag editorial synthesis, not a founder claim or claim-level approval.",
    },
    {
      theorySlug: "teacher-professional-development-theory",
      scholarSlug: "christopher-day",
      role: "key_contributor",
      sourceUrls: [sources.teacherDevelopment.url],
      evidenceNotesEn: "Day's cited book is one source anchor within this plural editorial entry. The key-contributor label is bounded Syntag editorial synthesis, not a founder claim or claim-level approval.",
    },
  ];

  return { scholars, theoryScholars };
}
