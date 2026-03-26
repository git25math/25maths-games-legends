# 25Maths Play (games-legends) — Codex/AI 接手规范

> **重要**: 完整开发规范见 `docs/CONTRIBUTING.md`（适用于任何 AI/人类开发者）。
> 本文件是 Codex / OpenAI Agents / 任何外部 AI 专用的启动协议 + 深度交接文档。
> **最后更新**: v8.9.0 (2026-03-26)

---

## 一、强制启动协议（每次必做，顺序不可变）

```
Step 1: npm run build         → 必须零错误，否则不能改任何代码
Step 2: 读 docs/CONTRIBUTING.md → 唯一权威规范（金标准/反模式/审查标准）
Step 3: 读 docs/DEVELOPMENT-PLAN.md → 版本历程 + 下一步计划
Step 4: 读本文件第三章"当前状态快照" → 210 关卡/已完成/遗留
Step 5: npm test -- --run     → 1776 测试必须全通过
```

---

## 二、项目基础信息

| 字段 | 值 |
|------|----|
| **根目录** | `/Users/zhuxingzhe/Project/ExamBoard/25maths-games-legends` |
| **部署** | push main → GitHub Actions → https://play.25maths.com |
| **仓库** | `git25math/25maths-games-legends` |
| **当前版本** | v8.9.0 (2026-03-26) |
| **技术栈** | React 19 + TypeScript + Vite + KaTeX + Supabase |
| **测试框架** | Vitest (1776 tests, `npm test -- --run`) |
| **部署验证** | `gh run list --repo git25math/25maths-games-legends --limit 1` |

---

## 三、当前状态快照（v8.9.0, 2026-03-26）

### 规模
- **210 missions** 分布: Y7(57) + Y8(40) + Y9(43) + Y10(40) + Y11(25) + Y12(5)
- **71 个活跃 generatorType**，100% 覆盖（所有关卡均有动态生成器）
- **1,776 个 Vitest 用例**（当前 `src/__tests__/generators.test.ts` 全绿）

### 教程质量覆盖率（截至 v8.9.0）

| 年级 | 关卡数 | 6步金标准 | WHY开场 | 验算结尾 | 状态 |
|------|--------|-----------|---------|---------|------|
| Y7 | 57 | ✅ 全达标 | ✅ 全达标 | ✅ 全达标 | **金标准** |
| Y8 | 40 | ✅ 全达标 | ✅ 全达标 | ✅ 全达标 | **金标准** ← v8.8.0 新完成 |
| Y9 | 43 | ✅ 全达标 | ✅ 全达标 | ✅ 全达标 | **金标准** |
| Y10 | 40 | ✅ 全达标 | ✅ 全达标 | ✅ 全达标 | **金标准** |
| Y11 | 25 | ✅ 全达标 | ✅ 全达标 | ✅ 全达标 | **金标准** |
| Y12 | 5 | ✅ 全达标 | ✅ 全达标 | ✅ 全达标 | **金标准** ← v8.9.0 新完成 |

**结论**: Y7-Y12 全部 210 关卡均达金标准。

### 本轮完成（v8.5→v8.9, 2026-03-26）

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

### 已知遗留问题

| 优先级 | 问题 | 位置 | 建议 |
|--------|------|------|------|
| MEDIUM | 构建仍有 >500 kB chunk 警告 | Vite build output | 继续拆 `missions` / `index` 入口，增加延迟加载 |
| INFO | missions.ts 体量 ~4700 行，未来可拆分 | missions.ts | 可按年级拆成 y7.ts/y8.ts 等 |

---

## 四、文件地图

### 必读文档
| 文件 | 用途 | 优先级 |
|------|------|--------|
| `docs/CONTRIBUTING.md` | **唯一权威规范**（金标准/反模式/审查/新关卡流程） | **必读** |
| `docs/DEVELOPMENT-PLAN.md` | 版本历程 v0.1→v8.9 + 下一步计划 | **必读** |
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
npm test -- --run     # 1776 tests 全通过
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
| HIGH | **CI 质量门禁** | GitHub Actions 补上 `npm run lint` + `npm test -- --run` |
| MEDIUM | **Y7 Tutorial Refresh** | 部分 Y7 教程叙事老旧，按现代三国风格重写 |
| MEDIUM | **新题型 SIMILAR_TRIANGLES** | Y9 相似三角形，有生成器需求 |
| LOW | **missions.ts 拆分** | 按年级拆成 y7-missions.ts 等，降低文件体积 |
| LOW | **Bundle 拆分** | 减少 `missions` / `index` chunk 体积 |
| FUTURE | **v9.0.0 三币经济** | 金/银/铜三种货币系统 |
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
- Tests: `1776 passed`
- 重复ID: 空输出
- 关卡数: ~210
- Y12 步骤: 3（已知遗留，需升级至6）
