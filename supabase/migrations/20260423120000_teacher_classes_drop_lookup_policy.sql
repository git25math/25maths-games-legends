-- teacher_classes.lookup_by_code was:
--   FOR SELECT USING (is_active = true)
-- meant to let a student "look up a class by invite code". But the USING
-- clause doesn't mention invite_code at all — it grants SELECT on every
-- active row. A student could enumerate every active class in the system:
--   SELECT invite_code, name, teacher_id, grade FROM teacher_classes WHERE is_active
-- then join any class by replaying the invite_code through join_class_by_code.
--
-- The legitimate join flow already goes through join_class_by_code (SECURITY
-- DEFINER, bypasses RLS), so this policy is dead weight. teacher_own_classes
-- (FOR ALL USING auth.uid() = teacher_id) continues to let teachers read
-- their own rows via getMyClasses().

DROP POLICY IF EXISTS "lookup_by_code" ON public.teacher_classes;
