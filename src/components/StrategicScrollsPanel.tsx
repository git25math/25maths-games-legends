/**
 * StrategicScrollsPanel — 兵法宝典 (7 Scrolls of Strategy)
 *
 * An in-game guidebook presented as sealed wisdom scrolls (锦囊妙计).
 * Each scroll reveals a strategic insight about how to master the game.
 * Accessible from MapScreen header bar.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookMarked, ChevronLeft, ChevronRight, X, ScrollText } from 'lucide-react';
import type { Language } from '../types';

// ═══════════════════════════════════════════════════════════════
// Scroll Content — 7 策略锦囊
// ═══════════════════════════════════════════════════════════════

type Scroll = {
  id: number;
  titleZh: string;
  titleEn: string;
  titleTw: string;
  icon: string;
  color: string;
  senderZh: string;  // who sends this scroll (Three Kingdoms character)
  senderEn: string;
  senderTw: string;
  bodyZh: string[];   // bullet points in zh
  bodyEn: string[];
  bodyTw: string[];
  quoteZh: string;    // closing quote
  quoteEn: string;
  quoteTw: string;
};

const SCROLLS: Scroll[] = [
  {
    id: 1,
    titleZh: '修炼之道',
    titleEn: 'The Way of Practice',
    titleTw: '修煉之道',
    icon: '⚔️',
    color: 'from-emerald-900/60 to-teal-900/60',
    senderZh: '赵云 将军',
    senderEn: 'General Zhao Yun',
    senderTw: '趙雲 將軍',
    bodyZh: [
      '先入"练习模式"，熟悉题型再"闯关"——千万不要反过来！',
      '练习有三阶段：绿色（巩固）→ 琥珀（理解）→ 红色（冲刺）。绿色时优先看解题例题，红色时挑战生成新题。',
      '完成一关练习后，装备耐久会自动提升。维持装备满血=战斗力最大化。',
      '每完成3题练习可修复一件受损装备。保持装备健康是长期胜率的关键。',
    ],
    bodyEn: [
      'Always enter Practice Mode to learn the question type BEFORE launching a Battle — never the reverse!',
      'Practice has 3 phases: Green (consolidate) → Amber (understand) → Red (push limits). At Green, study examples; at Red, generate new challenges.',
      'Completing practice automatically boosts your equipment durability. Full durability = maximum combat power.',
      'Every 3 practice questions repairs one damaged piece of equipment. Keeping gear healthy is the key to long-term win rates.',
    ],
    bodyTw: [
      '先進「練習模式」熟悉題型再「闖關」——切勿反過來！',
      '練習有三階段：綠色（鞏固）→ 琥珀（理解）→ 紅色（衝刺）。綠色時優先看解題範例，紅色時挑戰生成新題。',
      '完成一關練習後，裝備耐久會自動提升。維持裝備滿血=戰鬥力最大化。',
      '每完成3題練習可修復一件受損裝備。保持裝備健康是長期勝率的關鍵。',
    ],
    quoteZh: '疾而不迷，动而不乱——赵子龙',
    quoteEn: 'Swift yet steady, active yet clear — Zhao Zilong',
    quoteTw: '疾而不迷，動而不亂——趙子龍',
  },
  {
    id: 2,
    titleZh: '装备养护之道',
    titleEn: 'The Art of Equipment',
    titleTw: '裝備養護之道',
    icon: '🛡️',
    color: 'from-amber-900/60 to-orange-900/60',
    senderZh: '诸葛亮 军师',
    senderEn: 'Advisor Zhuge Liang',
    senderTw: '諸葛亮 軍師',
    bodyZh: [
      '每个已通关的节点都有一件"装备"，耐久度反映你对这个知识点的掌握新鲜度。',
      '装备耐久随时间自然衰减（7天→14天→30天间隔）。久不复习，装备锈蚀，战力下降。',
      '地图顶部的"腐败告警"横幅会提醒你哪些装备急需维修——每天关注一次！',
      '使用道具（背包中的修复卷轴）可以一键修复装备，无需完成练习题。建议留到紧急情况使用。',
    ],
    bodyEn: [
      'Every completed node has an "equipment" piece whose durability reflects how fresh your mastery of that topic is.',
      'Equipment durability naturally decays over time (7→14→30 day intervals). Neglect = rust = reduced combat power.',
      'The "Corruption Alert" banner at the top of the map tells you which equipment urgently needs repair — check it daily!',
      'Repair items (scrolls in your Backpack) can instantly fix equipment without practice questions. Save them for emergencies.',
    ],
    bodyTw: [
      '每個已通關的節點都有一件「裝備」，耐久度反映你對這個知識點的掌握新鮮度。',
      '裝備耐久隨時間自然衰減（7天→14天→30天間隔）。久不複習，裝備鏽蝕，戰力下降。',
      '地圖頂部的「腐敗告警」橫幅會提醒你哪些裝備急需維修——每天關注一次！',
      '使用道具（背包中的修復卷軸）可以一鍵修復裝備，無需完成練習題。建議留到緊急情況使用。',
    ],
    quoteZh: '知彼知己，百战不殆——孔明',
    quoteEn: 'Know yourself and your enemy, and you shall win every battle — Kongming',
    quoteTw: '知彼知己，百戰不殆——孔明',
  },
  {
    id: 3,
    titleZh: '错误回望之道',
    titleEn: 'The Wisdom of Mistakes',
    titleTw: '錯誤回望之道',
    icon: '🔍',
    color: 'from-rose-900/60 to-pink-900/60',
    senderZh: '司马懿 谋士',
    senderEn: 'Strategist Sima Yi',
    senderTw: '司馬懿 謀士',
    bodyZh: [
      '每次答错，系统会自动识别你的错误类型（符号错误/方法错误/计算错误等），并存入"错误记忆"。',
      '闯关失败后，点击"🔍 诊断问题"进入科技树，可以看到哪个节点被"腐败"（连续失败标红）。',
      '科技树中的节点颜色：绿色=健康，琥珀=需关注，红色=CRITICAL（立即修复！）。',
      '遇到红色节点，先追溯前置知识点（依赖线追到源头），从基础重修，才能真正突破。',
    ],
    bodyEn: [
      'Every wrong answer is automatically categorised (sign error / method error / calculation error etc.) and stored in your "Error Memory".',
      'After a battle failure, tap "🔍 Diagnose" to enter the Tech Tree and see which nodes are "corrupted" (red = repeated failures).',
      'Node colours in the Tech Tree: Green = healthy, Amber = attention needed, Red = CRITICAL (fix immediately!).',
      'For red nodes, trace back along the dependency lines to find the root prerequisite — rebuild from the foundation up.',
    ],
    bodyTw: [
      '每次答錯，系統會自動識別你的錯誤類型（符號錯誤/方法錯誤/計算錯誤等），並存入「錯誤記憶」。',
      '闖關失敗後，點擊「🔍 診斷問題」進入科技樹，可以看到哪個節點被「腐敗」（連續失敗標紅）。',
      '科技樹中的節點顏色：綠色=健康，琥珀=需關注，紅色=CRITICAL（立即修復！）。',
      '遇到紅色節點，先追溯前置知識點（依賴線追到源頭），從基礎重修，才能真正突破。',
    ],
    quoteZh: '以错为镜，方知真缺——仲达',
    quoteEn: 'Let your mistakes be a mirror — only then can you see your true gaps — Zhongda',
    quoteTw: '以錯為鏡，方知真缺——仲達',
  },
  {
    id: 4,
    titleZh: '技能卡择要',
    titleEn: 'Choosing Your Skill Card',
    titleTw: '技能卡擇要',
    icon: '🃏',
    color: 'from-purple-900/60 to-violet-900/60',
    senderZh: '庞统 凤雏',
    senderEn: 'Pang Tong, the Young Phoenix',
    senderTw: '龐統 鳳雛',
    bodyZh: [
      '每次闯关前可从三张技能卡中选一张：🛡️护盾（免一次错误）/ ⚡双倍（答对得双倍分）/ 🔮透视（提前看答案范围）。',
      '护盾策略：遇到生疏或高难度关卡时选护盾，容错率+1，大大降低失败风险。',
      '双倍策略：自信满满、刷新纪录时选双倍，单局得分倍增。适合连胜追击。',
      '透视策略：新题型或拿不准答案范围时选透视，提前看到参考范围后更有底气。',
    ],
    bodyEn: [
      'Before each battle, choose one of three Skill Cards: 🛡️ Shield (absorb one mistake) / ⚡ Double (double score on correct answers) / 🔮 Oracle (preview answer range).',
      'Shield strategy: pick it for unfamiliar or high-difficulty nodes. +1 error tolerance dramatically reduces failure risk.',
      'Double strategy: pick it when you are confident and chasing a high score. Score multiplier stacks with streaks.',
      'Oracle strategy: pick it for new question types or when you are unsure of the answer range — the preview gives you a strong starting anchor.',
    ],
    bodyTw: [
      '每次闖關前可從三張技能卡中選一張：🛡️護盾（免一次錯誤）/ ⚡雙倍（答對得雙倍分）/ 🔮透視（提前看答案範圍）。',
      '護盾策略：遇到生疏或高難度關卡時選護盾，容錯率+1，大大降低失敗風險。',
      '雙倍策略：自信滿滿、刷新紀錄時選雙倍，單局得分倍增。適合連勝追擊。',
      '透視策略：新題型或拿不準答案範圍時選透視，提前看到參考範圍後更有底氣。',
    ],
    quoteZh: '将将之道，在乎知人善用——凤雏',
    quoteEn: 'The art of commanding commanders lies in knowing who to deploy when — Young Phoenix',
    quoteTw: '將將之道，在乎知人善用——鳳雛',
  },
  {
    id: 5,
    titleZh: '知识链之道',
    titleEn: 'The Knowledge Chain',
    titleTw: '知識鏈之道',
    icon: '🌿',
    color: 'from-cyan-900/60 to-sky-900/60',
    senderZh: '荀彧 谋士',
    senderEn: 'Strategist Xun Yu',
    senderTw: '荀彧 謀士',
    bodyZh: [
      '科技树中的连接线代表"前置依赖"——掌握A才能真正学会B。看到箭头就是学习顺序。',
      '卡关时，不要死磕当前节点。顺着依赖线往回找：往往根因在更早的基础知识。',
      '每日任务会智能推送与你当前弱点相关的前置节点，不要跳过！它们是突破卡点的钥匙。',
      '知识链覆盖全部Y7-Y12：打好Y7代数基础，Y9方程才能游刃有余；Y9三角打好，Y11才能飞起来。',
    ],
    bodyEn: [
      'Lines in the Tech Tree represent "prerequisites" — master A before you can truly learn B. Arrows show the learning order.',
      'When stuck, do NOT brute-force the current node. Trace the dependency lines backward: the root cause is usually in an earlier foundational skill.',
      'Daily quests intelligently push prerequisite nodes related to your current weak spots. Do not skip them — they are the keys to breaking through.',
      'The knowledge chain spans Y7–Y12: build strong Y7 algebra foundations, and Y9 equations will feel effortless; nail Y9 trigonometry and Y11 becomes a breeze.',
    ],
    bodyTw: [
      '科技樹中的連接線代表「前置依賴」——掌握A才能真正學會B。看到箭頭就是學習順序。',
      '卡關時，不要死磕當前節點。順著依賴線往回找：往往根因在更早的基礎知識。',
      '每日任務會智能推送與你當前弱點相關的前置節點，不要跳過！它們是突破卡點的鑰匙。',
      '知識鏈覆蓋全部Y7-Y12：打好Y7代數基礎，Y9方程才能游刃有餘；Y9三角打好，Y11才能飛起來。',
    ],
    quoteZh: '万事之基在于本，本固则枝荣——文若',
    quoteEn: 'The root of all achievement is a solid foundation; when the root holds firm, the branches flourish — Wenruo',
    quoteTw: '萬事之基在於本，本固則枝榮——文若',
  },
  {
    id: 6,
    titleZh: '赛季积分秘法',
    titleEn: 'Season Score Secrets',
    titleTw: '賽季積分秘法',
    icon: '⭐',
    color: 'from-yellow-900/60 to-amber-900/60',
    senderZh: '周瑜 大都督',
    senderEn: 'Grand Admiral Zhou Yu',
    senderTw: '周瑜 大都督',
    bodyZh: [
      '每日试炼（Daily Challenge）给出 ×3 XP 奖励。每天最少完成一题每日试炼，长期复利效果惊人。',
      '连胜宝箱：连对3题→小宝箱，5题→中宝箱，8题→大宝箱+特殊称号。连胜时绝对不要用透视（保持纯粹连胜）。',
      '成长手册（赛季任务）有10项里程碑奖励：3日连签 / 首次PK胜利 / 50题突破 / 全年级通关等。每项都有称号+XP。',
      '赛季结束时，称号和成就会永久保留在你的档案里。要冲排名，周末最关键——趁同学休息的时候超越他们！',
    ],
    bodyEn: [
      'The Daily Challenge gives ×3 XP. Complete at least one Daily Challenge question each day — the long-term compound effect is enormous.',
      'Streak Chests: 3 correct in a row → Small Chest, 5 → Medium Chest, 8 → Large Chest + special title. Never use the Oracle card during a streak (keep it pure).',
      'The Growth Handbook (Season Tasks) has 10 milestone rewards: 3-day check-in / First PK win / 50 questions / All-grade completion etc. Each gives a title + XP.',
      'Titles and achievements are permanently saved to your profile when the season ends. For leaderboard pushes, weekends are critical — sprint while your classmates rest!',
    ],
    bodyTw: [
      '每日試煉（Daily Challenge）給出 ×3 XP 獎勵。每天最少完成一題每日試煉，長期複利效果驚人。',
      '連勝寶箱：連對3題→小寶箱，5題→中寶箱，8題→大寶箱+特殊稱號。連勝時絕對不要用透視（保持純粹連勝）。',
      '成長手冊（賽季任務）有10項里程碑獎勵：3日連簽 / 首次PK勝利 / 50題突破 / 全年級通關等。每項都有稱號+XP。',
      '賽季結束時，稱號和成就會永久保留在你的檔案裡。要衝排名，週末最關鍵——趁同學休息的時候超越他們！',
    ],
    quoteZh: '羽扇轻摇，三军皆定——公瑾',
    quoteEn: 'One fan of feathers calms ten thousand soldiers — Gongjin',
    quoteTw: '羽扇輕搖，三軍皆定——公瑾',
  },
  {
    id: 7,
    titleZh: '万人同台之道',
    titleEn: 'The Way of the Arena',
    titleTw: '萬人同台之道',
    icon: '🏆',
    color: 'from-indigo-900/60 to-blue-900/60',
    senderZh: '关羽 武圣',
    senderEn: 'Wu Sheng Guan Yu',
    senderTw: '關羽 武聖',
    bodyZh: [
      'PK模式中，速度和准确率同等重要。先答对再求快——答错比答慢扣分更多。',
      '选择熟悉的题型。开局时"读题速度"是最大优势，读题比对手快1秒就能领先整局。',
      '2-6人对战时，观察对手的连答节奏。对手答错后趁热打铁，连续答对吃掉分差。',
      '远征模式（赤壁远征）是单人闯关最硬核的挑战——军粮只有5点，答错-1。把最难关卡放到最后，先保积累军粮再冲难关。',
    ],
    bodyEn: [
      'In PK mode, speed and accuracy matter equally. Prioritise accuracy over speed — a wrong answer costs more than a slow answer.',
      'Pick question types you know well. Reading speed is the biggest early-game advantage: being 1 second faster than opponents earns you the whole round.',
      'In 2–6 player battles, watch your opponents\' answering rhythm. When an opponent makes a mistake, go on a consecutive-correct streak to close the score gap.',
      'Expedition Mode (Battle of Red Cliff) is the hardest solo challenge — only 5 rations, and each wrong answer costs 1. Save the hardest nodes for last; accumulate rations first before tackling the toughest fights.',
    ],
    bodyTw: [
      'PK模式中，速度和準確率同等重要。先答對再求快——答錯比答慢扣分更多。',
      '選擇熟悉的題型。開局時「讀題速度」是最大優勢，讀題比對手快1秒就能領先整局。',
      '2-6人對戰時，觀察對手的連答節奏。對手答錯後趁熱打鐵，連續答對吃掉分差。',
      '遠征模式（赤壁遠征）是單人闖關最硬核的挑戰——軍糧只有5點，答錯-1。把最難關卡放到最後，先保積累軍糧再衝難關。',
    ],
    quoteZh: '吾虽不才，愿拱卫吾主至最后一关——云长',
    quoteEn: 'Though I may lack talent, I will guard my lord through to the final stage — Yunchang',
    quoteTw: '吾雖不才，願拱衛吾主至最後一關——雲長',
  },
];

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════

function getLangText(scroll: Scroll, lang: Language, field: 'title' | 'sender' | 'quote'): string {
  if (field === 'title') return lang === 'en' ? scroll.titleEn : lang === 'zh_TW' ? scroll.titleTw : scroll.titleZh;
  if (field === 'sender') return lang === 'en' ? scroll.senderEn : lang === 'zh_TW' ? scroll.senderTw : scroll.senderZh;
  return lang === 'en' ? scroll.quoteEn : lang === 'zh_TW' ? scroll.quoteTw : scroll.quoteZh;
}

function getBody(scroll: Scroll, lang: Language): string[] {
  return lang === 'en' ? scroll.bodyEn : lang === 'zh_TW' ? scroll.bodyTw : scroll.bodyZh;
}

export function StrategicScrollsPanel({ lang, onClose }: { lang: Language; onClose: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scroll = SCROLLS[activeIndex];

  const prev = () => setActiveIndex(i => (i - 1 + SCROLLS.length) % SCROLLS.length);
  const next = () => setActiveIndex(i => (i + 1) % SCROLLS.length);

  const panelTitle = lang === 'en' ? 'Book of Strategy' : lang === 'zh_TW' ? '兵法寶典' : '兵法宝典';
  const panelSub = lang === 'en' ? '7 Scrolls of Wisdom' : lang === 'zh_TW' ? '七篇錦囊' : '七篇锦囊';
  const fromLabel = lang === 'en' ? 'Sealed by:' : lang === 'zh_TW' ? '封緘自：' : '封缄自：';
  const closeBtnLabel = lang === 'en' ? 'Understood, withdraw!' : lang === 'zh_TW' ? '明白了，退下！' : '明白了，退下！';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-900/85 backdrop-blur-md"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.93, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 16 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="bg-[#1a1228] w-full max-w-lg rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-amber-500/20"
        style={{ maxHeight: '92vh' }}
      >
        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-amber-900/70 via-amber-800/60 to-amber-900/70 p-4 sm:p-5 flex justify-between items-center border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
              <BookMarked size={18} className="text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-200">{panelTitle}</h2>
              <p className="text-amber-400/60 text-[10px] font-bold tracking-wider">{panelSub}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-amber-400/60 hover:text-amber-300 hover:bg-amber-500/10 p-2 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Scroll Index Pills ── */}
        <div className="flex gap-1.5 px-4 pt-3 pb-1 overflow-x-auto scrollbar-hide">
          {SCROLLS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-7 h-7 rounded-full text-sm font-black transition-all ${
                i === activeIndex
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-110'
                  : 'bg-white/10 text-white/40 hover:bg-white/20 hover:text-white/70'
              }`}
            >
              {s.id}
            </button>
          ))}
        </div>

        {/* ── Active Scroll Content ── */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(92vh - 160px)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }}
              className={`m-3 sm:m-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${scroll.color} border border-white/10 p-4 sm:p-5 space-y-4`}
            >
              {/* Title row */}
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none mt-0.5">{scroll.icon}</span>
                <div>
                  <h3 className="text-white font-black text-base sm:text-lg leading-tight">
                    第{scroll.id}篇 · {getLangText(scroll, lang, 'title')}
                  </h3>
                  <p className="text-white/40 text-[10px] mt-0.5">
                    {fromLabel} <span className="text-white/60 font-bold">{getLangText(scroll, lang, 'sender')}</span>
                  </p>
                </div>
              </div>

              {/* Body bullets */}
              <ul className="space-y-2.5">
                {getBody(scroll, lang).map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-start gap-2.5 text-white/85 text-sm leading-relaxed"
                  >
                    <div className="mt-1.5 w-5 h-5 rounded-full bg-amber-500/25 flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-400 text-[10px] font-black">{i + 1}</span>
                    </div>
                    <span>{point}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Quote footer */}
              <div className="border-t border-white/10 pt-3 text-right">
                <p className="text-white/35 text-xs italic">{getLangText(scroll, lang, 'quote')}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Navigation Footer ── */}
        <div className="p-3 sm:p-4 border-t border-white/8 flex items-center gap-2">
          <button
            onClick={prev}
            className="flex-shrink-0 flex items-center justify-center gap-1 w-16 sm:w-20 py-2 bg-white/8 hover:bg-white/15 rounded-xl text-white/60 hover:text-white text-xs font-bold transition-colors"
          >
            <ChevronLeft size={14} />
            {lang === 'en' ? 'Prev' : '上一篇'}
          </button>

          <div className="flex-1 flex items-center justify-center gap-1">
            {SCROLLS.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all ${i === activeIndex ? 'w-4 h-1.5 bg-amber-400' : 'w-1.5 h-1.5 bg-white/20'}`}
              />
            ))}
          </div>

          {activeIndex < SCROLLS.length - 1 ? (
            <button
              onClick={next}
              className="flex-shrink-0 flex items-center justify-center gap-1 w-16 sm:w-20 py-2 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/30 rounded-xl text-amber-300 hover:text-amber-200 text-xs font-bold transition-colors"
            >
              {lang === 'en' ? 'Next' : '下一篇'}
              <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex-shrink-0 flex items-center justify-center gap-1 w-16 sm:w-20 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/30 rounded-xl text-emerald-300 hover:text-emerald-200 text-xs font-bold transition-colors"
            >
              <ScrollText size={14} />
              <span className="truncate">{lang === 'en' ? 'Done' : closeBtnLabel}</span>
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
