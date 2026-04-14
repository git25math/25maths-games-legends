// Super-admin allowlist for privileged actions (e.g., changing grade after initial setup).
// Regular students set grade once via GradeSelectScreen; only super admins can change it later.

import type { User } from '@supabase/supabase-js';

const SUPER_ADMIN_EMAILS: readonly string[] = [
  'zhuxingda86@hotmail.com',
];

/** True if the given authenticated user is a super admin. */
export function isSuperAdmin(user: User | null | undefined): boolean {
  const email = user?.email?.toLowerCase();
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.includes(email);
}
