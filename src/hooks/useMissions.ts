import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { MISSIONS as LOCAL_MISSIONS } from '../data/missions';
import type { Mission } from '../types';

/**
 * Load missions from Supabase gl_missions table, falling back to local data.
 * This allows server-side mission management while keeping offline support.
 */
export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>(LOCAL_MISSIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('gl_missions')
          .select('*')
          .eq('is_active', true)
          .order('id');

        if (error || !data || data.length === 0) {
          // Fall back to local data
          setMissions(LOCAL_MISSIONS);
        } else {
          // Map DB schema to Mission type
          const mapped: Mission[] = data.map((row: any) => ({
            id: row.id,
            grade: row.grade,
            unitId: row.unit_id,
            order: row.unit_order,
            unitTitle: row.unit_title,
            topic: row.topic,
            type: row.question_type,
            title: row.title,
            story: row.story,
            description: row.description,
            data: row.data,
            difficulty: row.difficulty,
            reward: row.reward,
            tutorialSteps: row.tutorial_steps,
            secret: row.secret,
            kpId: row.kp_id,
            sectionId: row.section_id,
          }));
          setMissions(mapped);
        }
      } catch {
        setMissions(LOCAL_MISSIONS);
      }
      setLoading(false);
    };

    load();
  }, []);

  return { missions, loading };
}
