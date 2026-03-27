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

const CROSS_CHAPTER_PREREQS: Record<string, string[]> = {
  // Algebra needs basic number skills
  '2.1': ['1.6'],
  // Coordinate geometry needs algebra basics
  '3.1': ['2.1'],
  // Trigonometry needs geometry + Pythagoras
  '6.1': ['4.6'],
  // Mensuration needs geometry basics
  '5.2': ['4.1'],
  // Transformations need coordinate geometry
  '7.1': ['3.1'],

  // ── Additional cross-chapter dependencies (complete the graph) ──

  // Indices II (ch2) builds on Indices I (ch1) — different chapters, same concept arc
  '2.4': ['1.7'],
  // Proportion (ch2) needs Ratio/proportion foundation from ch1
  '2.8': ['1.11'],
  // Similarity & congruency (ch4) relies on ratio as scale factor
  '4.4': ['1.11'],
  // Vector magnitude (ch7) uses Pythagoras directly (ch6)
  '7.3': ['6.1'],
  // Probability (ch8) is expressed as fractions/decimals — ch1 foundation
  '8.1': ['1.4'],
  // Scatter diagrams (ch9) require reading coordinate axes — ch3
  '9.5': ['3.1'],
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
function buildMissionTopicMap(missions: Mission[]): Map<string, number[]> {
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
