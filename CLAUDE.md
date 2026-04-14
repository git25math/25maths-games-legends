# Play.25maths.com (games-legends) — CLAUDE.md

> **版本**: v10.11.1 | **日期**: 2026-04-14
> **主战场**: 三国故事化闯关 + 教师看板 — 424 关卡 Y7-Y12 + Live Classroom + 班级管理

---

## 零、产品灵魂

> **核心原则**: **用数学推动三国剧情，不是用三国包装数学题**。

- 故事必须与史实吻合，数学必须从情境中自然产生
- 一切设计决策以"基础最薄弱的学生能否理解"为标准
- 教程先说 WHY（为什么要学），再教 HOW（怎么做）

---

## 一、项目概览

| 属性 | 值 |
|------|-----|
| 路径 | `/Users/zhuxingzhe/Project/ExamBoard/25maths-games-legends` |
| 技术栈 | React 19 + TypeScript + Vite + Tailwind + KaTeX + Supabase |
| Supabase | 共享 ref `jjjigohjvmyewasmmmyf` |
| 部署 | push main → GitHub Actions → play.25maths.com |
| 源文件 | ~159 个 TS/TSX |
| 关卡 | 424 个 (Y7:89 + Y8:78 + Y9:95 + Y10:87 + Y11:60 + Y12:15) |
| 生成器 | 81 个活跃 generatorType + 51 个 MC 多选 |
| 题型 | 46 个 QuestionType |
| 测试 | 2,711 个 Vitest 用例 |
| KP 覆盖 | 287/288 = 99.7% (仅 kp-1.14-01 计算器跳过) |

### 架构

```
src/
├── screens/           WelcomeScreen / MapScreen / PracticeScreen / DashboardScreen / ...
├── components/
│   ├── MathBattle/    闯关模式 (index.tsx + BattleHeader/Content/Effects/ResultOverlay)
│   ├── dashboard/     教师看板 (ClassManager/StudentList/KPWeakness/...)
│   ├── diagrams/      47 个 SVG 数学图示组件
│   └── ...            JoinClassModal / NotificationModal / ProgressReport
├── hooks/             useAuth / useProfile / useLiveSession / useNotifications / ...
├── utils/
│   ├── generators/    7 文件，按章节拆分 (ch1-number / ch2-algebra / ...)
│   ├── checkCorrectness.ts   答案校验 (~410 行)
│   └── classInvite.ts        邀请码系统
├── data/
│   ├── missions.ts            关卡数据总入口 (~4920 行，已按年级拆分)
│   ├── curriculum/            KP 注册表 + 知识图谱
│   └── missionSummaries/      教师看板轻量数据
├── i18n/              translations.ts(三语) + zhHantMap.ts(简→繁) + resolveText.ts
└── types.ts           Language / QuestionType / Mission 核心类型
```

### 关联项目

| 项目 | 路径 | 关系 |
|------|------|------|
| **25Maths Practice** | `25maths-practice` | 共享 Supabase，练习平台 |
| **ExamHub** | `25Maths-Keywords` | 共享 Supabase + 用户账号 |
| **25Maths Website** | `25maths-website` | play.25maths.com 是子域名 |
| **CIE Analysis** | `CIE/IGCSE_v2/analysis/` | 知识点数据来源 |

### Supabase 共享表（跨产品）

| 表 | 用途 | 共享方 |
|---|------|--------|
| `auth.users` | 用户账号 | 全部 |
| `teachers` | 教师身份 | 全部 |
| `teacher_classes` | 班级 + 邀请码 | Play + Practice |
| `gl_user_progress` | Play 用户档案 | Play 专有 |
| `gl_battle_results` | 闯关记录 | Play 专有 |
| `gl_rooms` | PK/Live 房间 | Play 专有 |
| `gl_live_responses` | Live Classroom 答题 | Play 专有 |
| `gl_assignments` | 教师布置作业 | Play 专有 |

---

## 二、开发规范

### 启动协议（每次新会话，顺序不可变）

1. `git pull` — 确认最新代码
2. 读本文件 `CLAUDE.md` + `docs/DEVELOPMENT-PLAN.md`
3. `npm run build` — 必须零错误
4. `npm test -- --run` — 必须 2711 passed
5. 开始工作

### 结束协议（每次会话结束前，必须执行）

> **铁律**: 每次会话结束时，必须让任何人/AI 只凭 Git 仓库就能无缝接手。

1. **所有改动已 commit + push** — 不留未提交的本地改动
2. **build 通过** — 最后一次 `npm run build` 零错误
3. **DEVELOPMENT-PLAN.md 已更新**:
   - "当前进度表" 中添加了本次 session 的所有改动
   - "下一步优先级" 根据最新进度调整
4. **金标准文档保持最新**:
   - 发现了新的陷阱 → 补充到 DEVELOPMENT-PLAN.md "陷阱清单"
   - 发现了新的审查遗漏 → 补充到 "审查 checklist"
   - 修改了工作流 → 更新到 "工作流" 章节
5. **DEVELOPMENT-PLAN.md 中有足够信息让接手者独立工作**:
   - 接手者需要的所有上下文（WHY + WHAT + HOW + 标准 + 进度 + 下一步）
   - 不依赖对话历史，不依赖 memory 文件
   - 具体到关卡级别的待办事项
6. **向用户确认**: 告知本次完成了什么，下一步是什么，如何接手

### 新增关卡流程 (7 个文件，顺序不可变)

```
types.ts → translations.ts(×3语) → inputConfig.ts → checkCorrectness.ts
→ generators/index.ts + 对应章节文件(类型注册+生成器函数) → missions.ts → PracticeScreen.tsx(可选SVG)
```

### 教学质量金标准 (7 条铁律)

1. ≥6 步教程
2. 第 1 步 = WHY（不是定义）
3. 前 2 步 = 概念脚手架（生活比喻）
4. 中间步 = 每步一个微操作
5. 倒数第 2 步 = 答案
6. 最后 1 步 = 验算
7. 叙事贯穿始终（三国故事，不只是开场）

### 三语支持

- 写 `{zh, en}` 即可，繁体自动转换
- UI 翻译: `translations.ts` 中 zh_TW 需手动写
- 组件内 LABELS: 需加 zh_TW 条目
- INPUT_FIELDS: zh_TW 自动降级到 zh

### 编码规范

- **TypeScript strict** — `tsc` 零错误
- **双语必须** — 所有面向学生的文字 `{ zh: '...', en: '...' }`
- **懒加载** — 页面用 `React.lazy()`，missions 按年级按需加载
- **structuredClone** — 修改 profile/state 前深拷贝（规则J）
- **latestRef.current** — 闭包中读分数用 ref 不用 state（规则K）

### 发布清单

```bash
npm run build                    # 零错误
npm test -- --run                # 2422 passed
git add <具体文件>                # 不用 git add -A
git commit                       # 有意义的 message
git push                         # 触发 GitHub Actions 部署
# 验证: gh run list --repo git25math/25maths-games-legends --limit 1
```

---

## 三、Anti-Patterns 黑名单

| 禁止 | 原因 |
|------|------|
| `git add -A` 或 `git add .` | 可能包含 .env、大文件、未完成代码 |
| 跳过 `npm run build` | 必须零错误才能 commit |
| 跳过 `npm test -- --run` | 必须全部通过 |
| 修改共享生成器不测全年级 | 如 LINEAR_RANDOM 影响 Y7-Y12，必须创建年级变体或全面回归 |
| SVG `<text>` 内用 LaTeX | SVG 不支持 KaTeX，必须用原生 SVG 元素手绘分数线（规则F）|
| `\text{}` 里放长中文句子 | formula 用短公式，长文字放 concept 字段（规则G）|
| 生成器忽略 template.data | op/mode/func 等控制字段不能随机覆盖，randomization 只是 fallback（规则A）|
| 面向学生文字只写英文 | 双语必须 `{zh, en}` |
| profile/state 浅拷贝后修改 | 必须 `structuredClone` 深拷贝（规则J）|
| 闭包中直接读 `profile.total_score` | 用 `latestScoreRef.current`（规则K）|
| 修改共享 Supabase 表不通知其他产品 | 必须同步 ExamHub/Practice |
| 新文件不 `git add` | commit 前 `git status` 检查 `??` 未跟踪文件（规则I）|
| FractionPie step 检查 `>= 1` | step 从 0 开始，step=0 必须有内容（规则C）|
| 组件内用 `const en = lang === 'en'` + `en ? 'EN' : '中'` 三元 | 绕过 `toTraditional()`，zh_TW 用户看到简体字。用 `tt(lang, 'EN', '简体')` 或 `{zh,en}` + `lt()`（规则M）|

---

## 四、审计必查项（commit 前 checklist）

> 详细根因分析见 `docs/BUG-POSTMORTEM.md`（15 条防范规则）

```bash
# 1. 重复 ID 检查（规则H）— 必须为空
grep -o 'id: [0-9]*' src/data/missions.ts | sort | uniq -d

# 2. build + test
npm run build && npm test -- --run

# 3. 未跟踪文件检查（规则I）
git status  # 检查 ?? 行

# 4. translations 三语检查
# 新 QuestionType 必须在 translations.ts 中有 zh + zh_TW + en
```

---

## 五、关键文件速查

| 文件 | 职责 |
|------|------|
| `src/data/missions.ts` | 关卡数据总入口 (~4920 行，424 关) |
| `src/utils/generators/index.ts` | 生成器注册表 + barrel export |
| `src/utils/generators/ch*.ts` | 按章节拆分的生成器 (7 文件) |
| `src/utils/checkCorrectness.ts` | 答案校验 (~410 行) |
| `src/types.ts` | Language / QuestionType / Mission 类型 |
| `src/i18n/translations.ts` | 三语 UI 翻译 (zh/zh_TW/en) |
| `src/components/MathBattle/inputConfig.ts` | 每个题型的输入字段配置 |
| `src/components/MathBattle/index.tsx` | 闯关模式主组件 (~523 行) |
| `src/screens/PracticeScreen.tsx` | 练习模式主屏幕 (~685 行) |
| `src/screens/MapScreen.tsx` | 地图主界面 (弹层全 lazy) |
| `src/screens/DashboardScreen.tsx` | 教师看板 |
| `src/hooks/useAuth.ts` | Supabase Auth (signIn/signUp/signOut) |
| `src/hooks/useProfile.ts` | 用户档案 (含 Guest 模式) |
| `src/hooks/useLiveSession.ts` | Live Classroom 实时课堂 |
| `src/data/curriculum/kp-registry.ts` | CIE 0580 的 294 个知识点注册表 |
| `src/components/diagrams/` | 47 个 SVG 数学图示组件 |
| `src/utils/classInvite.ts` | 班级邀请码系统 |
| `supabase/migrations/` | 数据库迁移文件 |
| `scripts/` | 批量脚本 (学生创建/审计/生成器验证) |
| `docs/BUG-POSTMORTEM.md` | Bug 根因分析 + 15 条防范规则 |
| `docs/CONTRIBUTING.md` | 完整开发规范 (金标准/叙事原则/审查标准) |
| `.github/workflows/deploy.yml` | CI/CD: lint → test → build → deploy |

---

## 六、用户偏好

- **批量执行**: 计划确认后按优先级自动推进，不逐项确认
- **多轮审查**: 至少 3-5 轮，直到零问题
- **验收驱动**: 每步 build + 验证
- **为学生服务**: 一切设计决策以"基础最薄弱的学生能否理解"为标准
