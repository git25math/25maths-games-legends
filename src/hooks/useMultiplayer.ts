import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
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

/** Get the earliest finishedAt among OTHER players (excludes currentUserId).
 *  Returns null if no opponent has finished yet. */
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
  } as Room;
}

export function useMultiplayer(user: User | null, profile: UserProfile | null) {
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);

  /** Create a room. Returns true on success. */
  const createRoom = async (type: 'team' | 'pk', missionId: number): Promise<boolean> => {
    if (!user || !profile) return false;
    const roomData = {
      type,
      mission_id: missionId,
      status: 'waiting',
      players: {
        [user.id]: {
          name: profile.display_name,
          score: 0,
          isReady: false,
          charId: profile.selected_char_id,
        }
      },
      host_id: user.id,
    };
    const { data, error } = await supabase.from('gl_rooms').insert(roomData).select().single();
    if (error) { handleSupabaseError(error, 'create', 'gl_rooms'); return false; }
    setActiveRoom(parseRoom(data));
    return true;
  };

  /** Join a room by full UUID or short code prefix. Returns error message or empty string on success. */
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

    const { data: room, error: getErr } = await supabase.from('gl_rooms').select('*').eq('id', actualId).single();
    if (getErr || !room) return `room_not_found: ${getErr?.message ?? 'null'}`;
    if (room.status !== 'waiting') return `room_status: ${room.status}`;

    const players = { ...room.players, [user.id]: { name: profile.display_name, score: 0, isReady: false, charId: profile.selected_char_id } };
    const { error } = await supabase.from('gl_rooms').update({ players }).eq('id', actualId);
    if (error) return `update_error: ${error.message}`;
    setActiveRoom(parseRoom({ ...room, players }));
    return '';
  };

  const toggleReady = async () => {
    if (!user || !activeRoom) return;
    const players = { ...activeRoom.players };
    players[user.id] = { ...players[user.id], isReady: !players[user.id].isReady };
    const { error } = await supabase.from('gl_rooms').update({ players }).eq('id', activeRoom.id);
    if (error) handleSupabaseError(error, 'update', 'gl_rooms');
    setActiveRoom({ ...activeRoom, players });
  };

  const startGame = async () => {
    if (!activeRoom) return;
    const { error } = await supabase.from('gl_rooms').update({ status: 'playing' }).eq('id', activeRoom.id);
    if (error) handleSupabaseError(error, 'update', 'gl_rooms');
    setActiveRoom({ ...activeRoom, status: 'playing' });
  };

  /** Submit score + mark player as finished. Auto-finishes room when all done. */
  const submitScore = async (score: number) => {
    if (!user || !activeRoom) return;
    const now = Date.now();
    const players = { ...activeRoom.players };
    if (players[user.id]) {
      players[user.id] = { ...players[user.id], score, finishedAt: now };
    }

    // If all players now finished, mark room as finished
    const allFinished = (Object.values(players) as RoomPlayer[]).every(p => p.finishedAt);
    const updates: Record<string, unknown> = { players };
    if (allFinished) {
      updates.status = 'finished';
    }

    const { error } = await supabase.from('gl_rooms').update(updates).eq('id', activeRoom.id);
    if (error) handleSupabaseError(error, 'update', 'gl_rooms');
    setActiveRoom({ ...activeRoom, ...updates, players } as Room);
  };

  const leaveRoom = () => setActiveRoom(null);

  /** Host starts a new round with a different mission. Resets all player states.
   *  Removes players who have left (leaveRoom only clears local state). */
  const startNextRound = async (newMissionId: number): Promise<boolean> => {
    if (!user || !activeRoom || activeRoom.hostId !== user.id) return false;

    // Re-fetch room from DB to get latest player list (some may have left)
    const { data: freshRoom } = await supabase.from('gl_rooms').select('*').eq('id', activeRoom.id).single();
    const currentPlayers = freshRoom ? (freshRoom.players as Record<string, RoomPlayer>) : activeRoom.players;

    const resetPlayers: Record<string, RoomPlayer> = {};
    for (const [uid, p] of Object.entries(currentPlayers) as [string, RoomPlayer][]) {
      // Keep host always; keep others only if they haven't been gone too long
      resetPlayers[uid] = { name: p.name, score: 0, isReady: false, charId: p.charId };
    }
    const updates = { mission_id: newMissionId, status: 'waiting' as const, players: resetPlayers };
    const { error } = await supabase.from('gl_rooms').update(updates).eq('id', activeRoom.id);
    if (error) { handleSupabaseError(error, 'update', 'gl_rooms'); return false; }
    setActiveRoom({ ...activeRoom, ...updates, missionId: newMissionId });
    return true;
  };

  /** Remove self from room's players in DB before leaving */
  const leaveRoomClean = async () => {
    if (user && activeRoom && activeRoom.hostId !== user.id) {
      const players = { ...activeRoom.players };
      delete players[user.id];
      await supabase.from('gl_rooms').update({ players }).eq('id', activeRoom.id).then(() => {});
    }
    setActiveRoom(null);
  };

  // Sync room state: polling every 2s + realtime attempt
  useEffect(() => {
    if (!activeRoom) return;
    const roomId = activeRoom.id;

    const poll = setInterval(async () => {
      const { data } = await supabase.from('gl_rooms').select('*').eq('id', roomId).single();
      if (data) setActiveRoom(parseRoom(data));
    }, 2000);

    const channel = supabase
      .channel(`room-${roomId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'gl_rooms', filter: `id=eq.${roomId}` },
        (payload) => setActiveRoom(parseRoom(payload.new))
      )
      .subscribe();

    return () => {
      clearInterval(poll);
      supabase.removeChannel(channel);
    };
  }, [activeRoom?.id]);

  return { activeRoom, createRoom, joinRoom, toggleReady, startGame, submitScore, leaveRoom, leaveRoomClean, startNextRound };
}
