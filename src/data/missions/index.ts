import type { Mission } from '../../types';
import { MISSIONS_Y7 } from './y7';
import { MISSIONS_Y8 } from './y8';
import { MISSIONS_Y9 } from './y9';
import { MISSIONS_Y10 } from './y10';
import { MISSIONS_Y11 } from './y11';
import { MISSIONS_Y12 } from './y12';

export { MISSIONS_Y7, MISSIONS_Y8, MISSIONS_Y9, MISSIONS_Y10, MISSIONS_Y11, MISSIONS_Y12 };

export const MISSIONS: Mission[] = [
  ...MISSIONS_Y7,
  ...MISSIONS_Y8,
  ...MISSIONS_Y9,
  ...MISSIONS_Y10,
  ...MISSIONS_Y11,
  ...MISSIONS_Y12,
];
