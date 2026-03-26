# Play 教师看板升级计划 (v8.0)

> **状态**：Phase A-D 全部完成 ✅ | **日期**：2026-03-26
> **前置阅读**：`docs/DEVELOPMENT-PLAN.md`、ExamHub `js/admin.js`、`js/homework.js`

---

## 一、现状审计

### 1.1 Play 现有看板 (DashboardScreen.tsx, 600 行)

| 已有功能 | 说明 |
|----------|------|
| 年级过滤 | Y7–Y11 下拉 |
| 班级标签过滤 | 多标签芯片（7A/7B/EA 等） |
| 学生列表 | 姓名 + 总分 + 整体进度 % + KP 掌握数 |
| 单元进度点 | 每单元 🟢🟡🔴 三点 + X/total |
| 批量标签管理 | 给全年级加标签 / 单个增删 |
| 实时更新 | Supabase realtime 订阅 + 绿色 Live 指示灯 |
| 访问控制 | 硬编码邮箱（仅 1 人可访问） |

### 1.2 ExamHub 教师系统（对比）

| ExamHub 功能 | Play 是否有 |
|-------------|------------|
| 班级管理（创建/删除/邀请码） | ❌ 只有标签 |
| 学生花名册（改名/重置密码/移班） | ❌ |
| 作业布置（选 deck/自定义词汇/截止日期） | ❌ |
| 作业追踪（完成率/得分/逐人详情） | ❌ |
| 站内通知推送 | ❌ |
| 词汇掌握率（mastery %）| ❌（只有 KP 掌握数） |
| CSV 导出 | ❌ |

### 1.3 跨平台数据缺口

```
Play 闯关数据 ──→ play_kp_progress ──→ ExamHub 保守提升 KP
                                        ↓
                                   ❌ 无反向流
                                   ❌ 教师看不到统一视图
                                   ❌ Play 不知道 ExamHub 作业
```

**核心问题**：教师在两个平台看到的是割裂的数据，无法回答——
- "这个学生在 Play 练了什么？跟我布置的作业相关吗？"
- "全班哪个知识点最薄弱？我该调整教学吗？"
- "哪些学生需要干预？"

---

## 二、教师真正需要的功能（按优先级）

### P0：核心看板（教师每天必看）

| 功能 | 为什么老师需要 | 数据来源 |
|------|--------------|---------|
| **预警面板** — 自动标红需关注的学生 | 不用逐个检查，一眼看到谁掉队了 | _login.streak + completed_missions + battle_results |
| **班级 KP 热力图** — 知识点 × 学生 矩阵 | 指导备课：哪个 KP 全班都弱 | play_kp_progress + stats |
| **学生详情卡** — 点击弹出完整画像 | 家长会 / 个别谈话需要 | 7 维数据汇总 |

### P1：深度分析（每周查看）

| 功能 | 为什么老师需要 | 数据来源 |
|------|--------------|---------|
| **周报趋势** — 本周 vs 上周活跃度/进度 | 判断班级整体走向 | battle_results 按周聚合 |
| **错题模式分析** — 班级级别的 5 类错误分布 | 针对性教学 | _mistakes 聚合 |
| **题目难度分析** — 哪些关卡全班正确率低 | 调整教学节奏 | battle_results.success 按 mission 聚合 |

### P2：协作与管理（按需使用）

| 功能 | 为什么老师需要 | 数据来源 |
|------|--------------|---------|
| **布置关卡任务** — 指定班级本周必做关卡 | 统一学习进度 | 新表 gl_assignments |
| **多教师支持** — teacher role 替代硬编码 | 其他老师也能看 | teachers 表（已在 ExamHub 存在） |
| **CSV 导出** — 导出班级数据 | 家长会/报告 | 客户端生成 |
| **跨平台视图** — ExamHub 词汇 + Play 闯关 | 统一学情 | 跨表查询 |

---

## 三、7 维学生画像设计

教师点击学生名，弹出详情卡，包含以下 7 个维度：

```
        进度完成率
           ▲
    坚持度 /   \ 掌握度
         /     \
  成长速 ●───────● 活跃度
         \     /
    分布   \  / 错题率
           ▼
```

| # | 维度 | 计算方式 | 数据字段 |
|---|------|---------|---------|
| 1 | **进度完成率** | green missions / total missions | completed_missions |
| 2 | **知识掌握度** | mastered KPs / total KPs for grade | play_kp_progress |
| 3 | **学习活跃度** | 最近 7 天 battle 次数 | gl_battle_results.created_at |
| 4 | **错题控制率** | 1 - (错题数 / 总题数) | _mistakes + battle_results |
| 5 | **连签坚持度** | bestStreak / 30 (capped at 1) | _login.bestStreak |
| 6 | **学科均衡度** | 1 - 标准差(5科进度) / mean | stats |
| 7 | **成长速度** | 本周 XP / 上周 XP | battle_results 按周 |

### 预警规则

| 条件 | 预警级别 | 显示 |
|------|---------|------|
| 3 天未登录 | 🟡 注意 | 黄色标记 |
| 7 天未登录 | 🔴 严重 | 红色标记 + 置顶 |
| 进度落后班级平均 >20% | 🟡 注意 | 黄色进度条 |
| 某 KP 失败 3 次以上 | 🔴 严重 | KP 名称红色高亮 |
| 连续 5 题错误同类型 | 🟡 注意 | 错误模式标签 |

---

## 四、KP 热力图设计

班级级别的知识点掌握矩阵：

```
            kp-1.1  kp-1.2  kp-2.1  kp-2.2  kp-4.1 ...
Student A   🟢      🟢      🟡      🔴      ⬜
Student B   🟢      🟡      🟢      🟡      ⬜
Student C   🔴      🔴      🟡      🟡      ⬜
───────────────────────────────────────────────
班级平均     85%     60%     70%     35%     0%
                                    ↑
                                 全班薄弱！
```

| 颜色 | 含义 | 判定 |
|------|------|------|
| 🟢 | 已掌握 | mastered_at 非空 |
| 🟡 | 学习中 | attempts > 0, 未 mastered |
| 🔴 | 薄弱 | attempts > 2, wins = 0 |
| ⬜ | 未涉及 | 无记录 |

**底部汇总行**：班级平均掌握率 < 50% 的 KP 标红 → 教师备课重点。

---

## 五、技术实现方案

### 5.1 数据库改动

```sql
-- 1. 教师角色（复用 ExamHub 的 teachers 表）
-- Play 查询 teachers 表判断 isTeacher，替代硬编码邮箱

-- 2. 关卡任务（可选，P2）
CREATE TABLE IF NOT EXISTS gl_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_tag TEXT NOT NULL,          -- 目标班级标签
  grade INT NOT NULL,
  mission_ids INT[] NOT NULL,       -- 指定关卡列表
  title TEXT,
  deadline TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 5.2 新增 RPC 函数

```sql
-- 班级 KP 热力图数据
get_class_kp_heatmap(p_grade INT, p_class TEXT)
→ RETURNS TABLE(user_id UUID, display_name TEXT, kp_id TEXT, wins INT, attempts INT, mastered_at TIMESTAMPTZ)

-- 班级战斗统计（周报用）
get_class_battle_stats(p_grade INT, p_class TEXT, p_since TIMESTAMPTZ)
→ RETURNS TABLE(user_id UUID, display_name TEXT, battles INT, wins INT, total_score INT, avg_duration INT)

-- 班级错题模式汇总
get_class_error_patterns(p_grade INT, p_class TEXT)
→ RETURNS TABLE(user_id UUID, display_name TEXT, error_type TEXT, count INT)
```

### 5.3 组件架构

```
src/screens/DashboardScreen.tsx (重构)
├── DashboardHeader.tsx          — 年级/班级切换 + 刷新
├── AlertPanel.tsx               — 预警面板（P0）
├── ClassOverview.tsx            — 班级汇总统计卡片
├── StudentTable.tsx             — 学生列表（现有 + 增强）
├── StudentDetailCard.tsx        — 7 维雷达图弹窗（P0）
│   ├── RadarChart.tsx           — SVG 雷达图
│   ├── BattleHistory.tsx        — 近期战绩列表
│   └── ErrorPatternBar.tsx      — 错题类型分布条
├── KPHeatmap.tsx                — 知识点热力图（P0）
├── WeeklyTrend.tsx              — 周报趋势图（P1）
└── AssignmentPanel.tsx          — 任务布置（P2）
```

### 5.4 不需要数据库改动的功能（纯前端计算）

| 功能 | 数据源 | 计算方式 |
|------|--------|---------|
| 预警标红 | gl_user_progress._login + completed_missions | 客户端检查 lastDate + 进度差 |
| 7 维雷达 | gl_user_progress + play_kp_progress + gl_battle_results | 客户端聚合 |
| 学科均衡度 | stats JSONB | 标准差计算 |
| 周报 | gl_battle_results (过滤 7 天) | 客户端聚合 |

---

## 六、分阶段实施计划

### Phase A: 预警 + 学生详情卡 (v8.0)

**目标**：教师一打开看板，立刻知道谁需要关注。

| 任务 | 说明 | 估计行数 |
|------|------|---------|
| AlertPanel | 预警面板：3天/7天未登录 + 进度落后 + KP 薄弱 | ~150 |
| StudentDetailCard | 点击学生弹出 7 维画像 + 战绩 | ~300 |
| RadarChart | SVG 雷达图组件 | ~100 |
| DashboardScreen 重构 | 拆分 600 行→模块化组件 | 净减少 |

**数据依赖**：零新表，零新 RPC。全部用现有 gl_user_progress + gl_battle_results + play_kp_progress。

### Phase B: KP 热力图 + 周报 (v8.1)

**目标**：教师知道全班薄弱点，调整教学。

| 任务 | 说明 | 估计行数 |
|------|------|---------|
| KPHeatmap | 知识点 × 学生 矩阵 + 底部汇总 | ~250 |
| WeeklyTrend | 本周 vs 上周折线图 | ~150 |
| get_class_kp_heatmap RPC | 服务端聚合（可选，也可客户端算） | ~20 SQL |

### Phase C: 多教师 + CSV 导出 (v8.2)

**目标**：其他老师也能用看板。

| 任务 | 说明 |
|------|------|
| teacher role 判断 | 查 ExamHub `teachers` 表替代邮箱硬编码 |
| CSV 导出 | 客户端生成班级数据 CSV |
| 学生排序增强 | 按任意列排序 |

### Phase D: 任务布置 + 跨平台 (v8.3)

**目标**：Play 和 ExamHub 打通。

| 任务 | 说明 |
|------|------|
| gl_assignments 表 | 教师指定班级本周关卡 |
| 学生端任务提示 | MapScreen 显示"老师布置的任务" |
| ExamHub 数据联动 | 在 Play 看板显示 ExamHub 词汇掌握率 |

---

## 七、与 ExamHub 的整合路线

### 短期（v8.0-8.1）：独立增强
- Play 看板自己做好，不依赖 ExamHub
- 复用 ExamHub 的 `teachers` 表做权限判断

### 中期（v8.2）：数据共享
- Play 看板读取 ExamHub 的 `assignments` 表，显示作业完成状态
- ExamHub 看板读取 `gl_battle_results`，显示 Play 闯关统计

### 长期（v8.3+）：统一看板
- 一个看板同时展示两个平台的数据
- 教师在一个界面完成：查看学情 → 布置作业 → 追踪完成

---

## 八、灵魂检查

> 看板不是给老师"监控"学生用的。它是帮老师**看见**每个学生——
> 看见谁在努力但还没突破，看见谁安静地掉队了，看见谁需要一句鼓励。

设计原则：
1. **预警不是批评** — "3 天未登录"不是"这个学生偷懒"，而是"这个学生可能需要你"
2. **数据是起点不是终点** — 热力图告诉你哪里薄弱，但怎么教是老师的智慧
3. **隐私优先** — 学生之间不可见彼此详情，只有老师能看
4. **简洁优先** — 信息过载比没有信息更糟。每个视图最多 3 个核心指标
