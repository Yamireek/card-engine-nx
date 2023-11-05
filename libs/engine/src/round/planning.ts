import { Action } from '@card-engine-nx/state';

export const phasePlanning: Action = [
  { beginPhase: 'planning' },
  { playerActions: 'End planning phase' },
  'endPhase',
];
