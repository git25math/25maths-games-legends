-- ============================================================
-- 批量创建学生账号 (2026-04-03)
-- 在 Supabase Dashboard → SQL Editor 中运行
-- ============================================================
-- 学生列表：
--   julia.feng@harrowhaikou.cn  → Y9, 9A
--   ruining.jia@harrowhaikou.cn → Y9, 9B
--   bonnie.ma@harrowhaikou.cn   → Y8, 8A
-- 密码：123456
-- ============================================================

-- Step 1: 创建 auth 用户
-- 使用 Supabase 内置函数创建，确保 identities 同步

DO $$
DECLARE
  uid1 UUID;
  uid2 UUID;
  uid3 UUID;
BEGIN
  -- 1. julia.feng@harrowhaikou.cn
  INSERT INTO auth.users (
    instance_id, id, aud, role, email,
    encrypted_password, email_confirmed_at,
    created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, confirmation_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(), 'authenticated', 'authenticated',
    'julia.feng@harrowhaikou.cn',
    crypt('123456', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"nickname":"julia.feng"}',
    false, ''
  ) RETURNING id INTO uid1;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (uid1, uid1, jsonb_build_object('sub', uid1::text, 'email', 'julia.feng@harrowhaikou.cn'), 'email', uid1::text, now(), now(), now());

  -- 2. ruining.jia@harrowhaikou.cn
  INSERT INTO auth.users (
    instance_id, id, aud, role, email,
    encrypted_password, email_confirmed_at,
    created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, confirmation_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(), 'authenticated', 'authenticated',
    'ruining.jia@harrowhaikou.cn',
    crypt('123456', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"nickname":"ruining.jia"}',
    false, ''
  ) RETURNING id INTO uid2;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (uid2, uid2, jsonb_build_object('sub', uid2::text, 'email', 'ruining.jia@harrowhaikou.cn'), 'email', uid2::text, now(), now(), now());

  -- 3. bonnie.ma@harrowhaikou.cn
  INSERT INTO auth.users (
    instance_id, id, aud, role, email,
    encrypted_password, email_confirmed_at,
    created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, confirmation_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(), 'authenticated', 'authenticated',
    'bonnie.ma@harrowhaikou.cn',
    crypt('123456', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"nickname":"bonnie.ma"}',
    false, ''
  ) RETURNING id INTO uid3;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (uid3, uid3, jsonb_build_object('sub', uid3::text, 'email', 'bonnie.ma@harrowhaikou.cn'), 'email', uid3::text, now(), now(), now());

  -- Step 2: 创建 gl_user_progress 记录（含年级和班级）
  INSERT INTO gl_user_progress (user_id, display_name, total_score, grade, selected_char_id, completed_missions, stats, class_tags, class_name)
  VALUES
    (uid1, 'julia.feng', 0, 9, '', '{}', '{"Algebra":0,"Geometry":0,"Functions":0,"Calculus":0,"Statistics":0}', ARRAY['9A'], '9A'),
    (uid2, 'ruining.jia', 0, 9, '', '{}', '{"Algebra":0,"Geometry":0,"Functions":0,"Calculus":0,"Statistics":0}', ARRAY['9B'], '9B'),
    (uid3, 'bonnie.ma',   0, 8, '', '{}', '{"Algebra":0,"Geometry":0,"Functions":0,"Calculus":0,"Statistics":0}', ARRAY['8A'], '8A');

  RAISE NOTICE '✅ 创建完成: julia.feng(%), ruining.jia(%), bonnie.ma(%)', uid1, uid2, uid3;
END $$;

-- Step 3: 验证创建结果
SELECT u.email, g.display_name, g.grade, g.class_tags, g.class_name
FROM auth.users u
JOIN gl_user_progress g ON g.user_id = u.id
WHERE u.email IN ('julia.feng@harrowhaikou.cn', 'ruining.jia@harrowhaikou.cn', 'bonnie.ma@harrowhaikou.cn');
