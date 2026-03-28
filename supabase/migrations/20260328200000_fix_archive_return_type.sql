-- v10.2.1: Fix archive_assignment return type (VOID → BOOLEAN)
-- PostgreSQL cannot ALTER return type, must DROP + CREATE

DROP FUNCTION IF EXISTS archive_assignment(UUID);

CREATE OR REPLACE FUNCTION archive_assignment(p_assignment_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INT;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE gl_assignments
  SET archived_at = now()
  WHERE id = p_assignment_id AND created_by = auth.uid();

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count > 0;
END;
$$;
