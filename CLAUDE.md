# 25Maths Play (games-legends) — 项目规范

> **重要**: 完整开发规范见 `docs/CONTRIBUTING.md`（适用于任何 AI/人类开发者）。
> 本文件是 Claude Code 专用的启动协议补充。
> 如与 `AGENTS.md` 冲突，以 `AGENTS.md` 和 `docs/CONTRIBUTING.md` 为准。

## 启动协议

每次新对话开始时，按此顺序执行：

1. **构建确认**: `npm run build` → 必须零错误才能开始
2. **读取接手文档**: `AGENTS.md` → 当前状态快照、优先级、遗留问题
3. **读取开发规范**: `docs/CONTRIBUTING.md` → 金标准、叙事原则、审查标准、Bug 防范规则
4. **读取开发计划**: `docs/DEVELOPMENT-PLAN.md` → 版本历程、下一步
5. **测试确认**: `npm test -- --run` → 必须 1776 passed 才能继续

## 项目信息

- **根目录**: `/Users/zhuxingzhe/Project/ExamBoard/25maths-games-legends`
- **部署**: push main → GitHub Actions → play.25maths.com
- **版本**: v8.9.0 (2026-03-26)
- **仓库**: `git25math/25maths-games-legends`

## 关联项目

| 项目 | 根目录 | 关系 |
|------|--------|------|
| **ExamHub** | `/Users/zhuxingzhe/Project/ExamBoard/25Maths-Keywords` | 共享 Supabase (ref: jjjigohjvmyewasmmmyf)，共享用户账号 |
| **25Maths Website** | `/Users/zhuxingzhe/Project/ExamBoard/25maths-website` | play.25maths.com 是子域名 |
| **CIE Analysis** | `/Users/zhuxingzhe/Project/ExamBoard/CIE/IGCSE_v2/analysis/` | 知识点来源 |

## 文件地图

### 项目内文档
| 文件 | 用途 | 优先级 |
|------|------|--------|
| `docs/DEVELOPMENT-PLAN.md` | 主开发计划 + 版本历程 (v0.1→v8.9) | **必读** |
| `docs/Y8-DEVELOPMENT-PLAN.md` | Y8 接手计划（完整） | Y8 开发时必读 |
| `docs/BUG-POSTMORTEM.md` | Bug 根因分析 + 9 条防范规则 | **开发前必读** |
| `docs/OPTIMIZATION-HISTORY.md` | v0.1→v7.3 全量优化分析（规模/架构/质量/性能） | 参考 |
| `Y7-tutorial-content-review.md` | Y7 教程内容规格（旧，仅参考） | 低 |
| `README.md` | 项目简介 | 低 |

### 核心源文件
| 文件 | 行数 | 说明 |
|------|------|------|
| `src/data/missions.ts` | ~4920 | 全部关卡定义（Y7-Y12 共 210 关） |
| `src/utils/generateMission.ts` | ~5 | 向后兼容的 barrel export |
| `src/utils/generators/` | 7 文件 | 按章节拆分的生成器实现（71 个活跃类型） |
| `src/utils/checkCorrectness.ts` | ~410 | 答案校验 |
| `src/types.ts` | ~193 | Language / QuestionType / Mission 类型 |
| `src/i18n/translations.ts` | ~741 | 三语 UI 翻译 (zh/zh_TW/en) |
| `src/i18n/zhHantMap.ts` | ~125 | 简→繁字符映射 |
| `src/i18n/resolveText.ts` | ~45 | lt() 三语访问函数 |
| `src/data/curriculum/kp-registry.ts` | ~296 | CIE 0580 的 294 个知识点注册表 |
| `src/components/diagrams/` | 47 文件 | SVG 图表组件库 |
| `src/screens/PracticeScreen.tsx` | ~685 | 练习模式主屏幕 |
| `src/components/MathBattle/index.tsx` | ~523 | 闯关模式主组件 |
| `src/components/MathBattle/inputConfig.ts` | ~196 | 每个题型的输入字段配置 |
| `.github/workflows/deploy.yml` | — | GitHub Actions 自动部署配置 |

## 开发规范

### 新增关卡流程 (7 个文件)
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
7. 叙事贯穿始终

### 三语支持
- 写 `{zh, en}` 即可，繁体自动转换
- UI 翻译: translations.ts 中 zh_TW 需手动写
- 组件内 LABELS: 需加 zh_TW 条目
- INPUT_FIELDS: zh_TW 自动降级到 zh

### Git 规范
- commit 前必须 `npm run build` 零错误
- push main 自动部署
- 用 `gh run list --repo git25math/25maths-games-legends --limit 1` 验证部署

## 审计时特别注意

> 详细根因分析见 `docs/BUG-POSTMORTEM.md`（9 条防范规则 + 旧生成器回查结果）

1. **重复 ID (规则H)**: `grep -o 'id: [0-9]*' src/data/missions.ts | sort | uniq -d` 必须为空
2. **生成器 data ↔ checker 对齐**: generator 输出的字段名必须与 checker 读取的一致
3. **共享生成器副作用**: 修改如 LINEAR_RANDOM 会影响所有年级，建议创建年级变体
4. **FractionPie step 从 0 开始 (规则C)**: step=0 就要有内容
5. **SVG 内不用 LaTeX (规则F)**: `<text>` 标签内用 SVG 手绘分数线
6. **translations 三处都要加**: zh + zh_TW + en
7. **生成器必须尊重 template.data (规则A)**: op/mode/func 等控制字段不能随机覆盖
8. **formula 用短公式 (规则G)**: 不要在 `\text{}` 里放长中文句子
9. **新文件必须 git add (规则I)**: commit 前 `git status` 检查 `??` 未跟踪文件

## 用户偏好

- **批量执行**: 计划确认后按优先级自动推进，不逐项确认
- **多轮审查**: 至少 3-5 轮，直到零问题
- **验收驱动**: 每步 build + 验证
- **为学生服务**: 一切设计决策以"基础最薄弱的学生能否理解"为标准
