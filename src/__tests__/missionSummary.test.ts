import { afterEach, describe, expect, it, vi } from 'vitest';

import { __resetMissionSummaryLoaderForTests, __setMissionSummaryLoaderForTests, loadGradeMissionSummaries } from '../data/missionSummaries/loader';
import { MISSION_SUMMARIES_Y7 } from '../data/missionSummaries/y7';
import { MISSION_SUMMARIES_Y8 } from '../data/missionSummaries/y8';
import { MISSION_SUMMARIES_Y9 } from '../data/missionSummaries/y9';
import { MISSION_SUMMARIES_Y10 } from '../data/missionSummaries/y10';
import { MISSION_SUMMARIES_Y11 } from '../data/missionSummaries/y11';
import { MISSION_SUMMARIES_Y12 } from '../data/missionSummaries/y12';
import { MISSIONS_Y7 } from '../data/missions/y7';
import { MISSIONS_Y8 } from '../data/missions/y8';
import { MISSIONS_Y9 } from '../data/missions/y9';
import { MISSIONS_Y10 } from '../data/missions/y10';
import { MISSIONS_Y11 } from '../data/missions/y11';
import { MISSIONS_Y12 } from '../data/missions/y12';
import type { CompletedMissions } from '../types';
import { buildMissionSummaryMap, resolveAssignmentMissionItems, toMissionSummaries } from '../utils/missionSummary';

const CASES = [
  ['Y7', MISSIONS_Y7, MISSION_SUMMARIES_Y7],
  ['Y8', MISSIONS_Y8, MISSION_SUMMARIES_Y8],
  ['Y9', MISSIONS_Y9, MISSION_SUMMARIES_Y9],
  ['Y10', MISSIONS_Y10, MISSION_SUMMARIES_Y10],
  ['Y11', MISSIONS_Y11, MISSION_SUMMARIES_Y11],
  ['Y12', MISSIONS_Y12, MISSION_SUMMARIES_Y12],
] as const;

afterEach(() => {
  __resetMissionSummaryLoaderForTests();
});

describe('mission summaries', () => {
  for (const [label, missions, summaries] of CASES) {
    it(`matches generated summary data for ${label}`, () => {
      expect(summaries).toEqual(toMissionSummaries([...missions]));
    });
  }

  it('retries a grade load after a cached failure', async () => {
    const failingThenPassingLoader = vi.fn<() => Promise<typeof MISSION_SUMMARIES_Y7>>()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue(MISSION_SUMMARIES_Y7);

    __setMissionSummaryLoaderForTests(7, failingThenPassingLoader);

    await expect(loadGradeMissionSummaries(7)).rejects.toThrow('offline');
    await expect(loadGradeMissionSummaries(7)).resolves.toEqual(MISSION_SUMMARIES_Y7);
    expect(failingThenPassingLoader).toHaveBeenCalledTimes(2);
  });

  it('keeps assignment items visible when mission summaries are temporarily missing', () => {
    const existingMissionId = MISSION_SUMMARIES_Y7[0].id;
    const completedMissions: CompletedMissions = {
      [String(existingMissionId)]: { green: false, amber: false, red: false },
      '9999': { green: true, amber: false, red: false },
    };
    const missionMap = buildMissionSummaryMap(MISSION_SUMMARIES_Y7.slice(0, 2));

    const items = resolveAssignmentMissionItems([existingMissionId, 9999], missionMap, completedMissions);

    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      id: existingMissionId,
      missingSummary: false,
      isDone: false,
    });
    expect(items[1]).toMatchObject({
      id: 9999,
      missingSummary: true,
      isDone: true,
      title: { zh: '关卡 #9999', en: 'Mission #9999' },
    });
  });
});
