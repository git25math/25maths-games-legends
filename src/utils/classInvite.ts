/**
 * classInvite — Teacher class creation + student join via invite code.
 * Codes are 6-char uppercase alphanumeric (e.g., "MK7A28").
 */
import { supabase } from '../supabase';

/** Generate a random 6-char invite code */
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I confusion
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export type TeacherClass = {
  id: string;
  teacher_id: string;
  name: string;
  invite_code: string;
  grade: number;
  is_active: boolean;
  created_at: string;
};

/** Create a new class (teacher only) */
export async function createClass(name: string, grade: number): Promise<{ class: TeacherClass | null; error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { class: null, error: 'Not authenticated' };

  // Try up to 3 times in case of code collision
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = generateCode();
    const { data, error } = await supabase.from('teacher_classes').insert({
      teacher_id: user.id,
      name: name.trim(),
      invite_code: code,
      grade,
    }).select().single();

    if (error?.code === '23505') continue; // unique violation, retry
    if (error) return { class: null, error: error.message };
    return { class: data as TeacherClass, error: null };
  }
  return { class: null, error: 'Failed to generate unique code' };
}

/** Get all classes for current teacher */
export async function getMyClasses(): Promise<TeacherClass[]> {
  const { data } = await supabase.from('teacher_classes')
    .select('*')
    .order('created_at', { ascending: false });
  return (data || []) as TeacherClass[];
}

/** Student joins a class by invite code */
export async function joinClassByCode(code: string): Promise<{ success: boolean; className?: string; error?: string }> {
  const { data, error } = await supabase.rpc('join_class_by_code', { code: code.toUpperCase().trim() });
  if (error) return { success: false, error: error.message };
  const result = data as { success: boolean; class_name?: string; error?: string; already_joined?: boolean };
  if (!result.success) return { success: false, error: result.error || 'Unknown error' };
  return { success: true, className: result.class_name };
}

/** Deactivate a class (teacher only) */
export async function archiveClass(classId: string): Promise<boolean> {
  const { error } = await supabase.from('teacher_classes')
    .update({ is_active: false })
    .eq('id', classId);
  return !error;
}
