/**
 * Seed script: push MISSIONS data into gl_missions table with KP mappings.
 * Run: npm run seed
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jjjigohjvmyewasmmmyf.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqamlnb2hqdm15ZXdhc21tbXlmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTM5ODM0NiwiZXhwIjoyMDg2OTc0MzQ2fQ.ir5BEY5ocILl9tmnq7Nd-g1R3qOKnAxJOASqsKnbTps';

const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// KP mapping: mission ID → ExamHub KP ID + section
// Based on plan: 三国故事线 × KP 知识树
const KP_MAP: Record<number, { kpId: string; sectionId: string }> = {
  // Year 7 — Foundations
  711: { kpId: 'kp-2.1', sectionId: 'algebra' },      // Simple equations
  712: { kpId: 'kp-2.1', sectionId: 'algebra' },
  721: { kpId: 'kp-1.10', sectionId: 'number' },     // Ratio & proportion
  722: { kpId: 'kp-1.10', sectionId: 'number' },
  731: { kpId: 'kp-4.1', sectionId: 'geometry' },     // Angles
  732: { kpId: 'kp-4.1', sectionId: 'geometry' },
  733: { kpId: 'kp-4.1', sectionId: 'geometry' },

  // Year 8 — Expansion
  811: { kpId: 'kp-3.1', sectionId: 'functions' },    // Linear functions
  812: { kpId: 'kp-3.1', sectionId: 'functions' },
  813: { kpId: 'kp-3.1', sectionId: 'functions' },
  821: { kpId: 'kp-5.1', sectionId: 'geometry' },     // Area
  822: { kpId: 'kp-5.2', sectionId: 'geometry' },     // Volume
  823: { kpId: 'kp-5.1', sectionId: 'geometry' },
  831: { kpId: 'kp-1.12', sectionId: 'number' },      // Percentage
  832: { kpId: 'kp-1.12', sectionId: 'number' },
  841: { kpId: 'kp-9.3', sectionId: 'statistics' },   // Mean/Median
  842: { kpId: 'kp-9.3', sectionId: 'statistics' },

  // Year 9 — Strategy
  911: { kpId: 'kp-1.6', sectionId: 'number' },       // Indices
  912: { kpId: 'kp-1.6', sectionId: 'number' },
  913: { kpId: 'kp-1.6', sectionId: 'number' },
  921: { kpId: 'kp-4.6', sectionId: 'geometry' },     // Pythagoras
  922: { kpId: 'kp-6.1', sectionId: 'geometry' },     // Trigonometry
  923: { kpId: 'kp-4.6', sectionId: 'geometry' },
  931: { kpId: 'kp-4.5', sectionId: 'geometry' },     // Similarity
  932: { kpId: 'kp-4.5', sectionId: 'geometry' },
  941: { kpId: 'kp-1.10', sectionId: 'number' },      // Ratio
  942: { kpId: 'kp-1.10', sectionId: 'number' },

  // Year 10 — Complexity
  1011: { kpId: 'kp-2.10', sectionId: 'algebra' },    // Quadratic functions
  1012: { kpId: 'kp-2.10', sectionId: 'algebra' },
  1013: { kpId: 'kp-2.10', sectionId: 'algebra' },
  1021: { kpId: 'kp-2.5', sectionId: 'algebra' },     // Simultaneous equations
  1022: { kpId: 'kp-2.5', sectionId: 'algebra' },
  1023: { kpId: 'kp-2.5', sectionId: 'algebra' },
  1031: { kpId: 'kp-8.1', sectionId: 'statistics' },  // Probability
  1032: { kpId: 'kp-8.1', sectionId: 'statistics' },
  1033: { kpId: 'kp-8.1', sectionId: 'statistics' },
  1041: { kpId: 'kp-6.1', sectionId: 'geometry' },    // Trigonometry
  1042: { kpId: 'kp-6.1', sectionId: 'geometry' },
  1043: { kpId: 'kp-6.1', sectionId: 'geometry' },
  1051: { kpId: 'kp-5.1', sectionId: 'geometry' },    // Circle
  1052: { kpId: 'kp-5.1', sectionId: 'geometry' },
  1053: { kpId: 'kp-5.1', sectionId: 'geometry' },
  1061: { kpId: 'kp-9.3', sectionId: 'statistics' },  // Statistics
  1062: { kpId: 'kp-9.3', sectionId: 'statistics' },
  1071: { kpId: 'kp-5.2', sectionId: 'geometry' },    // Volume
  1072: { kpId: 'kp-5.1', sectionId: 'geometry' },    // Surface area

  // Year 11 — Advanced
  1111: { kpId: 'kp-2.13', sectionId: 'algebra' },    // Differentiation
  1112: { kpId: 'kp-2.13', sectionId: 'algebra' },
  1121: { kpId: 'kp-2.13', sectionId: 'algebra' },    // Integration
  1122: { kpId: 'kp-2.13', sectionId: 'algebra' },
  1131: { kpId: 'kp-2.7', sectionId: 'algebra' },     // Sequences

  // Year 12 — Final
  1211: { kpId: 'kp-2.13', sectionId: 'algebra' },
  1221: { kpId: 'kp-8.1', sectionId: 'statistics' },
};

// Import missions from compiled source
import { MISSIONS } from '../src/data/missions';

async function seed() {
  console.log(`Seeding ${MISSIONS.length} missions...`);

  // Delete existing and re-insert
  const { error: delErr } = await sb.from('gl_missions').delete().gte('id', 0);
  if (delErr) console.warn('Delete warning:', delErr.message);

  const rows = MISSIONS.map(m => {
    const kp = KP_MAP[m.id];
    return {
      id: m.id,
      grade: m.grade,
      unit_id: m.unitId,
      unit_order: m.order,
      unit_title: m.unitTitle,
      title: m.title,
      story: m.story,
      description: m.description,
      topic: m.topic,
      question_type: m.type,
      difficulty: m.difficulty,
      reward: m.reward,
      data: m.data,
      secret: m.secret,
      tutorial_steps: m.tutorialSteps || null,
      kp_id: kp?.kpId || null,
      section_id: kp?.sectionId || null,
      is_active: true,
    };
  });

  // Insert in batches of 20
  for (let i = 0; i < rows.length; i += 20) {
    const batch = rows.slice(i, i + 20);
    const { error } = await sb.from('gl_missions').insert(batch);
    if (error) {
      console.error(`Batch ${i / 20 + 1} failed:`, error.message);
    } else {
      console.log(`  Batch ${i / 20 + 1}: ${batch.length} missions inserted`);
    }
  }

  // Verify
  const { count } = await sb.from('gl_missions').select('*', { count: 'exact', head: true });
  console.log(`\nDone! Total missions in DB: ${count}`);

  // Also update local missions with kpId for future reference
  const kpCount = Object.keys(KP_MAP).length;
  console.log(`KP mappings applied: ${kpCount}/${MISSIONS.length}`);
}

seed().catch(console.error);
