// Tech Tree — War Thunder-style branching knowledge progression
// Maps CIE 0580 chapters (9 branches) with topic nodes, prerequisites, and corruption overlay

import type { Mission, CompletedMissions } from '../types';
import type { Chapter, Topic } from '../data/curriculum/kp-registry';
import { CHAPTERS } from '../data/curriculum/kp-registry';
import { hasAnyPracticeCompletion } from './completionState';
import type { MistakeRecord } from './errorMemory';
import { TECH_TREE } from './gameBalance';
import { getDominantPattern } from './errorMemory';
import type { ErrorType } from './diagnoseError';

// ── Types ──

export type TechNodeStatus = 'locked' | 'available' | 'researching' | 'unlocked' | 'corrupted' | 'at_risk';

export type TechNodeState = {
  topicId: string;
  status: TechNodeStatus;
  progress: number;         // missions completed in this topic
  total: number;            // total missions mapped to this topic
  corruptionPattern?: ErrorType | null;
  upstreamCorrupted?: string | null;  // topicId of the corrupted upstream node causing at_risk
  missionIds: number[];     // missions linked to this topic
  maxErrorCount?: number;   // highest error count across missions in this topic (for corruption progress)
};

export type TechBranch = {
  chapterId: string;
  title: string;
  titleZh: string;
  icon: string;
  nodes: TechNodeState[];
  totalUnlocked: number;
  totalNodes: number;
};

// ── Chapter icons ──

const CHAPTER_ICONS: Record<string, string> = {
  ch1: '🔢', // Number
  ch2: '📐', // Algebra
  ch3: '📊', // Coordinate Geometry
  ch4: '🔷', // Geometry
  ch5: '📏', // Mensuration
  ch6: '📐', // Trigonometry
  ch7: '🔄', // Transformations
  ch8: '🎲', // Statistics & Probability
  ch9: '📈', // Further topics
};

// ── Prerequisite mapping between topics ──
// Topics in the same chapter are sequential (later topics require earlier ones)
// Cross-chapter prereqs are defined here

// ═══════════════════════════════════════════════════════════════════════
// CROSS-CHAPTER PREREQUISITE GRAPH — CIE 0580 Complete Knowledge Network
// ═══════════════════════════════════════════════════════════════════════
// Each entry: topicId → [prereq topicIds]
// Within-chapter linear ordering (topic N → N-1) is handled separately.
// This map captures ALL non-linear dependencies:
//   - Cross-chapter links (e.g. Algebra needs Number)
//   - Within-chapter skip links (e.g. 1.17 needs 1.7, not just 1.16)
//
// Audit date: 2026-03-27 | Source: CIE 0580 (2025) syllabus + mathematical logic
// ═══════════════════════════════════════════════════════════════════════

const CROSS_CHAPTER_PREREQS: Record<string, string[]> = {
  // ── Chapter 1: Number (internal skip links) ──
  // 1.1-1.6 are linearly sequential (default behavior)
  '1.7':  ['1.3'],             // Indices I ← Powers & roots (x² concept)
  '1.8':  ['1.7'],             // Standard form ← Indices (10ⁿ notation)
  '1.10': ['1.9'],             // Limits of accuracy ← Estimation (rounding)
  '1.11': ['1.4'],             // Ratio & proportion ← Fractions (simplifying ratios = simplifying fractions)
  '1.12': ['1.11'],            // Rates ← Ratio (speed = distance:time ratio)
  '1.13': ['1.4'],             // Percentage applications ← Fractions (% = fraction of 100)
  '1.16': ['1.13', '1.11'],    // Money ← Percentages (interest) + Ratio (exchange rates)
  '1.17': ['1.7', '1.13'],     // Exponential growth ← Indices (aⁿ) + Percentages (compound %)
  '1.18': ['1.3', '1.7'],      // Surds ← Powers & roots (√) + Indices (rational exponents)

  // ── Chapter 2: Algebra ──
  '2.1':  ['1.6'],             // Intro to algebra ← Four operations
  '2.3':  ['2.2', '1.4'],     // Algebraic fractions ← Manipulation + Fractions (common denominator)
  '2.4':  ['1.7', '2.1'],     // Indices II ← Indices I + Algebra intro (algebraic bases)
  '2.5':  ['2.2'],            // Equations ← Manipulation (rearranging)
  '2.7':  ['2.1'],            // Sequences ← Algebra intro (nth term expressions)
  '2.8':  ['1.11', '2.5'],    // Proportion ← Ratio + Equations (y = kx² solving)
  '2.9':  ['3.1', '1.12'],    // Practical graphs ← Coordinates + Rates (distance-time, speed-time)
  '2.10': ['3.2', '2.5'],     // Function graphs ← Drawing graphs + Equations (y = ax² + bx + c)
  '2.11': ['2.10', '2.5'],    // Sketching curves ← Function graphs + Equations (factoring for roots)
  '2.12': ['3.3', '2.4'],     // Differentiation ← Gradient + Indices II (power rule: nxⁿ⁻¹)
  '2.13': ['2.5', '2.2'],     // Functions ← Equations (inverse) + Manipulation (composite)

  // ── Chapter 3: Coordinate Geometry ──
  '3.1':  ['2.1'],            // Coordinates ← Algebra intro (substitution into y = ...)
  '3.2':  ['3.1', '2.5'],     // Drawing linear graphs ← Coordinates + Equations (solving for y)
  '3.3':  ['3.2', '1.4'],     // Gradient ← Drawing graphs + Fractions (rise/run)
  '3.4':  ['3.1', '1.3'],     // Length & midpoint ← Coordinates + Powers & roots (√ for distance)
  '3.5':  ['3.3', '2.5'],     // Line equations ← Gradient + Equations (y = mx + c rearranging)
  '3.6':  ['3.5'],            // Parallel lines ← Line equations (same gradient)
  '3.7':  ['3.6', '1.4'],     // Perpendicular lines ← Parallel lines + Fractions (neg. reciprocal)

  // ── Chapter 4: Geometry ──
  // 4.1 Geometrical terms — foundation, no math prereqs
  // 4.2 Constructions ← 4.1 (linear default)
  '4.3':  ['1.11'],            // Scale drawings ← Ratio (map scale 1:50000)
  '4.4':  ['1.11'],            // Similarity & congruence ← Ratio (scale factor)
  // 4.5 Symmetry ← 4.1 (via linear chain)
  '4.6':  ['2.5'],             // Angles ← Equations (forming & solving angle equations)
  '4.7':  ['4.6'],             // Circle theorems ← Angles (angle at centre, etc.)
  '4.8':  ['4.2', '4.7'],      // Constructions & loci ← Constructions + Circle theorems

  // ── Chapter 5: Mensuration ──
  '5.1':  ['1.4'],             // Units ← Fractions/decimals (unit conversions)
  '5.2':  ['4.1', '1.6'],     // Area & perimeter ← Geometry terms + Four operations
  '5.3':  ['5.2', '1.11'],    // Circles, arcs, sectors ← Area + Ratio (θ/360 fraction)
  '5.4':  ['5.2', '5.3'],     // Surface area & volume ← Area + Circles (cylinder = circle + rect)
  '5.5':  ['5.2', '5.3'],     // Compound shapes ← Area + Circles

  // ── Chapter 6: Trigonometry ──
  '6.1':  ['4.6', '1.3'],     // Pythagoras ← Angles (right angle) + Powers & roots (√)
  '6.2':  ['6.1', '1.4'],     // SOHCAHTOA ← Pythagoras + Fractions (trig ratios)
  '6.3':  ['6.2', '1.18'],    // Exact trig values ← SOHCAHTOA + Surds (√2, √3)
  '6.4':  ['6.2', '2.10'],    // Trig graphs ← SOHCAHTOA + Function graphs (y = sin x)
  '6.5':  ['6.2', '5.2'],     // Sine/cosine rule ← SOHCAHTOA + Area (½ab sinC)
  '6.6':  ['6.2', '5.4'],     // 3D trig ← SOHCAHTOA + Surface area/volume (3D shapes)

  // ── Chapter 7: Transformations & Vectors ──
  '7.1':  ['3.1', '4.6'],     // Transformations ← Coordinates + Angles (rotation)
  '7.2':  ['3.1', '2.1'],     // Vectors 2D ← Coordinates + Algebra (vector notation a + b)
  '7.3':  ['7.2', '6.1'],     // Vector magnitude ← Vectors + Pythagoras (|v| = √(x²+y²))
  '7.4':  ['7.2', '2.2'],     // Vector geometry ← Vectors + Manipulation (OA + AB = OB)

  // ── Chapter 8: Probability ──
  '8.1':  ['1.4'],             // Intro probability ← Fractions/decimals/percentages
  '8.2':  ['8.1'],             // Relative frequency ← Intro probability
  '8.3':  ['8.1', '1.4'],     // Combined events ← Intro prob + Fractions (P(A)×P(B))
  '8.4':  ['8.3'],             // Conditional probability ← Combined events

  // ── Chapter 9: Statistics ──
  '9.1':  ['1.6'],             // Classifying data ← Four operations
  '9.3':  ['9.1', '1.6'],     // Averages ← Data classification + Operations (mean = sum/n)
  '9.4':  ['9.1', '1.4'],     // Charts ← Data + Fractions (pie chart sectors)
  '9.5':  ['3.1', '9.1'],     // Scatter diagrams ← Coordinates + Data
  '9.6':  ['9.3', '9.4'],     // Cumulative frequency ← Averages + Charts (reading graphs)
  '9.7':  ['9.4', '1.11'],    // Histograms ← Charts + Ratio (freq density = freq ÷ width)
};

/** Get prerequisite topic IDs for a given topic */
function getTopicPrereqs(chapter: Chapter, topicIndex: number, topicId: string): string[] {
  const prereqs: string[] = [];
  // Same chapter: previous topic is a prereq (if exists)
  if (topicIndex > 0) {
    prereqs.push(chapter.topics[topicIndex - 1].id);
  }
  // Cross-chapter prereqs
  if (CROSS_CHAPTER_PREREQS[topicId]) {
    prereqs.push(...CROSS_CHAPTER_PREREQS[topicId]);
  }
  return prereqs;
}

// ── Core computation ──

/** Build mission-to-topic mapping from missions array */
export function buildMissionTopicMap(missions: Mission[]): Map<string, number[]> {
  const map = new Map<string, number[]>();

  for (const m of missions) {
    if (!m.kpId) continue;
    // Extract topic from kpId: "kp-2.5-06" → "2.5"
    const match = m.kpId.match(/^kp-(\d+\.\d+)/);
    if (!match) continue;
    const topicId = match[1];
    if (!map.has(topicId)) map.set(topicId, []);
    map.get(topicId)!.push(m.id);
  }

  return map;
}

/** Check if a topic is "unlocked" (enough missions completed) */
function isTopicUnlocked(
  missionIds: number[],
  completedMissions: CompletedMissions,
): boolean {
  if (missionIds.length === 0) return false;
  const completed = missionIds.filter(id =>
    hasAnyPracticeCompletion(completedMissions[String(id)])
  ).length;
  return completed >= missionIds.length;
}

/** Check if any prereq topic is not unlocked */
function arePrereqsMet(
  prereqTopicIds: string[],
  topicStates: Map<string, TechNodeState>,
): boolean {
  if (prereqTopicIds.length === 0) return true;
  return prereqTopicIds.every(pid => {
    const state = topicStates.get(pid);
    if (!state) return true; // topic not in game = no gate
    return state.status === 'unlocked' || state.status === 'corrupted';
  });
}

/** Check if topic has corruption (high error rate on any mission) */
function getTopicCorruption(
  missionIds: number[],
  mistakes: Record<string, MistakeRecord>,
): ErrorType | null {
  let maxErrors = 0;
  let dominantPattern: ErrorType | null = null;

  for (const mid of missionIds) {
    const rec = mistakes[String(mid)];
    if (rec && rec.count >= TECH_TREE.CORRUPTION_ERROR_THRESHOLD) {
      if (rec.count > maxErrors) {
        maxErrors = rec.count;
        dominantPattern = getDominantPattern(rec);
      }
    }
  }

  return dominantPattern;
}

/** Compute the full tech tree state */
export function computeTechTree(
  missions: Mission[],
  completedMissions: CompletedMissions,
  mistakes: Record<string, MistakeRecord> = {},
): TechBranch[] {
  const missionTopicMap = buildMissionTopicMap(missions);

  // First pass: compute raw states without prereq checks
  const topicStates = new Map<string, TechNodeState>();

  for (const chapter of CHAPTERS) {
    for (const topic of chapter.topics) {
      const missionIds = missionTopicMap.get(topic.id) ?? [];
      const completed = missionIds.filter(id =>
        hasAnyPracticeCompletion(completedMissions[String(id)])
      ).length;
      const total = missionIds.length;

      let status: TechNodeStatus;
      if (total === 0) {
        status = 'locked'; // no missions mapped yet
      } else if (completed >= total) {
        status = 'unlocked';
      } else if (completed > 0) {
        status = 'researching';
      } else {
        status = 'locked';
      }

      // Check corruption overlay for unlocked/researching nodes
      const corruption = (status === 'unlocked' || status === 'researching')
        ? getTopicCorruption(missionIds, mistakes)
        : null;

      if (corruption && status === 'unlocked') {
        status = 'corrupted';
      }

      // Track max error count across missions for corruption-approach warning
      const maxErrorCount = missionIds.reduce((max, mid) => {
        const rec = mistakes[String(mid)];
        return rec ? Math.max(max, rec.count) : max;
      }, 0);

      topicStates.set(topic.id, {
        topicId: topic.id,
        status,
        progress: completed,
        total,
        corruptionPattern: corruption,
        missionIds,
        maxErrorCount,
      });
    }
  }

  // Second pass: apply prereq gating (locked → available if prereqs met)
  for (const chapter of CHAPTERS) {
    for (let i = 0; i < chapter.topics.length; i++) {
      const topic = chapter.topics[i];
      const state = topicStates.get(topic.id)!;
      if (state.status === 'locked' && state.total > 0) {
        const prereqs = getTopicPrereqs(chapter, i, topic.id);
        if (arePrereqsMet(prereqs, topicStates)) {
          state.status = 'available';
        }
      }
    }
  }

  // Third pass: downstream impact — corrupted nodes make dependents "at_risk"
  for (const chapter of CHAPTERS) {
    for (let i = 0; i < chapter.topics.length; i++) {
      const topic = chapter.topics[i];
      const state = topicStates.get(topic.id)!;
      if (state.status === 'corrupted') {
        // Mark all same-chapter downstream nodes as at_risk
        for (let j = i + 1; j < chapter.topics.length; j++) {
          const downstream = topicStates.get(chapter.topics[j].id)!;
          // Only affect non-locked, non-corrupted nodes.
          // Design choice: unlocked nodes keep their status (completed skills aren't penalized)
          // but still record the upstream corruption for info display.
          if (downstream.status === 'available' || downstream.status === 'researching' || downstream.status === 'unlocked') {
            downstream.upstreamCorrupted = topic.id;
            // Unlocked = already mastered, so only mark at_risk for in-progress/available nodes
            if (downstream.status !== 'unlocked') {
              downstream.status = 'at_risk';
              // Propagate the upstream corruption pattern so UI can show relevant repair hints
              downstream.corruptionPattern = state.corruptionPattern;
            }
          }
        }
        // Also check cross-chapter dependents
        for (const [depTopicId, prereqs] of Object.entries(CROSS_CHAPTER_PREREQS)) {
          if (prereqs.includes(topic.id)) {
            const depState = topicStates.get(depTopicId);
            if (depState && (depState.status === 'available' || depState.status === 'researching')) {
              depState.upstreamCorrupted = topic.id;
              depState.status = 'at_risk';
              depState.corruptionPattern = state.corruptionPattern;
            }
          }
        }
      }
    }
  }

  // Build branches — only include chapters that have at least one mission mapped
  // (prevents Y7 students from seeing Y8+ chapters with no missions as empty locked trees)
  return CHAPTERS
    .map(chapter => {
      const nodes = chapter.topics.map(t => topicStates.get(t.id)!);
      const mappedNodes = nodes.filter(n => n.total > 0);
      if (mappedNodes.length === 0) return null; // skip chapters with no missions
      const totalUnlocked = nodes.filter(n => n.status === 'unlocked' || n.status === 'corrupted').length;
      return {
        chapterId: chapter.id,
        title: chapter.title,
        titleZh: chapter.titleZh,
        icon: CHAPTER_ICONS[chapter.id] ?? '📖',
        nodes: mappedNodes, // only show nodes with mapped missions
        totalUnlocked,
        totalNodes: mappedNodes.length,
      };
    })
    .filter((b): b is TechBranch => b !== null);
}

/** Get a flat list of all topics with their chapter info */
export function getTopicInfo(topicId: string): { chapter: Chapter; topic: Topic; topicIndex: number } | null {
  for (const ch of CHAPTERS) {
    const idx = ch.topics.findIndex(t => t.id === topicId);
    if (idx !== -1) return { chapter: ch, topic: ch.topics[idx], topicIndex: idx };
  }
  return null;
}

/** Get missions for a specific topic */
export function getTopicMissions(topicId: string, missions: Mission[]): Mission[] {
  return missions.filter(m => {
    if (!m.kpId) return false;
    const match = m.kpId.match(/^kp-(\d+\.\d+)/);
    return match && match[1] === topicId;
  });
}
