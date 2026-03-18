# 25Maths Play (games-legends) — Claude Code 项目规范

## 启动协议

每次新对话开始时，按此顺序执行：

1. **读取项目状态**: `memory/project_play25maths_v5.md` → 当前版本、关卡数、架构
2. **读取教学共识**: `memory/feedback_play25maths_pedagogy.md` → 金标准、学生画像、Anti-patterns
3. **读取开发计划**: `docs/DEVELOPMENT-PLAN.md` → 版本历程、下一步
4. **如果做 Y8**: `docs/Y8-DEVELOPMENT-PLAN.md` → 完整接手计划（关卡清单/知识点/叙事/审查清单）
5. **构建确认**: `npm run build` → 必须零错误才能开始

## 项目信息

- **根目录**: `/Users/zhuxingzhe/Project/ExamBoard/25maths-games-legends`
- **部署**: push main → GitHub Actions → play.25maths.com
- **版本**: v5.0.0 (2026-03-19)
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
| `docs/DEVELOPMENT-PLAN.md` | 主开发计划 + 版本历程 (v0.1→v5.0) | **必读** |
| `docs/Y8-DEVELOPMENT-PLAN.md` | Y8 接手计划（完整） | Y8 开发时必读 |
| `Y7-tutorial-content-review.md` | Y7 教程内容规格（旧，仅参考） | 低 |
| `README.md` | 项目简介 | 低 |

### Memory 文件 (自动加载)
| 文件 | 用途 | 优先级 |
|------|------|--------|
| `project_play25maths_v5.md` | 项目状态快照（关卡/架构/遗留问题） | **必读** |
| `feedback_play25maths_pedagogy.md` | 教学质量标准 + 用户共识 | **必读** |
| `feedback_play25maths_workflow.md` | "继续"指令的 8 步流程 | 高 |
| `feedback_education_first_question.md` | 教育产品首要问题 | 高 |
| `project_play25maths_review.md` | 严苛审查报告 (v1.3 时写的，部分过时) | 低 |
| `project_legends_audio.md` | 音频体系状态 | 低 |

### 核心源文件
| 文件 | 行数 | 说明 |
|------|------|------|
| `src/data/missions.ts` | ~2500 | 全部关卡定义（Y7: 690-773, Y8: 811-842, Y9+: 1011+） |
| `src/utils/generateMission.ts` | ~5100 | 全部生成器（28+个） |
| `src/utils/checkCorrectness.ts` | ~300 | 答案校验 |
| `src/types.ts` | ~140 | Language / QuestionType / Mission 类型 |
| `src/i18n/translations.ts` | ~460 | 三语 UI 翻译 (zh/zh_TW/en) |
| `src/i18n/zhHantMap.ts` | ~160 | 简→繁 300 字符映射 |
| `src/i18n/resolveText.ts` | ~45 | lt() 三语访问函数 |
| `src/data/curriculum/kp-registry.ts` | ~800 | CIE 0580 的 294 个知识点注册表 |
| `src/components/diagrams/` | 11 文件 | SVG 图表组件库 |
| `src/screens/PracticeScreen.tsx` | ~530 | 练习模式主屏幕 |
| `src/components/MathBattle/index.tsx` | ~570 | 闯关模式主组件 |
| `src/components/MathBattle/inputConfig.ts` | ~170 | 每个题型的输入字段配置 |
| `.github/workflows/deploy.yml` | — | GitHub Actions 自动部署配置 |

## 开发规范

### 新增关卡流程 (7 个文件)
```
types.ts → translations.ts(×3语) → inputConfig.ts → checkCorrectness.ts
→ generateMission.ts(类型注册+生成器函数) → missions.ts → PracticeScreen.tsx(可选SVG)
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

1. **重复 ID**: `grep -o 'id: [0-9]*' src/data/missions.ts | sort | uniq -d` 必须为空
2. **生成器 data ↔ checker 对齐**: generator 输出的字段名必须与 checker 读取的一致
3. **共享生成器副作用**: 修改如 LINEAR_RANDOM 会影响所有年级，建议创建年级变体
4. **FractionPie step 映射**: step 从 0 开始，不是 1
5. **SVG 中不能用 LaTeX**: `<text>` 标签内 `\frac{}{}` 不会渲染，用 SVG 手绘
6. **translations 三处都要加**: zh + zh_TW + en
7. **`data.op` 必须被生成器尊重**: 如 FRAC_ADD_RANDOM 的 template.data.op

## 用户偏好

- **批量执行**: 计划确认后按优先级自动推进，不逐项确认
- **多轮审查**: 至少 3-5 轮，直到零问题
- **验收驱动**: 每步 build + 验证
- **为学生服务**: 一切设计决策以"基础最薄弱的学生能否理解"为标准
