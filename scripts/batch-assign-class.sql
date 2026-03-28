-- ============================================================
-- 批量分配班级
-- 在 Supabase Dashboard → SQL Editor 中运行
-- 使用方法：修改下面的 VALUES 列表，然后执行
-- ============================================================

-- 方式 1：按邮箱批量分配班级
-- 将邮箱和对应班级填入下面的列表

WITH assignments(email, class_tag) AS (
  VALUES
    -- ▼▼▼ 在这里填入学生邮箱和班级 ▼▼▼
    ('student1@harrowhaikou.cn', '7A'),
    ('student2@harrowhaikou.cn', '7B'),
    ('student3@harrowhaikou.cn', '8A')
    -- ▲▲▲ 添加更多行 ▲▲▲
)
UPDATE gl_user_progress g
SET
  class_tags = CASE
    WHEN g.class_tags @> ARRAY[a.class_tag] THEN g.class_tags  -- 已有则跳过
    ELSE array_append(COALESCE(g.class_tags, '{}'), a.class_tag)
  END,
  class_name = COALESCE(g.class_name, a.class_tag),
  updated_at = now()
FROM assignments a
JOIN auth.users u ON u.email = a.email
WHERE g.user_id = u.id
RETURNING u.email, g.display_name, a.class_tag AS assigned_class, g.class_tags;

-- ============================================================
-- 方式 2：按邮箱域名批量分配（所有哈罗未分班学生 → 根据 grade 自动分到 A 班）
-- ============================================================

-- UPDATE gl_user_progress g
-- SET
--   class_tags = array_append(COALESCE(g.class_tags, '{}'), g.grade || 'A'),
--   class_name = COALESCE(g.class_name, g.grade || 'A'),
--   updated_at = now()
-- FROM auth.users u
-- WHERE g.user_id = u.id
--   AND u.email LIKE '%@harrowhaikou.cn'
--   AND (g.class_tags IS NULL OR array_length(g.class_tags, 1) = 0)
-- RETURNING u.email, g.display_name, g.grade, g.class_tags;

-- ============================================================
-- 方式 3：创建缺失的班级（确保 teacher_classes 中有对应记录）
-- ============================================================

-- INSERT INTO teacher_classes (teacher_id, name, invite_code, grade)
-- SELECT
--   (SELECT id FROM auth.users WHERE email = 'nzhu@harrowhaikou.cn'),
--   class_name,
--   upper(substr(md5(random()::text), 1, 6)),
--   grade
-- FROM (VALUES
--   ('7A', 7), ('7B', 7), ('7C', 7),
--   ('8A', 8), ('8B', 8), ('8C', 8),
--   ('9A', 9), ('9B', 9), ('9C', 9),
--   ('10A', 10), ('10B', 10), ('10C', 10),
--   ('11A', 11), ('11B', 11), ('11C', 11)
-- ) AS classes(class_name, grade)
-- WHERE NOT EXISTS (
--   SELECT 1 FROM teacher_classes tc WHERE tc.name = classes.class_name
-- )
-- RETURNING name, invite_code, grade;
