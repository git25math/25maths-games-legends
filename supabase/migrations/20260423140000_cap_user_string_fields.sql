-- Cap string field lengths that feed broadcast surfaces. Without caps, any
-- authenticated user can set a 10 MB display_name and every leaderboard
-- fetch, live-classroom push, PK room broadcast, etc. carries that payload
-- to every other participant — DoS via weight.
--
-- Affected paths:
--   A. gl_user_progress.display_name (via update_user_progress_safe) —
--      propagates to leaderboards, dashboards, Live classroom player list.
--   B. gl_rooms.players[uid].name (via join_room / create_pk_room
--      p_player_name) — realtime-broadcast to every room member on each
--      update.
--   C. gl_rooms.players[uid].charId (via join_room / create_pk_room
--      p_char_id) — same broadcast footprint. Legitimate charId is a
--      known-enum short string.
--
-- Caps chosen:
--   * display_name:   64 chars  (enough for "Zhang Sanfeng 张三丰" with emoji)
--   * player_name:    64 chars  (same)
--   * char_id:        32 chars  (production IDs are all ≤ 20)
--
-- Rejection, not silent truncation — bad input surfaces to the caller and is
-- fixable, rather than silently clipped to a mismatch with what the user typed.

-- ─── update_user_progress_safe: cap display_name ────────────────────────────
CREATE OR REPLACE FUNCTION public.update_user_progress_safe(p_updates jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_current public.gl_user_progress%ROWTYPE;
  v_new_cm jsonb;
  v_old_sp integer;
  v_new_sp integer;
  v_old_spent integer;
  v_new_spent integer;
  v_display_name text;
  v_selected_char_id text;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_updates ?| ARRAY[
    'user_id', 'grade', 'class_name', 'class_tags',
    'total_score', 'current_level', 'stages_completed',
    'created_at', 'updated_at'
  ] THEN
    RAISE EXCEPTION 'Protected progress fields cannot be modified from the client';
  END IF;

  -- Length caps on user-controlled strings that propagate via realtime /
  -- dashboards. Reject rather than truncate so clients see the actual value.
  v_display_name := p_updates->>'display_name';
  IF v_display_name IS NOT NULL AND char_length(v_display_name) > 64 THEN
    RAISE EXCEPTION 'display_name exceeds 64 chars (got %)', char_length(v_display_name);
  END IF;

  v_selected_char_id := p_updates->>'selected_char_id';
  IF v_selected_char_id IS NOT NULL AND char_length(v_selected_char_id) > 32 THEN
    RAISE EXCEPTION 'selected_char_id exceeds 32 chars (got %)', char_length(v_selected_char_id);
  END IF;

  INSERT INTO public.gl_user_progress (user_id)
  VALUES (v_uid)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT * INTO v_current
  FROM public.gl_user_progress
  WHERE user_id = v_uid
  FOR UPDATE;

  v_new_cm := p_updates->'completed_missions';
  IF v_new_cm IS NOT NULL THEN
    v_old_sp := COALESCE((v_current.completed_missions->>'_total_skill_points')::integer, 0);
    v_new_sp := COALESCE((v_new_cm->>'_total_skill_points')::integer, 0);
    IF v_new_sp > v_old_sp + 5 THEN
      RAISE EXCEPTION 'SP increase too large: % -> %', v_old_sp, v_new_sp;
    END IF;
    IF v_new_sp < v_old_sp THEN
      v_old_spent := COALESCE((v_current.completed_missions->>'_spent_skill_points')::integer, 0);
      v_new_spent := COALESCE((v_new_cm->>'_spent_skill_points')::integer, 0);
      IF v_new_spent < v_old_spent THEN
        RAISE EXCEPTION 'Cannot reduce _spent_skill_points: % -> %', v_old_spent, v_new_spent;
      END IF;
    END IF;
  END IF;

  UPDATE public.gl_user_progress
  SET completed_missions = COALESCE(v_new_cm, v_current.completed_missions),
      stats = COALESCE(p_updates->'stats', v_current.stats),
      display_name = COALESCE(p_updates->>'display_name', v_current.display_name),
      selected_char_id = COALESCE(p_updates->>'selected_char_id', v_current.selected_char_id),
      updated_at = now()
  WHERE user_id = v_uid;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_user_progress_safe(jsonb) TO authenticated;

-- ─── join_room: cap p_player_name + p_char_id ──────────────────────────────
CREATE OR REPLACE FUNCTION public.join_room(p_room_id uuid, p_player_name text, p_char_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  room_record RECORD;
  new_players JSONB;
BEGIN
  IF p_player_name IS NOT NULL AND char_length(p_player_name) > 64 THEN
    RETURN jsonb_build_object('error', 'player_name_too_long');
  END IF;
  IF p_char_id IS NOT NULL AND char_length(p_char_id) > 32 THEN
    RETURN jsonb_build_object('error', 'char_id_too_long');
  END IF;

  SELECT * INTO room_record FROM gl_rooms WHERE id = p_room_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'room_not_found');
  END IF;
  IF room_record.status != 'waiting' THEN
    RETURN jsonb_build_object('error', 'room_not_waiting');
  END IF;

  new_players := room_record.players || jsonb_build_object(
    auth.uid()::text, jsonb_build_object(
      'name', COALESCE(NULLIF(trim(p_player_name), ''), 'Player'),
      'score', 0,
      'isReady', false,
      'charId', COALESCE(p_char_id, '')
    )
  );

  UPDATE gl_rooms SET players = new_players WHERE id = p_room_id;

  RETURN jsonb_build_object('success', true, 'players', new_players);
END;
$$;

GRANT EXECUTE ON FUNCTION public.join_room(uuid, text, text) TO authenticated;

-- ─── create_pk_room: cap p_player_name + p_char_id ──────────────────────────
CREATE OR REPLACE FUNCTION public.create_pk_room(
  p_type TEXT,
  p_mission_id INT,
  p_player_name TEXT,
  p_char_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_existing_id UUID;
  v_room_id UUID;
  v_name TEXT;
  v_char TEXT;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('error', 'not_authenticated');
  END IF;
  IF p_type NOT IN ('pk', 'team') THEN
    RETURN jsonb_build_object('error', 'invalid_type');
  END IF;
  IF p_mission_id IS NULL OR p_mission_id <= 0 THEN
    RETURN jsonb_build_object('error', 'invalid_mission');
  END IF;
  IF p_player_name IS NOT NULL AND char_length(p_player_name) > 64 THEN
    RETURN jsonb_build_object('error', 'player_name_too_long');
  END IF;
  IF p_char_id IS NOT NULL AND char_length(p_char_id) > 32 THEN
    RETURN jsonb_build_object('error', 'char_id_too_long');
  END IF;

  v_name := COALESCE(NULLIF(trim(p_player_name), ''), 'Player');
  v_char := COALESCE(p_char_id, '');

  SELECT id INTO v_existing_id
  FROM gl_rooms
  WHERE host_id = v_uid
    AND status = 'waiting'
    AND type = p_type
    AND mission_id = p_mission_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok', true, 'room_id', v_existing_id, 'reused', true);
  END IF;

  UPDATE gl_rooms
  SET status = 'finished'
  WHERE host_id = v_uid
    AND status = 'waiting';

  INSERT INTO gl_rooms (type, mission_id, status, players, host_id)
  VALUES (
    p_type,
    p_mission_id,
    'waiting',
    jsonb_build_object(v_uid::text, jsonb_build_object(
      'name', v_name,
      'score', 0,
      'isReady', false,
      'charId', v_char
    )),
    v_uid
  )
  RETURNING id INTO v_room_id;

  RETURN jsonb_build_object('ok', true, 'room_id', v_room_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_pk_room(TEXT, INT, TEXT, TEXT) TO authenticated;
