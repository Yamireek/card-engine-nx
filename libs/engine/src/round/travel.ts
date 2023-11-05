import { Action } from '@card-engine-nx/state';

export const phaseTravel: Action = [
  { beginPhase: 'travel' },
  'chooseTravelDestination',
  { playerActions: 'End travel phase' },
  'endPhase',
];
