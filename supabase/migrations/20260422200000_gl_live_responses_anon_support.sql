-- Codify gl_live_responses schema drift for anonymous live-classroom participants.
-- Original migration 20260404000000_live_classroom.sql defined user_id as NOT NULL
-- and a single UNIQUE (room_id, user_id, question_index) index. Production has
-- since evolved to support PIN-joined anonymous players (no auth.users row):
--
--   1. user_id was relaxed from NOT NULL to NULL so anon rows can exist
--   2. New anon_id TEXT column (nullable) holds the client-issued anonymous handle
--   3. Original UNIQUE index was split into two partial UNIQUE indexes so auth
--      and anon users are deduped independently
--
-- submit_live_response_anon (a production SECURITY DEFINER RPC that lives only
-- in the live DB) references these columns and indexes. Without this migration,
-- fresh environments fail as soon as any anonymous student joins a live room.

-- 1. user_id NULL (safe if already null)
ALTER TABLE public.gl_live_responses
  ALTER COLUMN user_id DROP NOT NULL;

-- 2. anon_id column
ALTER TABLE public.gl_live_responses
  ADD COLUMN IF NOT EXISTS anon_id TEXT;

-- 3. Replace the old global UNIQUE index with the two partial ones.
--    Guarded so rerunning this migration stays idempotent.
DROP INDEX IF EXISTS idx_live_resp_unique;
CREATE UNIQUE INDEX IF NOT EXISTS idx_live_resp_unique_auth
  ON public.gl_live_responses(room_id, user_id, question_index)
  WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_live_resp_unique_anon
  ON public.gl_live_responses(room_id, anon_id, question_index)
  WHERE anon_id IS NOT NULL;

-- 4. submit_live_response_anon: codify the production RPC.
--    Uses the _anon partial unique index for idempotency.
CREATE OR REPLACE FUNCTION public.submit_live_response_anon(
  p_room_id uuid,
  p_anon_id text,
  p_mission_id integer,
  p_question_index integer,
  p_answer jsonb,
  p_is_correct boolean,
  p_error_type text DEFAULT NULL,
  p_duration_ms integer DEFAULT NULL,
  p_kp_id text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_score_delta INT;
  v_inserted INT;
BEGIN
  -- Require the anon_id to already be a registered player in the room
  -- (join_live_anonymous seeded them). Prevents stranger submissions.
  IF NOT (SELECT players ? p_anon_id FROM gl_rooms WHERE id = p_room_id) THEN
    RETURN jsonb_build_object('error', 'not_in_room');
  END IF;

  INSERT INTO gl_live_responses (
    room_id, user_id, anon_id, mission_id, question_index, kp_id,
    user_answer, is_correct, error_type, duration_ms
  )
  VALUES (
    p_room_id, NULL, p_anon_id, p_mission_id, p_question_index, p_kp_id,
    p_answer, p_is_correct, p_error_type, p_duration_ms
  )
  ON CONFLICT (room_id, anon_id, question_index) WHERE anon_id IS NOT NULL DO NOTHING;

  GET DIAGNOSTICS v_inserted = ROW_COUNT;
  IF v_inserted = 0 THEN
    RETURN jsonb_build_object('ok', true, 'duplicate', true);
  END IF;

  v_score_delta := CASE WHEN p_is_correct THEN 100 ELSE 0 END;
  UPDATE gl_rooms
  SET players = jsonb_set(
    jsonb_set(players, ARRAY[p_anon_id, 'score'],
      to_jsonb(COALESCE((players->p_anon_id->>'score')::int, 0) + v_score_delta)),
    ARRAY[p_anon_id, 'finishedAt'],
    to_jsonb((extract(epoch from now()) * 1000)::bigint)
  )
  WHERE id = p_room_id;

  RETURN jsonb_build_object('ok', true, 'score_delta', v_score_delta);
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_live_response_anon(uuid, text, integer, integer, jsonb, boolean, text, integer, text) TO anon, authenticated;

-- 5. Host RLS for anon rows — the original migration's live_resp_select_host
--    already covers this via the gl_rooms.host_id check, but make sure we
--    don't accidentally regress by re-asserting the policy.
DROP POLICY IF EXISTS live_resp_select_host ON public.gl_live_responses;
CREATE POLICY live_resp_select_host ON public.gl_live_responses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.gl_rooms
      WHERE gl_rooms.id = gl_live_responses.room_id
        AND gl_rooms.host_id = auth.uid()
    )
  );
