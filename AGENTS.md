# 25Maths Play (games-legends) — Codex/AI 接手规范

> **重要**: 完整开发规范见 `docs/CONTRIBUTING.md`（适用于任何 AI/人类开发者）。
> 本文件是 Codex / OpenAI Agents / 任何外部 AI 专用的启动协议 + 深度交接文档。
> **最后更新**: v9.10.0 (2026-03-28)

---

## 一、强制启动协议（每次必做，顺序不可变）

```
Step 1: npm run build         → 必须零错误，否则不能改任何代码
Step 2: 读 docs/CONTRIBUTING.md → 唯一权威规范（金标准/反模式/审查标准）
Step 3: 读 docs/DEVELOPMENT-PLAN.md → 版本历程 + 下一步计划
Step 4: 读本文件第三章"当前状态快照" → 226 关卡/已完成/遗留
Step 5: npm test -- --run     → 2339 测试必须全通过
```

---

## 二、项目基础信息

| 字段 | 值 |
|------|----|
| **根目录** | `/Users/zhuxingzhe/Project/ExamBoard/25maths-games-legends` |
| **部署** | push main → GitHub Actions → https://play.25maths.com |
| **仓库** | `git25math/25maths-games-legends` |
| **当前版本** | v9.10.0 (2026-03-28) |
| **技术栈** | React 19 + TypeScript + Vite + KaTeX + Supabase |
| **测试框架** | Vitest (2339 tests, `npm test -- --run`) |
| **部署验证** | `gh run list --repo git25math/25maths-games-legends --limit 1` |

---

## 三、当前状态快照（v9.8.0, 2026-03-28）

### 规模
- **233 missions** 分布: Y7(57) + Y8(41) + Y9(48) + Y10(49) + Y11(29) + Y12(9)
- **78 个活跃 generatorType**（含 SIMILAR_TRIANGLES/TREE_DIAGRAM/SEQUENCE_NTH/COORD_3D/VECTOR_3D），100% 覆盖
- **2,389 个 Vitest 用例**（全通过）
- **4 条远征**: 桃园(Y7-8) / 赤壁(Y7-12) / 蜀道(Y8-10) / 北伐(Y10-12)

### 教程质量覆盖率（截至 v10.3）

| 年级 | 关卡数 | 6步金标准 | WHY开场 | 验算结尾 | 状态 |
|------|--------|-----------|---------|---------|------|
| Y7 | 57 | ✅ 全达标 | ✅ 全达标 | ✅ 全达标 | **金标准** |
| Y8 | 41 | ✅ 全达标 | ✅ 全达标 | ✅ 全达标 | **金标准** |
| Y9 | 48 | ✅ 全达标 | ✅ 全达标 | ✅ 全达标 | **金标准** ← +5 Season 2 |
| Y10 | 49 | ✅ 全达标 | ✅ 全达标 | ✅ 全达标 | **金标准** ← +9 Season 2 |
| Y11 | 29 | ✅ 全达标 | ✅ 全达标 | ✅ 全达标 | **金标准** ← +4 Season 2 |
| Y12 | 9 | ✅ 全达标 | ✅ 全达标 | ✅ 全达标 | **金标准** ← +4 Season 2 |

**结论**: Y7-Y12 全部 233 关卡均达金标准（自动化审计 233/233 = 100%）。

### 本轮完成（v8.5→v8.9.3, 2026-03-26）

#### v8.6.0 — 全项目严格质量审计 + BUG修复
- `checkCorrectness.ts`: FUNC_VAL/ROOTS/PROBABILITY/TRIGONOMETRY 加除零守卫
- `checkCorrectness.ts`: FRAC_ADD/FRAC_MUL 容差 0.001 → 0.01（防浮点误差）
- `generators/advanced.ts`: RATIO_RANDOM 生成器补充缺失 `answer` 字段
- `missions.ts`: mission 9143 类型 ANGLES → COORDINATES（与 ROTATION checker 对齐）

#### v8.7.0 — Y9/Y10/Y11 WHY叙事升级
- Y9 10关（unit 9-12）、Y10 15关（unit 1-5）、Y11 5关（unit 1-3）
- 全部第1步从"什么是X"改为"为什么学X"叙事开场

#### v8.8.0 — Y8 全部40关6步金标准教程
- Y8 811-896 全部 40 关从 `tutorialSteps:[]` 写入完整6步教程
- 覆盖：直线方程、函数求值、平行线角、勾股定理、面积、圆、体积、百分比、
  复利、均值/中位/众数、概率、联立方程、展开/因式分解、不等式、对称性、
  速度、标准形式、比例

#### v8.9.0 — Y12 金标准收尾
- `DERIVATIVE_RANDOM` 的 `func === '3x^2-3'` 分支重写为 7 步教程
- mission `1211` 模板同步补齐为 WHY→脚手架→微操作→答案→验算
- Y12 5 关全部完成金标准教程升级

#### v8.9.1 — CI 质量门禁
- `.github/workflows/deploy.yml` 安装命令从 `npm install` 改为 `npm ci`
- 部署前新增 `npm run lint`
- 部署前新增 `npm test -- --run`
- 只有 `lint + test + build` 全通过才会继续 GitHub Pages 部署

#### v8.9.2 — 状态一致性 + 去重护栏
- `App.tsx`: 移除 daily challenge 对 `profile.completed_missions` 的原地 mutation
- `completionState.ts`: 明确 practice 完成态只持久化 `green/amber/red`
- `questionFingerprint.ts`: practice/battle 统一改为稳定题目指纹，避免同答案不同题误判重复
- `generators.test.ts`: coverage 从“>=70”收紧为“与注册表精确一致”
- Vitest 用例数 `1776 → 1780`

#### v8.9.3 — generator 纯化 + 首屏拆包
- `generators/shared.ts`: 删除模块级 `getTier/setTier` 全局状态，`safeRetry` 改为显式传递 `tier`
- `generatorTiering.test.ts`: 新增 tier 行为和递归重试护栏，Vitest 用例数 `1780 → 1783`
- `useMissions.ts`: missions 数据改为动态加载，`App.tsx` 改为延迟恢复 persisted mission
- `App.tsx`: `Map/Lobby/Battle/Practice/Dashboard/PK/Expedition` 切到 `Suspense` 懒加载
- 构建主入口 `563.39 kB → 323.83 kB`，地图页单独拆出 `45.90 kB` chunk

#### v9.0.0 — 背包系统 + 道具修复 + 科技树完整上线

- `InventoryPanel.tsx`: 🎒 背包面板上线 — MapScreen 新增"背包"按钮（桌面端 + 移动端 More 菜单），显示持有道具清单
- `RepairDialog.tsx`: 道具修复弹窗上线 — EquipmentPanel 内每件受损装备新增"🔨 使用道具"按钮，消耗库存修复装备耐久
- `EquipmentPanel.tsx`: 新增 `onRepairWithItem?` prop，在练习修复按钮旁增加道具修复入口
- `MapScreen.tsx`: 添加 `showInventory` + `repairDialogTarget` 状态，完整 RepairDialog 渲染逻辑（含 health/dominantError 计算）
- `TechTreeScreen.tsx`: 任务卡片改为 Practice + Battle 双按钮（BookOpen/Swords）
- `TechNode.tsx`: 修复 zh_TW 受損标签（繁体正确显示）
- `gameBalance.ts`: 新建游戏平衡常量集中管理（Stamina/Decay/Rewards/RepairPower/TechTree 阈值）
- `equipment.ts` / `repairItems.ts` / `stamina.ts`: 所有魔术数字替换为 `gameBalance` 导入

#### v8.10.1 — Bug 修复 + missions 按年级拆包
- `checkCorrectness.ts`: ROOTS 负判别式守卫（`disc < 0` → 防 NaN）+ QUADRATIC x2=0 守卫
- `BugReportButton.tsx`: 移到左下角，避免与 Calculator 右侧叠放过近
- `Calculator.tsx`: popup 从 z-50 改为 z-[55]，避免被全屏模态遮盖
- `missions.ts` 按年级拆分：557kB 单 chunk → 6 个 ~100-150kB 年级 chunk
- `useMissions(grade)` 接受 grade 参数，只按年级懒加载对应文件（Y7 学生下载 35kB gzip，-78%）
- MapScreen + TechNode/TechTreeColumn 修复 TS lint 错误，CI 全通过

#### v8.10.0 — Bug 报告系统
- `gl_bug_reports` Supabase 表（migration 20260327000000）：category/description/mission_id/user_id，任意用户可 INSERT
- `src/components/BugReportButton.tsx`：右下角半透明浮动按钮 + Modal（4 类别 + 可选描述 + 三语）
- 集成到 `PracticeScreen` + `MathBattle`，静默失败不影响游戏流程

### 本轮完成（v9.1.1→v9.7.0, 2026-03-27）

#### v9.2.0 — 五方向全量优化（上一窗口完成）
- **C: Resilience Engine 入口**: MapScreen 腐败告警横幅 + MathBattle 失败"🔍诊断"按钮
- **A: DailyQuestPanel 分流**: 战斗任务→"去闯关 →"，练习任务→"去练习 →"
- **B: CIRCLE_THEOREM_RANDOM**: geometry.ts 新生成器（2变体 6步金标准）+ Y10 Unit14 两关（id 10141/10142）
- **E: 三币经济基础**: currency.ts + 战斗/练习自动发放 + MapScreen 余额展示

#### v9.3→v9.4（并行窗口完成，v9.5.0 一次打包）
- **Resilience Engine 全接入**: `processAttempt()` 答题→技能健康实时更新 + `detectErrorPattern()` 15 规则识别引擎
- **Supabase 新表**: user_skill_health + user_attempt_log + error_pattern_remedy_map + recovery_packs + gl_lesson_runs（+RLS+seed）
- **RepairScreen**: 完整修复屏幕（诊断卡→5题修复→庆祝），EXPAND_NEG_RANDOM 专用负号展开生成器
- **ExamHub 精品课闭环**: negative-expansion 引导课 + useLessonRecovery hook "特训完成！再试一次？" + gl_lesson_runs 双写
- **班级竞技场**: MapScreen Top 5 排行卡片
- **底部导航全局化**: 4-tab 底部导航栏（全页面）
- **UI 全面响应式**: 67 个 sm 断点 + 推荐引导条（corruption感知+脉动）+ 关卡卡片层级重排 + 页面过渡垂直淡入
- **微动效打磨**: 体力火焰闪烁 + 技能节点辉光 + 升级 Confetti + 技能恢复 toast
- **教师看板**: KP 薄弱点排名 + blocked 学生数 + gl_lesson_runs 引导课完成记录

#### v9.5.0 — CI 修复（本窗口完成）
- `App.tsx` / `RepairScreen.tsx` / `techTree.ts(×2)`: 修复 4 处 TypeScript lint 错误（类型断言 + 死代码移除），恢复 CI/CD 绿灯

#### v9.6.0 — 三币商店上线
- `ShopPanel.tsx` + `gameBalance.ts` + `inventory.ts`: 军械库商店（merit/wisdom 兑换道具），三类道具分色卡片，余额实时展示

#### v9.7.0 — Y7 全量教程升级 + Y10 圆心角修复
- **Y10 修复**: missions 10141/10142 空 tutorialSteps → 6步金标准（圆周角+圆心角定理，诸葛亮/周瑜叙事）
- **Y7 全量升级**: 45关教程 1-5步 → 全部≥6步金标准（BODMAS/分数/整数/代入/合并同类项/百分比/比例/质因数/HCF/LCM/数列/估算/几何/坐标/统计）
- 测试: 2214 → 2264（+50 测试）

#### v10.3.0 — Y12 VECTOR_3D 金标准教程 + 积分面积
- **Y12 VECTOR_3D 教程修复**: id=1241（司马昭6步）+ id=1242（姜维6步，含负分量��解）
- **Y12 积分面积**: id=1251（屯田面积，∫₀⁶ x dx = 18，三角形验算）+ id=1252（城墙曲面，∫₀³ 3x² dx = 27，导数反验证）
- Y12 关卡: 7 → 9（+2），全部金标准教程

#### v10.1.0 — COORD_3D 新题型 + 蜀道远征
- **COORD_3D**: 7文件全流程（types/translations/inputConfig/checkCorrectness/geometry.ts/index.ts/y10.ts）
- **generateCoord3DMission**: midpoint+distance 两种模式，3档位，6步金标准动态教程
- **Y10 新关卡**: id=1066（城楼会师，正坐标，Medium/480）+ id=1067（烽火定位，含负坐标，Hard/520）
- **蜀道行军远征**: 8节点（荆州→成都），Y8-10，起始军粮5，李白蜀道难引语
- 测试: 2339 → 2364（+25）

#### v9.9.0 — TREE_DIAGRAM 新题型（条件概率不放回）
- **7 文件全流程**: types/translations(3语)/inputConfig/checkCorrectness/statistics.ts/index.ts/y9.ts
- **generateTreeDiagramMission**: 3 模式（both_red/both_same/diff）× 3 档位，P(B|A) 条件概率，6步金标准动态教程
- **Y9 新关卡**: id=9148（不放回抽签，5r+3b，Medium/300）+ id=9149（颜色配对，4r+2b，Hard/360）
- 测试: 2289 → 2314（+25）

#### v9.8.0 — 三币经济完整闭环 + SIMILAR_TRIANGLES 新题型 + story插值修复
- **军粮消费**: `ration_pack`（补给包📦）— 修复力 20，售价 25 军粮，inventory.ts 新增 `supply` 类型
- **gameBalance.ts**: SHOP_PRICES 接入 rations 定价
- **ShopPanel.tsx**: supply 绿色卡片 + 底部提示更新
- **SIMILAR_TRIANGLES 新题型**: QuestionType + 生成器（geometry.ts，p/q/r参数，3叙述者对，动态6步教程）+ checker（cross-multiply校验）+ inputConfig + translations（三语）
- **Y9 新关卡**: id 933（影子量旗，赵云，静态6步，Medium）
- **Y10 新关卡**: id 1065（田界测量，马良，静态6步，Hard/480）
- **SVG图**: renderDiagram.tsx SIMILAR_TRIANGLES → 两三角形并列图（蓝△ABC/红△DEF，标注p/q/r/x）
- **16处story插值修复**: Y7(7处) + Y9(7处) + Y10(1处) + Y11(1处)，所有硬编码数字改为 `{key}` 占位符
- 测试: 2264 → 2289（+25）

### 已知遗留问题

| 优先级 | 问题 | 位置 | 建议 |
|--------|------|------|------|
| LOW | 道具修复 `applyRepair` 用 lastMasteredAt 反向计算，忽略 error penalty 项，health 略估高 | App.tsx `onRepairWithItem` | 可接受，完整修复需在 KPEquipment 加 `healthBonus` 字段 |
| LOW | RepairDialog onRepair 关闭前无动画等待（1.2s toast 后直接关闭） | MapScreen repairDialogTarget | 后续可监听 RepairDialog success 状态 |
| ~~MEDIUM~~ | ~~军粮(rations) 只展示不发放~~ | ~~currency.ts CURRENCY_REWARDS~~ | ✅ 已修复：App.tsx 每日任务/远征完成均调用 awardCurrency rations |

> **v9.1.1 CRITICAL 全清零**：浅拷贝竞态（规则 J）+ async XP 丢失（规则 K）+ techTree TDZ 崩溃（规则 L）。规则 J/K/L 已入 BUG-POSTMORTEM.md + CONTRIBUTING.md。全项目 `var` 清零。

---

## 四、文件地图

### 必读文档
| 文件 | 用途 | 优先级 |
|------|------|--------|
| `docs/CONTRIBUTING.md` | **唯一权威规范**（金标准/反模式/审查/新关卡流程） | **必读** |
| `docs/DEVELOPMENT-PLAN.md` | 版本历程 v0.1→v8.9.3 + 下一步计划 | **必读** |
| `docs/BUG-POSTMORTEM.md` | Bug 根因分析 + 9 条防范规则 | **开发前必读** |
| `docs/Y8-DEVELOPMENT-PLAN.md` | Y8 课纲接手计划（Y8 开发时读） | Y8 专用 |
| `docs/OPTIMIZATION-HISTORY.md` | v0.1→v7.3 全量优化历史 | 参考 |

### 核心源文件
| 文件 | 当前行数 | 说明 |
|------|---------|------|
| `src/data/missions.ts` | ~4920 | 全部关卡定义（Y7:id 690-773, Y8:811-896, Y9:901-993, Y10:1011-1053, Y11:1111-1131, Y12:1211/1221/1231-1233） |
| `src/utils/generateMission.ts` | ~5 | 向后兼容的 barrel export |
| `src/utils/generators/` | 7 文件 | 按章节拆分的生成器实现（71 个活跃类型） |
| `src/utils/checkCorrectness.ts` | ~410 | 答案校验（含除零守卫） |
| `src/utils/generators/advanced.ts` | ~500 | 高级生成器（RATIO_RANDOM/SECTOR/ROTATION等） |
| `src/types.ts` | ~193 | Language / QuestionType / Mission 类型定义 |
| `src/i18n/translations.ts` | ~741 | 三语 UI 翻译 (zh/zh_TW/en) |
| `src/data/curriculum/kp-registry.ts` | ~296 | CIE 0580 的 294 个知识点注册表 |
| `src/screens/PracticeScreen.tsx` | ~685 | 练习模式主屏幕 |
| `src/components/MathBattle/index.tsx` | ~523 | 闯关模式主组件（v8.4拆分后） |
| `src/components/MathBattle/inputConfig.ts` | ~196 | 每个题型的输入字段配置 |

---

## 五、教学质量金标准（7条铁律）

**每一关的 `tutorialSteps` 必须满足全部7条，否则不能通过审查：**

```
1. ≥6 步教程（不含空步骤）
2. 第 1 步 = WHY（"为什么要学X"，用生活场景，不是定义）
3. 前 2 步 = 概念脚手架（生活比喻+直觉理解）
4. 中间步 = 每步一个微操作（只做一件事）
5. 倒数第 2 步 = 给出答案
6. 最后 1 步 = 验算（检验答案是否正确）
7. 叙事贯穿始终（三国人物/故事情节，不是干燥的步骤说明）
```

**检验一关是否达标的快速命令：**
```bash
python3 -c "
import re, sys
with open('src/data/missions.ts') as f: content = f.read()
# 找到某个mission的tutorialSteps块
m = re.search(r'id:\s*8111.*?tutorialSteps:\s*\[(.*?)\]', content, re.DOTALL)
if m:
    steps = re.findall(r\"text:\s*\{\", m.group(1))
    print(f'Steps: {len(steps)}')
"
```

---

## 六、开发规范速查

### 新增关卡的7文件流程
```
1. src/types.ts          → 添加 QuestionType 枚举值
2. src/i18n/translations.ts → 添加 zh + zh_TW + en 三语翻译
3. src/components/MathBattle/inputConfig.ts → 配置输入字段
4. src/utils/checkCorrectness.ts → 添加 case 分支 + 除零守卫
5. src/utils/generators/index.ts + 对应章节文件 → 注册生成器 + 编写生成函数
6. src/data/missions.ts          → 添加 mission 定义 + 6步教程
7. src/screens/PracticeScreen.tsx → （可选）注册 SVG 图表
```

### 三语支持规则
- `{zh, en}` 即可，繁体（zh_TW）通过 `zhHantMap.ts` 自动转换
- UI 翻译 `translations.ts` 中 zh_TW 必须**手动写**（不自动转换）
- 组件内 LABELS 数组：需加 zh_TW 条目
- INPUT_FIELDS 中 placeholder：zh_TW 自动降级到 zh

### Git 规范
```bash
npm run build         # 零错误才能 commit
npm test -- --run     # 1780 tests 全通过
git add <files>       # 不用 git add -A（防止提交临时文件）
git commit -m "..."
git push              # 自动触发 GitHub Actions 部署
gh run list --repo git25math/25maths-games-legends --limit 1  # 验证部署
```

---

## 七、Bug 防范 9 条规则（高频踩坑）

> 详细根因见 `docs/BUG-POSTMORTEM.md`

1. **规则A** — 生成器必须尊重 `template.data`：op/mode/func 等控制字段不能随机覆盖
2. **规则B** — `checkCorrectness` 的 `case` 必须与 `QuestionType` 枚举完全匹配
3. **规则C** — `FractionPie` step 从 0 开始：`step=0` 就要有内容，不能跳到 1
4. **规则D** — 生成器 data 字段名 ↔ checker 读取字段名 必须完全一致（大小写敏感）
5. **规则E** — 共享生成器副作用：修改 `LINEAR_RANDOM` 会影响所有年级，建议创建年级变体
6. **规则F** — SVG 内不用 LaTeX：`<text>` 标签内用 SVG 手绘分数线，不用 `$...$`
7. **规则G** — formula 用短公式：不要在 `\text{}` 里放长中文句子
8. **规则H** — 重复 ID 检查：`grep -o 'id: [0-9]*' src/data/missions.ts | sort | uniq -d` 必须为空
9. **规则I** — 新文件必须 git add：commit 前 `git status` 检查 `??` 未跟踪文件

---

## 八、审计流程（质量审查时标准流程）

```
Step 1: 量化统计（用 Python 统计每关步骤数/WHY/验算）
Step 2: 对标金标准，标出不达标项（表格化）
Step 3: 按 CRITICAL/HIGH/MEDIUM/LOW 分级排序
Step 4: 批量修复 CRITICAL+HIGH（逐关或批量脚本）
Step 5: npm run build 零错误
Step 6: 第2轮审查（聚焦教程叙事质量）
Step 7: 第3轮审查（聚焦生成器数据对齐）
Step 8: commit + push + 验证部署
Step 9: 更新 DEVELOPMENT-PLAN.md 版本历程
```

**统计脚本（快速量化所有关卡状态）：**
```python
import re

with open('src/data/missions.ts', 'r') as f:
    content = f.read()

missions = re.findall(r'\{[^{}]*?id:\s*(\d+).*?tutorialSteps:\s*\[(.*?)\]\s*,?\s*\}', content, re.DOTALL)
for mid, steps_raw in missions:
    n_steps = len(re.findall(r'text:\s*\{', steps_raw))
    has_why = '为什么' in steps_raw or 'Why' in steps_raw
    has_check = '验算' in steps_raw or 'Verify' in steps_raw or 'verify' in steps_raw
    status = '✅' if n_steps >= 6 and has_why and has_check else '❌'
    print(f'{status} id:{mid:5s} steps:{n_steps} why:{has_why} check:{has_check}')
```

---

## 九、关联项目

| 项目 | 根目录 | 关系 |
|------|--------|------|
| **ExamHub** | `/Users/zhuxingzhe/Project/ExamBoard/25Maths-Keywords` | 共享 Supabase (ref: jjjigohjvmyewasmmmyf)，共享用户账号 |
| **25Maths Website** | `/Users/zhuxingzhe/Project/ExamBoard/25maths-website` | play.25maths.com 是子域名 |
| **CIE Analysis** | `/Users/zhuxingzhe/Project/ExamBoard/CIE/IGCSE_v2/analysis/` | 知识点来源 |

**Supabase 关键表**:
- `gl_user_progress`: 用户闯关进度（Play 核心数据）
- `gl_assignments`: 教师布置任务（Phase D）
- `student_profiles`: 共享用户档案

---

## 十、用户偏好（接手 AI 必读）

1. **批量执行**: 计划确认后按优先级自动推进，不逐项确认（说"继续"就继续下一项）
2. **多轮审查**: 至少 3-5 轮，直到零问题，不能只审查一轮就说"完成了"
3. **验收驱动**: 每步 build + 验证，不跳过
4. **为学生服务**: 一切设计决策以"基础最薄弱的学生能否理解"为标准
5. **叙事优先**: 教程不是干燥的步骤，是三国故事中的对话——关羽/赵云/诸葛亮等角色要贯穿
6. **发现问题必须修复**: 审查发现的问题不是"遗留列表"，是当场必修的
7. **交接滴水不漏**: 每次对话结束前更新 DEVELOPMENT-PLAN.md + 版本号

---

## 十一、下一步计划

按优先级排序：

| 优先级 | 任务 | 说明 |
|--------|------|------|
| ~~HIGH~~ | ~~TREE_DIAGRAM~~ | ✅ Y9 id=9148/9149，条件概率不放回 |
| ~~HIGH~~ | ~~SEQUENCE_NTH~~ | ✅ Y10 id=1055/1056 + Y11 id=1133，等差+等比第n项 |
| ~~MEDIUM~~ | ~~蜀道远征~~ | ✅ 8节点(荆州→成都)，Y8-10，expeditions.ts |
| ~~LOW~~ | ~~COORD_3D~~ | ✅ Y10 id=1066/1067，三维中点(含负坐标)，midpoint+distance modes |
| ~~MEDIUM~~ | ~~VECTOR_3D~~ | ✅ Y12 id=1241/1242，三维向量加法(含负分量)，6步教程 |
| ~~LOW~~ | ~~INTEGRAL_AREA~~ | ✅ Y12 id=1251/1252，定积分求面积，用现有INTEGRATION类型 |
| LOW | **missions.ts 拆分已完成** | ✅ 已按年级拆分 |
| FUTURE | **班级远征** | 多人协作通关 |

---

## 十二、一键验证脚本

接手后运行以下命令验证环境就绪：

```bash
# 进入项目目录
cd /Users/zhuxingzhe/Project/ExamBoard/25maths-games-legends

# 1. 构建验证
npm run build 2>&1 | tail -3

# 2. 测试验证
npm test -- --run 2>&1 | tail -5

# 3. 重复ID检查（必须为空）
grep -o 'id: [0-9]*' src/data/missions.ts | sort | uniq -d

# 4. 关卡总数统计
grep -c 'generatorType:' src/data/missions.ts

# 5. Y12 遗留状态
grep -A 20 'id: 1211' src/data/missions.ts | grep -c 'text:'
```

**预期输出**:
- Build: `✓ built in X.XXs`（无 ERROR）
- Tests: `2339 passed`
- 重复ID: 空输出
- 关卡数: ~210
- Y12 步骤: ≥6（当前已完成）
