import { Shield, ShieldAlert, ShieldX, ShieldOff } from 'lucide-react';
import type { EquipmentState } from '../types';
import { EQUIPMENT_COLORS } from '../utils/equipment';

const ICONS: Record<EquipmentState, typeof Shield> = {
  pristine: Shield,
  worn: ShieldAlert,
  damaged: ShieldX,
  broken: ShieldOff,
};

export const EquipmentBadge = ({ state, size = 16 }: { state: EquipmentState; size?: number }) => {
  const colors = EQUIPMENT_COLORS[state];
  const Icon = ICONS[state];
  return (
    <div className={`inline-flex items-center justify-center rounded-full p-0.5 ${colors.bg} border ${colors.border}`}>
      <Icon size={size} className={`${colors.text} ${state === 'broken' ? 'opacity-50' : ''}`} />
    </div>
  );
};
