import { useState, useEffect, useRef } from 'react';
import { supabase, SUPABASE_URL, SUPABASE_KEY } from '../supabase';
import type { Room, RoomPlayer, UserProfile } from '../types';
import type { User } from '@supabase/supabase-js';
import { handleSupabaseError } from '../utils/errors';

/** Countdown seconds after first player finishes */
export const PK_COUNTDOWN_SECS = 30;

/** Get the earliest finishedAt timestamp among all players (null if no one finished) */
export function getFirstFinishTime(room: Room | null): number | null {
  if (!room) return null;
  const times = Object.values(room.players)
    .map(p => p.finishedAt)
    .filter((t): t is number => !!t && t > 0);
  return times.length > 0 ? Math.min(...times) : null;
}

/** Get the earliest finishedAt among OTHER players (excludes currentUserId). */
export function getFirstOpponentFinishTime(room: Room | null, currentUserId: string | undefined): number | null {
  if (!room || !currentUserId) return null;
  const times = Object.entries(room.players)
    .filter(([id]) => id !== currentUserId)
    .map(([, p]) => p.finishedAt)
    .filter((t): t is number => !!t && t > 0);
  return times.length > 0 ? Math.min(...times) : null;
}

function parseRoom(d: any): Room {
  return {
    ...d,
    id: d.id,
    hostId: d.host_id,
    missionId: d.mission_id,
    liveMeta: d.live_meta ?? undefined,
    gameMeta: d.game_meta ?? undefined,
  } as Room;
}

export function useMultiplayer(user: User | null, profile: UserProfile | null) {
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);

  // ─── Persist roomId for rejoin on refresh ───
  useEffect(() => {
    if (activeRoom) {
      sessionStorage.setItem('gl_pk_room', activeRoom.id);
    } else {
      sessionStorage.removeItem('gl_pk_room');
    }
  }, [activeRoom?.id]);

  // ─── Attempt rejoin on mount ───
  useEffect(() => {
    if (!user || activeRoom) return;
    const savedId = sessionStorage.getItem('gl_pk_room');
    if (!savedId) return;
    supabase.from('gl_rooms').select('*').eq('id', savedId).single().then(({ data }) => {
      const player = data?.players?.[user.id] as RoomPlayer | undefined;
      // Reject rejoin if mid-battle with no finishedAt: local question state was lost on refresh, resuming would strand the user in battle without a mission loaded
      const safeToRejoin = data && data.status !== 'finished' && player && (data.status !== 'playing' || !!player.finishedAt);
      if (safeToRejoin) {
        setActiveRoom(parseRoom(data));
      } else {
        sessionStorage.removeItem('gl_pk_room');
      }
    });
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Opportunistic cleanup of the user's own stale rooms on mount ───
  // cleanup_my_stale_rooms() deletes 'waiting' rooms > 30 min old and marks
  // 'playing' rooms > 2 h old as 'finished'. Best-effort: errors ignored,
  // since this is hygiene, not critical-path. Without this call the DB just
  // accumulates orphans until global cron fires.
  useEffect(() => {
    if (!user) return;
    supabase.rpc('cleanup_my_stale_rooms').then(() => { /* silent */ });
  }, [user?.id]);

  /** Create a room. `difficulty` is host's choice for PK (both players bound by
   * it via game_meta.difficulty). Returns true on success. */
  const createRoom = async (
    type: 'team' | 'pk',
    missionId: number,
    difficulty: 'green' | 'amber' | 'red' = 'green',
  ): Promise<boolean> => {
    if (!user || !profile) return false;
    const { data, error } = await supabase.rpc('create_pk_room', {
      p_type: type,
      p_mission_id: missionId,
      p_player_name: profile.display_name,
      p_char_id: profile.selected_char_id || '',
      p_difficulty: difficulty,
    });
    if (error) { handleSupabaseError(error, 'create_pk_room', 'gl_rooms'); return false; }
    if (data?.error) { handleSupabaseError(data.error, 'create_pk_room', 'gl_rooms'); return false; }
    const roomId = data?.room_id as string | undefined;
    if (!roomId) return false;
    // RPC returns only room_id; fetch the full row to hydrate local state
    const { data: roomRow, error: fetchErr } = await supabase.from('gl_rooms').select('*').eq('id', roomId).single();
    if (fetchErr || !roomRow) { handleSupabaseError(fetchErr, 'fetch', 'gl_rooms'); return false; }
    setActiveRoom(parseRoom(roomRow));
    return true;
  };

  /** Join a room by full UUID or short code prefix. Returns error message or empty string. */
  const joinRoom = async (roomId: string): Promise<string> => {
    if (!user || !profile) return 'not_logged_in';

    let actualId = roomId;

    if (roomId.length < 36) {
      const code = roomId.toLowerCase();
      const { data: rooms, error: listErr } = await supabase
        .from('gl_rooms')
        .select('*')
        .eq('status', 'waiting')
        .order('created_at', { ascending: false })
        .limit(50);
      if (listErr) return `query_error: ${listErr.message}`;
      if (!rooms?.length) return 'no_waiting_rooms';
      const match = rooms.find(r => r.id.toLowerCase().startsWith(code));
      if (!match) return `no_match: ${rooms.length} rooms checked, code=${code}`;
      actualId = match.id;
    }

    const { data: result, error: rpcErr } = await supabase.rpc('join_room', {
      p_room_id: actualId,
      p_player_name: profile.display_name,
      p_char_id: profile.selected_char_id || '',
    });
    if (rpcErr) return `rpc_error: ${rpcErr.message}`;
    if (result?.error) return result.error;

    const { data: room } = await supabase.from('gl_rooms').select('*').eq('id', actualId).single();
    if (room) setActiveRoom(parseRoom(room));
    return '';
  };

  const toggleReady = async () => {
    if (!user || !activeRoom) return;
    const { error } = await supabase.rpc('toggle_ready', { p_room_id: activeRoom.id });
    if (error) handleSupabaseError(error, 'update', 'gl_rooms');
    // Optimistic update for immediate UI feedback
    const players = { ...activeRoom.players };
    players[user.id] = { ...players[user.id], isReady: !players[user.id].isReady };
    setActiveRoom({ ...activeRoom, players });
  };

  /** Host starts the game. `generatedData` is the pre-generated mission.data payload
   * for generatorType missions so every player gets the same question. Omit for
   * missions with static data. Returns error string or empty on success. */
  const startGame = async (generatedData?: Record<string, unknown>): Promise<string> => {
    if (!activeRoom) return 'no_room';
    const { data, error } = await supabase.rpc('start_game', {
      p_room_id: activeRoom.id,
      p_generated_data: generatedData ?? null,
    });
    if (error) { handleSupabaseError(error, 'update', 'gl_rooms'); return error.message; }
    if (data?.error) return data.error;
    // No optimistic update — realtime will propagate status='playing' + game_meta to ALL players simultaneously
    return '';
  };

  /** Submit score + mark player as finished. Auto-finishes room when all done.
   * Returns '' on success, error message on failure. Callers should treat a
   * non-empty return as submission rejected and NOT advance the user to the
   * podium, since the room state on the server is unchanged. */
  const submitScore = async (score: number): Promise<string> => {
    if (!user || !activeRoom) return 'no_room';
    const { error } = await supabase.rpc('submit_pk_score', { p_room_id: activeRoom.id, p_score: score });
    if (error) {
      // DO NOT optimistic-update here — server rejected (cap / status / dedup),
      // so room.players[uid].finishedAt is still unset. Faking it locally would
      // hang the opponent forever waiting for an "all finished" that never
      // comes. Surface the error instead.
      handleSupabaseError(error, 'update', 'gl_rooms');
      return error.message;
    }
    // Optimistic update
    const now = Date.now();
    const players = { ...activeRoom.players };
    if (players[user.id]) {
      players[user.id] = { ...players[user.id], score, finishedAt: now };
    }
    const allFinished = (Object.values(players) as RoomPlayer[]).every(p => p.finishedAt);
    const updates: Record<string, unknown> = { players };
    if (allFinished) updates.status = 'finished';
    setActiveRoom({ ...activeRoom, ...updates, players } as Room);
    return '';
  };

  /** Host starts a new round with a different mission. Resets all player states. */
  const startNextRound = async (newMissionId: number): Promise<boolean> => {
    if (!user || !activeRoom || activeRoom.hostId !== user.id) return false;

    const { data: freshRoom } = await supabase.from('gl_rooms').select('*').eq('id', activeRoom.id).single();
    const currentPlayers = freshRoom ? (freshRoom.players as Record<string, RoomPlayer>) : activeRoom.players;

    const resetPlayers: Record<string, RoomPlayer> = {};
    for (const [uid, p] of Object.entries(currentPlayers) as [string, RoomPlayer][]) {
      resetPlayers[uid] = { name: p.name, score: 0, isReady: false, charId: p.charId };
    }
    const updates = { mission_id: newMissionId, status: 'waiting' as const, players: resetPlayers };
    const { error } = await supabase.from('gl_rooms').update(updates).eq('id', activeRoom.id);
    if (error) { handleSupabaseError(error, 'update', 'gl_rooms'); return false; }
    setActiveRoom({ ...activeRoom, ...updates, missionId: newMissionId });
    return true;
  };

  /** Fetch a room by ID and set it as active (used when joining live rooms externally) */
  const fetchAndSetRoom = async (roomId: string) => {
    const { data } = await supabase.from('gl_rooms').select('*').eq('id', roomId).single();
    if (data) setActiveRoom(parseRoom(data));
  };

  /** Remove self from room (host: closes room; non-host: removes player). Always clears local state. */
  const leaveRoomClean = async () => {
    if (user && activeRoom) {
      await supabase.rpc('leave_room', { p_room_id: activeRoom.id });
    }
    setActiveRoom(null);
  };

  // ─── Sync room state: realtime primary, polling fallback ───
  useEffect(() => {
    if (!activeRoom) return;
    const roomId = activeRoom.id;
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let pollInFlight = false;

    // Unified room-data sink: covers deletion (null) and kick (user no longer in players) consistently across polling, realtime UPDATE, and post-subscribe refresh
    const applyRoomData = (data: any) => {
      if (!data) { setActiveRoom(null); return; }
      const players = data.players as Record<string, RoomPlayer> | null;
      if (user && players && !players[user.id]) { setActiveRoom(null); return; }
      setActiveRoom(parseRoom(data));
    };

    const startPolling = () => {
      if (pollTimer) return;
      pollTimer = setInterval(async () => {
        if (pollInFlight) return; // prevent request pile-up on slow networks
        pollInFlight = true;
        try {
          const { data } = await supabase.from('gl_rooms').select('*').eq('id', roomId).single();
          applyRoomData(data);
        } finally {
          pollInFlight = false;
        }
      }, 3000);
    };

    const stopPolling = () => {
      if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
    };

    const channel = supabase
      .channel(`room-${roomId}`)
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'gl_rooms', filter: `id=eq.${roomId}` },
        (payload) => applyRoomData(payload.new)
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          stopPolling();
          // Fetch once to catch updates missed during subscription handshake
          supabase.from('gl_rooms').select('*').eq('id', roomId).single()
            .then(({ data }) => applyRoomData(data));
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          startPolling();
        }
      });

    // Start polling immediately as safety net until realtime connects
    startPolling();

    return () => {
      stopPolling();
      supabase.removeChannel(channel);
    };
  }, [activeRoom?.id]);

  // ─── Cache auth token for synchronous access in beforeunload ───
  const tokenRef = useRef<string | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { tokenRef.current = data.session?.access_token ?? null; });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      tokenRef.current = session?.access_token ?? null;
    });
    return () => subscription.unsubscribe();
  }, []);

  // ─── Cleanup on tab close / navigation ───
  useEffect(() => {
    if (!activeRoom || !user) return;
    const roomId = activeRoom.id;
    const handler = () => {
      const token = tokenRef.current;
      if (!token) return;
      fetch(`${SUPABASE_URL}/rest/v1/rpc/leave_room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ p_room_id: roomId }),
        keepalive: true,
      }).catch(() => {});
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [activeRoom?.id, user?.id]);

  return { activeRoom, createRoom, joinRoom, toggleReady, startGame, submitScore, leaveRoomClean, startNextRound, fetchAndSetRoom };
}
