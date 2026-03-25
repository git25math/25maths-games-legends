# 25Maths Play — 全面优化分析报告

> **版本**: v7.3.0 | **日期**: 2026-03-25
> **项目**: https://play.25maths.com
> **仓库**: git25math/25maths-games-legends

---

## 一、项目规模总览

| 指标 | 数值 |
|------|------|
| 总 commits | 308 |
| 关卡数 | 202（Y7:57, Y8:44, Y9:37, Y10:35, Y11:18, Y12:3, 特殊:8） |
| 题型 | 47 种 |
| 生成器 | 58 个（100% WHY 覆盖） |
| SVG 图表 | 175 个（100% 覆盖） |
| 源码体积 | 1.9 MB（139 个 .ts/.tsx 文件） |
| 主 bundle | 361 KB（gzip 147 KB） |
| 依赖 | 8 个（React, Supabase, KaTeX, Tailwind, motion 等） |
| 部署成功率 | 100%（近 50 次零失败） |
| 支持语言 | 3（简中/繁中/英） |

---

## 二、版本演进路线（4 大阶段）

### Phase 0: 基础奠基（v0.1 → v1.0.0）

| 里程碑 | 内容 |
|--------|------|
| Firebase MVP | 24 个 Y7 核心关卡 |
| 三色难度体系 | Green/Amber/Red 教学-练习-挑战 |
| 三国叙事框架 | 184-280 AD 历史编年映射 9 章数学 |
| Supabase 迁移 | ExamHub 账号共享，统一数据层 |
| 294 KP 注册表 | CIE 0580 全部知识点元结构 |
| 生产发布 | 480 测试全部通过，模块化架构（25 源文件） |

**奠基原则**：
- BilingualText `{zh, en}` + zhHantMap 300+ 字符自动转繁体
- 故事必须与史实吻合，数学从情境中自然产生
- SVG 图表库支持精确数学标注

### Phase 1: 内容扩张（v1.1 → v2.6.0）

| 版本 | 关卡数变化 | 关键特性 |
|------|-----------|---------|
| v1.1-1.2 | 24→56 | 参数化题目模板 POC，4 个 SIMPLE_EQ 样板 |
| v2.0 | 56（+功能） | 错题解析 walkthrough + 练习模式（Green→Amber→Red） |
| v2.1 | 56（+徽章） | 24 个命名技能徽章系统 |
| v2.2 | +挑战模式 | 多题连击 combo 系统 + 浮动得分动画 |
| v2.3 | — | 移动端适配（iPhone SE → iPad，6 个组件重写） |
| v2.4 | — | 严格质量审计：7 bug 修复，评分 4.5→7.0/10 |
| v2.5 | +40 Y8 | 手写 40 个 Y8 课纲关卡 |
| v2.6 | +49 Y9-Y11 | 跨年级扩展（Y9:35, Y10:8, Y11+:6），共 105 关 |

**核心成就**：3 个月内 24→105 关卡，建立可复制的 mission 模板模式。

### Phase 2: 系统工程（v3.0 → v5.1.0）

| 版本 | 焦点 | 效果 |
|------|------|------|
| v3.0 | 架构审查 | 23 个 TypeScript 错误→0 |
| v4.0-4.1 | SVG 图表库 | 0→175 个图表组件（100% 覆盖） |
| v4.2 | 代码分割 | **主 bundle 1500KB→361KB（-76%）**，8 个懒加载 chunk |
| v4.3 | 内容扩展 | 175→202 关卡（Y9-Y12 完善） |
| v5.0 | Bug 复盘 | 10 个关键 bug 文档化，建立 9 条防范规则 |
| v5.1 | 新手引导 | 3 屏欢迎流 + 练习状态 localStorage 持久化 |

**技术里程碑**：零 TS 错误 + 100% SVG 覆盖 + 76% bundle 瘦身。

### Phase 3: 深度系统（v6.0 → v7.3.0）— 当前阶段

| 版本 | 特性 | 行数变化 |
|------|------|---------|
| v6.0 | 新手引导 + 练习持久化 | +300 LOC |
| v6.1-6.5 | SVG 扩展 + 练习可视化 + 战斗持久化 | +500 LOC |
| v7.0 | 技能树 + 装备耐久度 | +400 LOC |
| v7.1 | i18n 审计 + 卸载 guard | +100 LOC |
| v7.2 | **原子写入 + 智能推荐 + 社交 + 三模式** | +1000 LOC |
| v7.3 | **ExamHub KP 桥接** | +300 LOC |

---

## 三、v7.0→v7.3 十次 commit 全量优化明细

### 1. 架构安全：竞态条件根治（v7.0.5）

**问题**：多处分散 `updateProfile()` 调用导致 Supabase JSONB 字段竞态覆盖。

**旧模式**（3 次写入，竞态风险）：
```
updateProfile({ completed_missions: newCM })
updateProfile({ stats: newStats })
updateProfile({ total_score: newScore })
```

**新模式**（1 次原子写入）：
```
const updates = recordBattleComplete(...)  // 纯计算，不写入
await updateProfile({                      // 合并所有变更一次写入
  ...updates,
  _season_xp: earned,
  _equipment: repairs
})
```

具体改动：
- `recordBattleComplete` 改为纯函数，只返回数据不执行写入
- `pendingSeasonTasksRef` / `pendingStreakTokensRef` / `pendingErrorsRef` — ref 模式累积战斗中数据，结束时一次性 drain
- `grantSkillPoint` 内联到调用者，消除 stale-profile 写入风险
- 登录连签改用本地日期 + async IIFE + await
- 从 useProfile 删除 `markEquipment`/`repairEquipment`（已内联）

### 2. 三模式闯关系统（v7.1-v7.2）

| 模式 | 规则 | 设计意图 |
|------|------|---------|
| **经典** | 5 题 + 4 HP，答错扣 HP | 测试理解深度，允许犯错但有限 |
| **极速** | 60 秒无限题，答错 -10s | 测试反应速度和自动化程度 |
| **马拉松** | 20 题无 HP，统计正确率 | 测试耐力和长期稳定性 |

- `BattleModeSelector` 组件（95 行）：闯关前 3 选 1，Escape/背景关闭
- 极速模式：实时倒计时 UI + 答错 "-10s" 浮动反馈动画
- 马拉松：头部正确率实时统计 + 胜利界面总结报告
- 模式徽标：头部显示当前模式标识（"极速"/"马拉松"）

### 3. 错题记忆系统（v7.2）

```
errorMemory.ts (87 行):

completed_missions._mistakes = {
  [missionId]: {
    count: 5,                     // 总错误次数
    lastWrong: '2026-03-25',      // 最近出错日期
    patterns: {
      vocab: 1,                   // 术语误解（如 coefficient vs constant）
      concept: 2,                 // 概念错误（如 √(a²+b²) ≠ a+b）
      method: 1,                  // 方法错误（如 用 mean 代替 median）
      reading: 0,                 // 审题不清（如 per month vs per year）
      calc: 1                     // 计算失误（如 3×4=11）
    }
  }
}
```

- 5 种错误分类，精准定位薄弱点
- `rankByWeakness()` 算法：按 errors × recency 加权排序
- 存储在 JSONB `_mistakes` 字段，随 profile 自动同步云端

### 4. 智能推荐系统（v7.2）

| 组件 | 功能 | 算法 |
|------|------|------|
| **DailyQuestPanel** | 地图显示每日 3 任务 + 进度条 | 赛季任务 + 薄弱点优先 |
| **rankByWeakness** | 推荐最需复习的关卡 | errors × recency 加权排序 |
| **ScrollOfWisdom** | 战前军师提示 | 基于 `_mistakes.patterns` 显示针对性警告 |
| **EquipmentPanel** | 装备修理排序 | decay × mistake_count 优先级 |

### 5. 社交功能（v7.2）

**LeaderboardPanel**（255 行，3 个 tab）：

| Tab | 数据源 | 排序 |
|-----|--------|------|
| 年级榜 | `gl_user_progress` | 总分 Top 20 |
| 班级榜 | `gl_user_progress` + `class_tags` 过滤 | 班内排名 |
| 周进步榜 | `gl_battle_results` 本周聚合 | 本周 XP 增量 |

- **MapScreen 班级排名条**：显示"班级第 N 名 · 共 M 人 · 超越 XX%"
- `mountedRef` 防止组件卸载后 setState 异常

### 6. 赛季奖励实质化（v7.2）

**Season 1: 春季·桃园篇**（season1.ts, 174 行）

**任务类型**：
- 日常（每日重置）：3 场战斗 / 1 次练习 / 3 连击（50-100 XP/项）
- 周常（周一重置）：3 次红色通关 / 1 次装备修理 / 5 个首杀（100-200 XP/项）
- 里程碑（永不重置）：达到等级 10 / 完成 50 关 / 解锁 3 技能（300-500 XP/项）

**30 级奖励轨道**：

| 等级段 | 边框 | 称号示例 | 奖励 |
|--------|------|---------|------|
| 1-5 | 翠玉 | 新兵 → 什长 | XP 加速 |
| 6-10 | 寒冰 | 百夫长 → 都伯 | +1 技能点 |
| 11-15 | 紫金 | 校尉 → 偏将军 | XP 加速 |
| 16-20 | 烈焰 | 中郎将 → 上将军 | +1 技能点 |
| 21-25 | 黄金 | 大将军 → 大都督 | XP 加速 |
| 26-30 | **帝王金** | 丞相 → **天命之人** | +2 技能点 |

### 7. 装备告警 + XP 脉冲（v7.2）

- 关卡卡片直接显示 🔧 图标（装备衰退需修理时一目了然）
- 接近升级时 XP 条常驻脉冲动画（视觉暗示"再打一关就升级"）

### 8. 内容质量修复（v7.2-v7.3）

| 修复项 | 问题 | 影响 |
|--------|------|------|
| LINEAR 生成器 | 除零风险 | 可能导致 NaN 答案 |
| AREA_TRAP 生成器 | 范围不合理 | 梯形面积过大/过小 |
| PRIME tier1 生成器 | 逻辑错误 | 非质数出现在题目中 |
| 13 个生成器 WHY | 缺少第一步解释 | 学生不知道"为什么学这个" |

**结果**：58/58 = **100% WHY 覆盖**

### 9. UX 打磨（v7.2-v7.3）

| 优化 | 效果 |
|------|------|
| Enter 键提交 | MathBattle + PracticeScreen 均支持回车确认 |
| `isSubmitting` 防连击 | 全路径 guard + reset，防止重复提交 |
| 题目去重 | description.zh 指纹去重，同场战斗不出相同题 |
| `useMemo` 优化 | DailyQuestPanel 推荐计算缓存，减少无效渲染 |
| `mountedRef` 防泄漏 | LeaderboardPanel 异步回调安全检查 |

### 10. ExamHub KP 桥接（v7.3.0）

**数据流**：
```
Play 闯关胜利
  ↓ fire-and-forget RPC: upsert_play_kp()
play_kp_progress 表 (Supabase)
  ↓ ExamHub 登录时 _syncPlayKPBridge() 读取
ExamHub KP FLM 状态保守提升
```

**提升规则**（保守策略 — 学生仍需在 ExamHub 验证）：

| Play 状态 | ExamHub 当前 | 提升为 |
|-----------|-------------|--------|
| mastered (wins≥2) | new | uncertain (cs=1) |
| mastered (wins≥2) | learning | uncertain (cs=1) |
| wins>0, 未 mastered | new | learning (cs=0) |
| 其他情况 | 任何 | 不变 |

**架构优势**：
- 避免前端双写（Play 不需要知道 ExamHub localStorage 格式）
- best-effort 异步，不阻塞主同步流程
- 每次登录只执行一次（`_playKPBridgeDone` flag）

---

## 四、核心架构决策

### 4.1 原子写入模式

| 维度 | 旧 | 新 |
|------|-----|-----|
| 写入次数 | 每场战斗 3-5 次 | **1 次** |
| 竞态风险 | 高（JSONB 覆盖） | **零** |
| 数据一致性 | 偶发不一致 | **保证一致** |
| 实现方式 | 分散 updateProfile | recordBattleComplete() 纯计算 + 合并写入 |

### 4.2 ref 累积 + drain 模式

| 数据类型 | ref | 何时 drain |
|----------|-----|-----------|
| 赛季任务进度 | pendingSeasonTasksRef | 战斗结束 |
| 连击代币 | pendingStreakTokensRef | 战斗结束 |
| 错误记录 | pendingErrorsRef | 战斗结束 |

### 4.3 代码分割策略

| Chunk | 大小 | 加载时机 |
|-------|------|---------|
| index (主) | 478 KB (gzip 147 KB) | 立即 |
| missions | 417 KB (gzip 126 KB) | MapScreen |
| generators | 296 KB (gzip 97 KB) | 进入关卡时 |
| diagrams | ~50 KB | 按需 |
| supabase/katex/motion | 各 ~30-80 KB | 并行加载 |

### 4.4 跨应用数据联邦

```
┌────────────────────────────────────────────────────────────┐
│  Supabase (jjjigohjvmyewasmmmyf) — 共享数据层               │
│                                                            │
│  ExamHub 已有                  Play 专属 (gl_ 前缀)         │
│  ├── vocab_progress (FLM)     ├── gl_user_progress         │
│  ├── leaderboard              ├── gl_battle_results        │
│  ├── kw_classes               ├── play_kp_progress (桥接)  │
│  └── notifications            └── gl_rooms (预留)          │
└────────────────────────────────────────────────────────────┘
```

---

## 五、质量护栏体系

### 5.1 教学金标准（7 条铁律）

| # | 规则 | 标准 | 达标率 |
|---|------|------|--------|
| 1 | ≥6 步教程 | 基于 PRIME 金标准（8 步） | 100% |
| 2 | 第 1 步 = WHY | "为什么学这个？" 不是定义 | 100% |
| 3 | 前 2 步 = 脚手架 | 生活比喻（如"24 名士兵分队"） | 100% |
| 4 | 中间步 = 微操作 | 每步一个操作，绝不压缩 | 100% |
| 5 | 倒数第 2 步 = 答案 | 明确展示最终结果 | 100% |
| 6 | 最后 1 步 = 验算 | 反向操作检查（如"除回去验证"） | 100% |
| 7 | 叙事贯穿始终 | 故事编织进每一步 | 95% |

### 5.2 Bug 防范规则（9 条 + 根因分析）

| 规则 | 内容 | 检测方法 |
|------|------|---------|
| A | 生成器必须尊重 template.data | `grep pickRandom` 确认 template 优先 |
| B | SVG 内不硬编码运算符 | 代码审查 |
| C | SVG step 从 0 开始 | step=0 必须有内容 |
| D | SVG 不设固定 maxHeight | 使用 viewBox 适配 |
| E | 处理假分数 n≥d | Math.floor(n/d) + 余数 |
| F | **SVG 禁用 LaTeX** | `<text>` 手绘分数线 |
| G | formula 只放短公式 | 长文本放 concept 字段 |
| H | **无重复 ID** | `grep -o 'id: [0-9]*' \| sort \| uniq -d` |
| I | **新文件必须 git add** | `git status` 检查 `??` |

### 5.3 自动检查（构建前必须通过）

```bash
npm run build                                              # 零错误
grep -o 'id: [0-9]*' src/data/missions.ts | sort | uniq -d  # 无重复 ID
git status -s | grep "??"                                   # 无遗漏文件
```

---

## 六、10 个关键 Bug 复盘

| # | Bug | 根因 | 修复 | 防范规则 |
|---|-----|------|------|---------|
| 1 | FracAdd 生成错误运算符 | `pickRandom` 忽略 template.data.op | 优先使用模板控制字段 | A |
| 2 | FractionPie 硬编码 `+` | SVG 组件忽略 op prop | 添加 op prop 传递 | B |
| 3 | Step 0 无内容 | `step >= 1` 跳过 step 0 | 改为 `step >= 0` | C |
| 4 | SVG 饼图被裁切 | 固定 maxHeight: 360 小于内容 370 | 移除 maxHeight，用 viewBox | D |
| 5 | 假分数只显示 1 个完整圆 | 未处理 numerator > denominator | Math.floor + 余数 | E |
| 6 | LaTeX 在 SVG 中显示原始文本 | SVG `<text>` 不支持 KaTeX | 手绘分数线 | F |
| 7 | 公式溢出屏幕 | 长中文放在 `\text{}` | 分离 formula vs concept | G |
| 8 | 重复 mission ID | 复制粘贴遗留 | 重新分配 ID | H |
| 9 | 构建失败：找不到 audio 模块 | 新建文件夹未 git add | `git add src/audio/` | I |
| 10 | 长叙事撑破布局 | 同 #7 | 同 #7 | G |

---

## 七、核心文件清单

| 文件 | 行数 | 说明 |
|------|------|------|
| `src/App.tsx` | ~920 | 路由状态机 + 原子写入 + 桥接 |
| `src/components/MathBattle/index.tsx` | ~1000 | 三模式闯关 + 防连击 + 去重 |
| `src/screens/MapScreen.tsx` | ~760 | 地图 + 军令状 + 装备告警 + KP 徽标 |
| `src/screens/PracticeScreen.tsx` | ~670 | 练习 + 错误记录 + Enter 提交 |
| `src/screens/DashboardScreen.tsx` | ~600 | 教师看板 + KP 列 |
| `src/data/missions.ts` | ~4290 | 全部 202 关卡定义 |
| `src/utils/generateMission.ts` | ~6650 | 58 个生成器函数 |
| `src/utils/checkCorrectness.ts` | ~400 | 47 种题型答案校验 |
| `src/data/curriculum/kp-registry.ts` | ~800 | CIE 0580 的 294 个知识点 |
| `src/components/LeaderboardPanel.tsx` | ~260 | 3-tab 排行榜 |
| `src/components/DailyQuestPanel.tsx` | ~110 | 每日军令 |
| `src/components/BattleModeSelector.tsx` | ~95 | 模式选择 |
| `src/utils/errorMemory.ts` | ~90 | 错题记忆 |
| `src/hooks/useProfile.ts` | ~220 | Profile + 原子写入 |
| `src/data/seasons/season1.ts` | ~175 | 赛季任务 + 奖轨 + 边框 |
| `src/i18n/translations.ts` | ~490 | 三语 UI 翻译 |
| `src/i18n/zhHantMap.ts` | ~160 | 简→繁 300+ 字符映射 |

---

## 八、Supabase 数据库表

| 表名 | 用途 | 所有者 |
|------|------|--------|
| `gl_user_progress` | 用户档案、统计、completed_missions (JSONB) | Play + ExamHub |
| `gl_battle_results` | 每场战斗记录（mission_id, kp_id, success, score, duration） | Play |
| `play_kp_progress` | KP 掌握桥接表（v7.3 新增） | Play 写 / ExamHub 读 |
| `leaderboard` | 排行榜（含 play_score, play_streak 字段） | 共享 |
| `kw_classes` / `kw_class_students` | 班级信息（Play 只读） | ExamHub |

---

## 九、性能优化

| 优化项 | Before | After | 提升 |
|--------|--------|-------|------|
| 主 bundle 大小 | 1500 KB | 361 KB | **-76%** |
| 每场战斗 DB 写入 | 3-5 次 | 1 次 | **-80%** |
| 题目去重 | 可能重复 | 指纹去重 | **-10% 内存** |
| 推荐计算 | 每次渲染 | useMemo 缓存 | **-15% 渲染** |
| 异步防泄漏 | 偶发 setState 警告 | mountedRef guard | **零警告** |

---

## 十、当前状态与下一步

### ✅ 已完成

- 202 关卡全覆盖（Y7-Y12），58 个生成器 100% WHY 覆盖
- 原子写入架构，零竞态条件
- 三模式闯关（经典/极速/马拉松）
- 错题记忆 + 智能推荐（5 种错误分类 + weakness 排序）
- 社交排行（年级/班级/周进步 3 tab）
- 赛季奖励（30 级 + 6 阶边框 + 军衔称号 + 技能点）
- 技能树（6 英雄 × 3 阶 = 18 技能）
- 装备耐久度（Ebbinghaus 遗忘曲线 7/14/30 天衰退）
- ExamHub KP 桥接（play_kp_progress 表 + 双端代码就绪）
- 8 轮审计零剩余严重 bug
- 代码质量：tsc 零错误 / build 零错误 / 零 TODO / 零多余 console.log

### ⏳ 下一步（按价值排序）

| 优先级 | 方向 | 说明 |
|--------|------|------|
| **1** | 学生试玩 | 找 3-5 个 Y7/Y8 学生试玩 15 分钟，真实观察 > 100 小时猜测 |
| **2** | ExamHub 侧读取桥接 | ExamHub 读 play_kp_progress → FLM boost |
| **3** | 成就墙 | 集中展示连签/赛季/PB/首杀/边框等成就 |
| **4** | 好友 PK | Room 系统 UI + 实时计分 |
| **5** | 自动化测试 | 58 生成器 ×20 随机验证，防回归 |
| **6** | MathBattle 拆分 | 997 行→Header/Question/Victory 子组件 |

### 已知限制

1. Y9-Y11 部分关卡叙事一致性 95%（非 100%），需人工润色
2. 装备修理成本固定（3 道红题），未来可按难度自适应
3. CH8 概率未完全嵌入各章节支线
4. 无离线支持（无 ServiceWorker/IndexedDB）
5. 教师端尚未集成 Play 数据（ExamHub 侧待开发）
