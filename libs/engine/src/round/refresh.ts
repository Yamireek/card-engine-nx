import { Action } from '@card-engine-nx/state';

export const phaseRefresh: Action = [
  { beginPhase: 'refresh' },
  { card: { target: 'exhausted', action: { ready: 'refresh' } } },
  { player: 'each', action: { incrementThreat: 1 } },
  'passFirstPlayerToken',
  { playerActions: 'End refresh phase and round' },
  'endPhase',
];
