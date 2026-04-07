# Changelog

## [10.10.0] — 2026-04-07

### Added
- **meta_node_progress 统一进度表** — 跨产品进度同步基础设施
  - Supabase 迁移: `meta_node_progress` 表 (PK: user_id, kn_id, source)
  - `upsert_meta_node_progress()` RPC — 原子 upsert + FLM 自动计算
  - `get_student_meta_progress()` RPC — 教师/学生读取 (SECURITY DEFINER)
  - RLS 策略: 用户仅可读写自己的行

- **App.tsx 写入路径** (2 处 fire-and-forget)
  - 成功路径 (line 818): `upsert_meta_node_progress({ p_correct: true })`
  - 失败路径 (line 840): `upsert_meta_node_progress({ p_correct: false })`
  - kn_id 来源: `getKnIdForKp(activeMission.kpId)` (424/425 missions 覆盖)

- **StudentDetailCard 统一进度面板**
  - 读取 `get_student_meta_progress` RPC
  - 显示: Play 掌握度% | Practice 准确率% | 综合已掌握数

- **KPWeaknessPanel 跨产品掌握度**
  - 读取 `meta_node_progress` 表, 构建 kn_id → mastery_score 映射
  - 每个 KP 行显示 "综合 X%" 统一掌握度

- **MetaNodeProgressRow 类型** (`dashboard/types.ts`)

### FLM 状态计算
- `new`: attempts = 0
- `learning`: attempts ≥ 1
- `familiar`: wins ≥ 2 AND mastery ≥ 60%
- `mastered`: wins ≥ 4 AND mastery ≥ 80%
