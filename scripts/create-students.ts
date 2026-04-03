/**
 * 批量创建学生账号脚本
 * 用法: npx tsx scripts/create-students.ts
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jjjigohjvmyewasmmmyf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqamlnb2hqdm15ZXdhc21tbXlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzOTgzNDYsImV4cCI6MjA4Njk3NDM0Nn0.P2L7t9v7Cj89vwkPHjRyp-h70Mawwov6mHyw7u6ALcY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const students = [
  { email: 'julia.feng@harrowhaikou.cn', password: '123456', grade: 9, classTag: '9A', displayName: 'julia.feng' },
  { email: 'ruining.jia@harrowhaikou.cn', password: '123456', grade: 9, classTag: '9B', displayName: 'ruining.jia' },
  { email: 'bonnie.ma@harrowhaikou.cn',   password: '123456', grade: 8, classTag: '8A', displayName: 'bonnie.ma' },
];

const DEFAULT_STATS = { Algebra: 0, Geometry: 0, Functions: 0, Calculus: 0, Statistics: 0 };

async function createStudent(s: typeof students[0]) {
  console.log(`\n--- 创建 ${s.email} ---`);

  // 1. 注册账号
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: s.email,
    password: s.password,
  });

  if (authError) {
    console.error(`  注册失败: ${authError.message}`);
    return false;
  }

  const userId = authData.user?.id;
  if (!userId) {
    console.error('  注册失败: 未返回 user id');
    return false;
  }
  console.log(`  注册成功: ${userId}`);

  // 2. 创建 profile（含年级和班级）
  const { error: profileError } = await supabase.from('gl_user_progress').upsert({
    user_id: userId,
    display_name: s.displayName,
    total_score: 0,
    grade: s.grade,
    selected_char_id: '',
    completed_missions: {},
    stats: DEFAULT_STATS,
    class_tags: [s.classTag],
    class_name: s.classTag,
  });

  if (profileError) {
    console.error(`  Profile 创建失败: ${profileError.message}`);
    return false;
  }
  console.log(`  Profile 创建成功: Y${s.grade}, ${s.classTag}`);

  // 登出当前会话，为下一个学生做准备
  await supabase.auth.signOut({ scope: 'local' });
  return true;
}

async function main() {
  console.log('开始批量创建学生账号...\n');

  let success = 0;
  for (const s of students) {
    const ok = await createStudent(s);
    if (ok) success++;
  }

  console.log(`\n===== 完成: ${success}/${students.length} 个账号创建成功 =====`);
}

main().catch(console.error);
