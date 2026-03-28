-- ============================================================
-- 学生班级分配审计报告
-- 在 Supabase Dashboard → SQL Editor 中运行
-- ============================================================

-- 1. 全部已注册学生概览（按班级分组）
SELECT
  '已注册学生总览' AS report_section;

SELECT
  COALESCE(
    CASE WHEN array_length(g.class_tags, 1) > 0
         THEN g.class_tags[1]
         ELSE '❌ 未分班'
    END,
    '❌ 未分班'
  ) AS class,
  g.grade AS selected_grade,
  COUNT(*) AS student_count
FROM gl_user_progress g
JOIN auth.users u ON u.id = g.user_id
GROUP BY class, g.grade
ORDER BY class, g.grade;

-- 2. 未分班学生详细列表（有账号但没有 class_tags）
SELECT
  '未分班学生列表' AS report_section;

SELECT
  u.email,
  g.display_name,
  g.grade AS current_grade,
  g.class_name,
  g.class_tags,
  g.total_score,
  g.updated_at::date AS last_active
FROM gl_user_progress g
JOIN auth.users u ON u.id = g.user_id
WHERE g.class_tags IS NULL
   OR array_length(g.class_tags, 1) IS NULL
   OR array_length(g.class_tags, 1) = 0
ORDER BY g.grade, g.display_name;

-- 3. 已分班学生列表（确认分配正确性）
SELECT
  '已分班学生列表' AS report_section;

SELECT
  u.email,
  g.display_name,
  g.grade AS current_grade,
  g.class_tags[1] AS primary_class,
  g.class_tags,
  g.total_score,
  g.updated_at::date AS last_active
FROM gl_user_progress g
JOIN auth.users u ON u.id = g.user_id
WHERE array_length(g.class_tags, 1) > 0
ORDER BY g.class_tags[1], g.display_name;

-- 4. 班级标签与 grade 不匹配的学生（如 class_tags=7A 但 grade=8）
SELECT
  '班级与年级不匹配' AS report_section;

SELECT
  u.email,
  g.display_name,
  g.grade AS current_grade,
  g.class_tags[1] AS primary_class,
  CASE
    WHEN g.class_tags[1] ~ '^\d+'
    THEN CAST(regexp_replace(g.class_tags[1], '[^0-9]', '', 'g') AS INT)
    ELSE NULL
  END AS class_grade,
  CASE
    WHEN g.grade != CAST(regexp_replace(g.class_tags[1], '[^0-9]', '', 'g') AS INT)
    THEN '⚠️ 不匹配：学生可能换了年级学习'
    ELSE '✅ 匹配'
  END AS status
FROM gl_user_progress g
JOIN auth.users u ON u.id = g.user_id
WHERE array_length(g.class_tags, 1) > 0
  AND g.class_tags[1] ~ '^\d+'
  AND g.grade != CAST(regexp_replace(g.class_tags[1], '[^0-9]', '', 'g') AS INT)
ORDER BY g.class_tags[1];

-- 5. 哈罗邮箱学生 vs 非哈罗邮箱
SELECT
  '哈罗 vs 非哈罗' AS report_section;

SELECT
  CASE
    WHEN u.email LIKE '%@harrowhaikou.cn' THEN '🏫 哈罗海口'
    WHEN u.email LIKE '%@harrow%' THEN '🏫 哈罗其他'
    ELSE '🌐 校外'
  END AS school,
  COUNT(*) AS count,
  SUM(CASE WHEN array_length(g.class_tags, 1) > 0 THEN 1 ELSE 0 END) AS assigned,
  SUM(CASE WHEN array_length(g.class_tags, 1) IS NULL OR array_length(g.class_tags, 1) = 0 THEN 1 ELSE 0 END) AS unassigned
FROM gl_user_progress g
JOIN auth.users u ON u.id = g.user_id
GROUP BY school
ORDER BY count DESC;

-- 6. 教师班级列表（邀请码状态）
SELECT
  '教师班级 + 邀请码' AS report_section;

SELECT
  tc.name AS class_name,
  tc.grade,
  tc.invite_code,
  tc.is_active,
  u.email AS teacher_email,
  (SELECT COUNT(*) FROM gl_user_progress g WHERE g.class_tags @> ARRAY[tc.name]) AS student_count
FROM teacher_classes tc
JOIN auth.users u ON u.id = tc.teacher_id
ORDER BY tc.grade, tc.name;
