-- 4 class_tag management RPCs were SECURITY DEFINER with ZERO auth checks:
--   assign_class(grade, class)           — add a class tag to every student in a grade
--   assign_student_class(user_id, class) — add a class tag to a specific student
--   remove_class_tag(grade, tag)         — remove a tag from every student in a grade
--   remove_student_tag(user_id, tag)     — remove a tag from a specific student
--
-- Any authenticated user could call them and rewrite ANY other user's
-- class_tags. Concrete attacks:
--   * Self-infiltrate: assign_student_class(auth.uid(), '8A') → see class 8A's
--     assignments via get_my_assignments, join 8A live rooms via join_live_room
--   * Impersonate teacher UI: assign_student_class(auth.uid(), 'TEACHER') →
--     client-side `isTeacher` flag flips to true (App.tsx:1056). Server RPCs
--     still reject via teachers-table check, but teacher screens render with
--     sensitive UI leaks until that rejection.
--   * Grief classmates: remove_student_tag(victim_id, 'their_class') →
--     victim falls out of their own class, loses assignment visibility.
--
-- Fix: require caller to be a teacher AND (for single-target ops) own the
-- targeted class via teacher_classes.teacher_id = auth.uid().
-- assign_class / remove_class_tag stay grade+class-scoped and additionally
-- verify the class belongs to the caller.
--
-- Note: teacher_classes may not exist in every deployment (the play-only
-- environment differs from ExamHub); wrap the ownership check in a
-- to_regclass() guard to keep these functions runnable there. Without the
-- table, the ownership check degrades to "any authenticated teacher" — still
-- vastly tighter than the previous "any authenticated anyone".

-- ─── assign_class: grade-wide tag add ────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.assign_class(p_grade INT, p_class TEXT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_affected INT;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = v_uid) THEN
    RAISE EXCEPTION 'not_a_teacher';
  END IF;

  IF to_regclass('public.teacher_classes') IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM teacher_classes
      WHERE name = p_class AND teacher_id = v_uid
    ) THEN
      RAISE EXCEPTION 'not_your_class';
    END IF;
  END IF;

  UPDATE gl_user_progress
  SET class_tags = array_append(class_tags, p_class),
      class_name = COALESCE(class_name, p_class),
      updated_at = now()
  WHERE grade = p_grade AND NOT (class_tags @> ARRAY[p_class]);
  GET DIAGNOSTICS v_affected = ROW_COUNT;
  RETURN v_affected;
END;
$$;

-- ─── assign_student_class: single-student tag add ────────────────────────────
CREATE OR REPLACE FUNCTION public.assign_student_class(p_user_id UUID, p_class TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = v_uid) THEN
    RAISE EXCEPTION 'not_a_teacher';
  END IF;

  IF to_regclass('public.teacher_classes') IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM teacher_classes
      WHERE name = p_class AND teacher_id = v_uid
    ) THEN
      RAISE EXCEPTION 'not_your_class';
    END IF;
  END IF;

  UPDATE gl_user_progress
  SET class_tags = CASE
        WHEN class_tags @> ARRAY[p_class] THEN class_tags
        ELSE array_append(class_tags, p_class)
      END,
      class_name = COALESCE(class_name, p_class),
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;

-- ─── remove_student_tag: single-student tag remove ───────────────────────────
CREATE OR REPLACE FUNCTION public.remove_student_tag(p_user_id UUID, p_tag TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = v_uid) THEN
    RAISE EXCEPTION 'not_a_teacher';
  END IF;

  IF to_regclass('public.teacher_classes') IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM teacher_classes
      WHERE name = p_tag AND teacher_id = v_uid
    ) THEN
      RAISE EXCEPTION 'not_your_class';
    END IF;
  END IF;

  UPDATE gl_user_progress
  SET class_tags = array_remove(class_tags, p_tag),
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;

-- ─── remove_class_tag: grade-wide tag remove ────────────────────────────────
CREATE OR REPLACE FUNCTION public.remove_class_tag(p_grade INT, p_tag TEXT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_affected INT;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = v_uid) THEN
    RAISE EXCEPTION 'not_a_teacher';
  END IF;

  IF to_regclass('public.teacher_classes') IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM teacher_classes
      WHERE name = p_tag AND teacher_id = v_uid
    ) THEN
      RAISE EXCEPTION 'not_your_class';
    END IF;
  END IF;

  UPDATE gl_user_progress
  SET class_tags = array_remove(class_tags, p_tag),
      updated_at = now()
  WHERE grade = p_grade AND class_tags @> ARRAY[p_tag];
  GET DIAGNOSTICS v_affected = ROW_COUNT;
  RETURN v_affected;
END;
$$;

GRANT EXECUTE ON FUNCTION public.assign_class(INT, TEXT)                TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_student_class(UUID, TEXT)       TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_student_tag(UUID, TEXT)         TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_class_tag(INT, TEXT)            TO authenticated;
