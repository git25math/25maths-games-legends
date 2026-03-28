-- Teacher Classes: invite code system for class management
CREATE TABLE IF NOT EXISTS public.teacher_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  invite_code TEXT NOT NULL UNIQUE,
  grade INTEGER NOT NULL CHECK (grade BETWEEN 7 AND 12),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_invite_code ON public.teacher_classes (invite_code);
CREATE INDEX IF NOT EXISTS idx_teacher_classes_teacher ON public.teacher_classes (teacher_id);

-- RLS
ALTER TABLE public.teacher_classes ENABLE ROW LEVEL SECURITY;

-- Teachers can read/write their own classes
DROP POLICY IF EXISTS "teacher_own_classes" ON public.teacher_classes;
CREATE POLICY "teacher_own_classes" ON public.teacher_classes
  FOR ALL USING (auth.uid() = teacher_id);

-- Any authenticated user can look up a class by invite code (for joining)
DROP POLICY IF EXISTS "lookup_by_code" ON public.teacher_classes;
CREATE POLICY "lookup_by_code" ON public.teacher_classes
  FOR SELECT USING (is_active = true);

-- RPC: join class by invite code (adds class name to student's class_tags)
CREATE OR REPLACE FUNCTION public.join_class_by_code(code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_class RECORD;
  v_current_tags TEXT[];
BEGIN
  -- Find the class
  SELECT * INTO v_class FROM public.teacher_classes
  WHERE invite_code = UPPER(code) AND is_active = true;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid or expired code');
  END IF;

  -- Get current tags
  SELECT class_tags INTO v_current_tags
  FROM public.gl_user_progress
  WHERE user_id = auth.uid();

  -- Check if already joined
  IF v_class.name = ANY(COALESCE(v_current_tags, '{}')) THEN
    RETURN json_build_object('success', true, 'already_joined', true, 'class_name', v_class.name);
  END IF;

  -- Add class name to tags
  UPDATE public.gl_user_progress
  SET class_tags = array_append(COALESCE(class_tags, '{}'), v_class.name)
  WHERE user_id = auth.uid();

  RETURN json_build_object('success', true, 'class_name', v_class.name, 'grade', v_class.grade);
END;
$$;
