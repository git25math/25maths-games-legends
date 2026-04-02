/**
 * useLiveSession — Teacher-led real-time classroom quiz hook.
 * Built on top of useMultiplayer (consumes activeRoom, doesn't subscribe separately).
 * Teacher: pushQuestion, endSession. Student: submitResponse.
 * Realtime: subscribes to gl_live_responses for live answer feed.
 */
import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../supabase';
import type { Room } from '../types';
import type { User } from '@supabase/supabase-js';
import { handleSupabaseError } from '../utils/errors';

export type LiveResponse = {
  id: string;
  room_id: string;
  user_id: string;
  mission_id: number;
  question_index: number;
  kp_id: string | null;
  user_answer: Record<string, string>;
  is_correct: boolean;
  error_type: string | null;
  duration_ms: number | null;
  created_at: string;
};

export type QuestionStats = {
  totalStudents: number;
  answeredCount: number;
  correctCount: number;
  correctRate: number;
  perStudent: { userId: string; name: string; isCorrect?: boolean; durationMs?: number; answered: boolean }[];
};

export function useLiveSession(activeRoom: Room | null, user: User | null) {
  const isLive = activeRoom?.type === 'live';
  const liveMeta = isLive ? activeRoom?.liveMeta ?? null : null;
  const currentQuestion = liveMeta?.current_question ?? null;
  const isTeacherHost = !!(user && activeRoom && user.id === activeRoom.hostId);
  const questionIndex = liveMeta?.question_index ?? 0;

  // ─── Responses for current session ───
  const [responses, setResponses] = useState<LiveResponse[]>([]);
  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  // Fetch all responses when room changes, then subscribe for realtime updates
  useEffect(() => {
    if (!isLive || !activeRoom) { setResponses([]); return; }
    const roomId = activeRoom.id;

    // Initial fetch
    supabase
      .from('gl_live_responses')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (mountedRef.current && data) setResponses(data as LiveResponse[]);
      });

    // Realtime subscription for new responses
    const channel = supabase
      .channel(`live-resp-${roomId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'gl_live_responses', filter: `room_id=eq.${roomId}` },
        (payload) => {
          if (mountedRef.current) {
            setResponses(prev => [...prev, payload.new as LiveResponse]);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeRoom?.id, isLive]);

  // ─── Computed stats for current question ───
  const questionStats = useMemo((): QuestionStats | null => {
    if (!isLive || !activeRoom || !currentQuestion) return null;

    const players = (Object.entries(activeRoom.players) as [string, { name: string; score: number; isReady: boolean; charId: string; finishedAt?: number }][])
      .filter(([uid]) => uid !== activeRoom.hostId); // exclude teacher
    const totalStudents = players.length;

    const currentResponses = responses.filter(r => r.question_index === questionIndex);
    const responseMap = new Map<string, LiveResponse>(currentResponses.map(r => [r.user_id, r]));

    const answeredCount = currentResponses.length;
    const correctCount = currentResponses.filter(r => r.is_correct).length;

    const perStudent = players.map(([uid, p]) => {
      const resp = responseMap.get(uid);
      return {
        userId: uid,
        name: p.name,
        isCorrect: resp?.is_correct,
        durationMs: resp?.duration_ms ?? undefined,
        answered: !!resp,
      };
    });

    return {
      totalStudents,
      answeredCount,
      correctCount,
      correctRate: answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0,
      perStudent,
    };
  }, [isLive, activeRoom?.players, responses, currentQuestion, questionIndex]);

  // ─── Session summary (all questions) ───
  const sessionSummary = useMemo(() => {
    if (!isLive || !activeRoom || responses.length === 0) return null;

    // Group by kp_id
    const kpMap = new Map<string, { total: number; correct: number; students: Set<string> }>();
    for (const r of responses) {
      const kp = r.kp_id || 'unknown';
      const entry = kpMap.get(kp) || { total: 0, correct: 0, students: new Set() };
      entry.total++;
      if (r.is_correct) entry.correct++;
      entry.students.add(r.user_id);
      kpMap.set(kp, entry);
    }

    const weakKps = [...kpMap.entries()]
      .map(([kpId, { total, correct, students }]) => ({
        kpId,
        total,
        correct,
        failureRate: Math.round(((total - correct) / total) * 100),
        studentCount: students.size,
      }))
      .sort((a, b) => b.failureRate - a.failureRate);

    // Per-student summary
    const studentMap = new Map<string, { correct: number; total: number }>();
    for (const r of responses) {
      const s = studentMap.get(r.user_id) || { correct: 0, total: 0 };
      s.total++;
      if (r.is_correct) s.correct++;
      studentMap.set(r.user_id, s);
    }

    return { weakKps, studentMap, totalQuestions: questionIndex, totalResponses: responses.length };
  }, [isLive, responses, questionIndex]);

  // ─── Teacher actions ───
  const pushQuestion = async (missionId: number, kpId: string, timerSecs?: number): Promise<string> => {
    if (!activeRoom) return 'no_room';
    const { data, error } = await supabase.rpc('push_live_question', {
      p_room_id: activeRoom.id,
      p_mission_id: missionId,
      p_kp_id: kpId,
      p_timer_secs: timerSecs ?? null,
    });
    if (error) { handleSupabaseError(error, 'rpc', 'push_live_question'); return error.message; }
    if (data?.error) return data.error;
    return '';
  };

  const endSession = async (): Promise<string> => {
    if (!activeRoom) return 'no_room';
    const { data, error } = await supabase.rpc('end_live_session', { p_room_id: activeRoom.id });
    if (error) { handleSupabaseError(error, 'rpc', 'end_live_session'); return error.message; }
    if (data?.error) return data.error;
    return '';
  };

  // ─── Student actions ───
  const submitResponse = async (
    answer: Record<string, string>,
    isCorrect: boolean,
    errorType?: string,
    durationMs?: number,
  ): Promise<string> => {
    if (!activeRoom || !currentQuestion) return 'no_question';
    const { data, error } = await supabase.rpc('submit_live_response', {
      p_room_id: activeRoom.id,
      p_mission_id: currentQuestion.mission_id,
      p_question_index: questionIndex,
      p_answer: answer,
      p_is_correct: isCorrect,
      p_error_type: errorType ?? null,
      p_duration_ms: durationMs ?? null,
      p_kp_id: currentQuestion.kp_id ?? null,
    });
    if (error) { handleSupabaseError(error, 'rpc', 'submit_live_response'); return error.message; }
    if (data?.error) return data.error;
    return '';
  };

  return {
    isLive,
    liveMeta,
    currentQuestion,
    questionIndex,
    isTeacherHost,
    pushQuestion,
    endSession,
    submitResponse,
    responses,
    questionStats,
    sessionSummary,
  };
}
