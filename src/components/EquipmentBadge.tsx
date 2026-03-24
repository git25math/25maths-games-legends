import { Shield } from 'lucide-react';
import type { EquipmentState } from '../types';
import { EQUIPMENT_COLORS } from '../utils/equipment';

export const EquipmentBadge = ({ state, size = 16 }: { state: EquipmentState; size?: number }) => {
  const colors = EQUIPMENT_COLORS[state];
  return (
    <div className={`inline-flex items-center justify-center rounded-full p-0.5 ${colors.bg} border ${colors.border}`}>
      <Shield size={size} className={`${colors.text} ${state === 'broken' ? 'opacity-50' : ''}`} />
    </div>
  );
};
