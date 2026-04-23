-- PK / team multiplayer question-sync fix.
--
-- PROBLEM: In PK and team modes, each player independently calls
-- generateMission(mission) on the client. The generator uses Math.random()
-- (see src/utils/generators/shared.ts), so Player A solves a different
-- question than Player B in the same match. Scores become uncomparable;
-- the mode is fundamentally unfair for any mission with a generatorType
-- (which is 81 of them per CLAUDE.md).
--
-- Live classroom already solves this via live_meta.current_question.generated_data:
-- the teacher runs the generator once, push_live_question stores the result,
-- every student reads the same numbers.
--
-- FIX: add game_meta JSONB to gl_rooms and have start_game accept a
-- p_generated_data JSONB. Host generates once client-side before calling
-- start_game, passes the generated mission.data payload, server persists
-- it on the room. Both clients then hydrate their Mission from that
-- authoritative payload instead of running their own generator.

-- 1. New column (mirrors live_meta pattern)
ALTER TABLE public.gl_rooms ADD COLUMN IF NOT EXISTS game_meta JSONB DEFAULT NULL;
-- game_meta schema:
-- {
--   "generated_data": { ... mission.data payload ... } | null,
--   "round": number                                      -- incremented by startNextRound
-- }

-- 2. start_game now accepts optional generated_data; old callers (no arg) still work.
--    Must DROP first because return type is unchanged but signature changes.
DROP FUNCTION IF EXISTS public.start_game(uuid);
CREATE OR REPLACE FUNCTION public.start_game(
  p_room_id UUID,
  p_generated_data JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room gl_rooms;
  v_player_count INT;
  v_ready_count INT;
  v_meta JSONB;
BEGIN
  SELECT * INTO v_room FROM gl_rooms WHERE id = p_room_id FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('error', 'room_not_found'); END IF;
  IF v_room.host_id != auth.uid() THEN RETURN jsonb_build_object('error', 'not_host'); END IF;
  IF v_room.status != 'waiting' THEN RETURN jsonb_build_object('error', 'not_waiting'); END IF;

  SELECT count(*), count(*) FILTER (WHERE (value->>'isReady')::boolean = true)
  INTO v_player_count, v_ready_count
  FROM jsonb_each(v_room.players);

  IF v_player_count < 2 THEN RETURN jsonb_build_object('error', 'need_2_players'); END IF;
  IF v_ready_count < v_player_count THEN RETURN jsonb_build_object('error', 'not_all_ready'); END IF;

  v_meta := COALESCE(v_room.game_meta, '{}'::jsonb) || jsonb_build_object(
    'generated_data', p_generated_data,
    'round', COALESCE((v_room.game_meta->>'round')::int, 0) + 1
  );

  UPDATE gl_rooms
  SET status = 'playing',
      game_meta = v_meta
  WHERE id = p_room_id;

  RETURN jsonb_build_object('ok', true, 'round', v_meta->>'round');
END;
$$;

GRANT EXECUTE ON FUNCTION public.start_game(UUID, JSONB) TO authenticated;
