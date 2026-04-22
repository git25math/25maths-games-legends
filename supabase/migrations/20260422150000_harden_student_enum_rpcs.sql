-- Harden student enumeration RPCs + join_class_by_code.
--
-- Before: get_students_by_class / get_students_by_grade / get_students_by_tags
-- were SECURITY DEFINER with ZERO auth checks. Any authenticated student could
-- dump every classmate/gradeseatmate's full gl_user_progress row (display_name,
-- user_id, total_score, grade, class_tags, completed_missions, stats).
--
-- After: caller must either be a row-owner (shouldn't happen for these RPCs,
-- included for safety) OR a teacher per the shared `teachers` table. Same
-- pattern used by get_student_kp_progress and get_student_meta_progress.
--
-- join_class_by_code gains SET search_path = public to close the SECURITY
-- DEFINER search-path injection gap (no functional change).

-- ─── get_students_by_class ───
CREATE OR REPLACE FUNCTION public.get_students_by_class(p_class_tag TEXT)
RETURNS SETOF gl_user_progress
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;
  RETURN QUERY
    SELECT * FROM gl_user_progress
    WHERE class_tags @> ARRAY[p_class_tag]
    ORDER BY display_name;
END;
$$;

-- ─── get_students_by_grade ───
CREATE OR REPLACE FUNCTION public.get_students_by_grade(p_grade INT)
RETURNS SETOF gl_user_progress
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;
  RETURN QUERY
    SELECT * FROM gl_user_progress
    WHERE grade = p_grade
    ORDER BY display_name;
END;
$$;

-- ─── get_students_by_tags ───
CREATE OR REPLACE FUNCTION public.get_students_by_tags(p_tags TEXT[])
RETURNS SETOF gl_user_progress
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;
  RETURN QUERY
    SELECT * FROM gl_user_progress
    WHERE class_tags && p_tags
    ORDER BY display_name;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_students_by_class(TEXT)  TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_students_by_grade(INT)   TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_students_by_tags(TEXT[]) TO authenticated;

-- ─── join_class_by_code: add search_path (body unchanged) ───
CREATE OR REPLACE FUNCTION public.join_class_by_code(code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_class RECORD;
  v_current_tags TEXT[];
BEGIN
  SELECT * INTO v_class FROM public.teacher_classes
  WHERE invite_code = UPPER(code) AND is_active = true;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid or expired code');
  END IF;

  SELECT class_tags INTO v_current_tags
  FROM public.gl_user_progress
  WHERE user_id = auth.uid();

  IF v_class.name = ANY(COALESCE(v_current_tags, '{}')) THEN
    RETURN json_build_object('success', true, 'already_joined', true, 'class_name', v_class.name);
  END IF;

  UPDATE public.gl_user_progress
  SET class_tags = array_append(COALESCE(class_tags, '{}'), v_class.name)
  WHERE user_id = auth.uid();

  RETURN json_build_object('success', true, 'class_name', v_class.name, 'grade', v_class.grade);
END;
$$;

GRANT EXECUTE ON FUNCTION public.join_class_by_code(TEXT) TO authenticated;
