/** Weekly rotating hot topic — gives 1.5x XP bonus for battle in that topic */

export type HotTopicInfo = {
  topic: string;
  label: { zh: string; zh_TW: string; en: string };
  multiplier: number;
};

const HOT_TOPICS: { topic: string; label: { zh: string; zh_TW: string; en: string } }[] = [
  { topic: 'Algebra',    label: { zh: '代数',   zh_TW: '代數',   en: 'Algebra' } },
  { topic: 'Geometry',   label: { zh: '几何',   zh_TW: '幾何',   en: 'Geometry' } },
  { topic: 'Functions',  label: { zh: '函数',   zh_TW: '函數',   en: 'Functions' } },
  { topic: 'Statistics', label: { zh: '统计',   zh_TW: '統計',   en: 'Statistics' } },
  { topic: 'Calculus',   label: { zh: '微积分', zh_TW: '微積分', en: 'Calculus' } },
];

/** ISO week number (1-53) */
function getISOWeekNumber(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

/** Returns the hot topic for the current week */
export function getHotTopic(): HotTopicInfo {
  const week = getISOWeekNumber();
  const idx = week % HOT_TOPICS.length;
  return { ...HOT_TOPICS[idx], multiplier: 1.5 };
}
