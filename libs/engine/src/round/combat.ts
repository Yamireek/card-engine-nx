import { Action } from '@card-engine-nx/state';

export const phaseCombat: Action = [
  { beginPhase: 'combat' },
  'dealShadowCards',
  { playerActions: 'Resolve enemy attacks' },
  {
    player: 'each',
    action: 'resolveEnemyAttacks',
  },
  { clearMarks: 'attacked' },
  { playerActions: 'Resolve player attacks' },
  {
    player: 'each',
    action: 'resolvePlayerAttacks',
  },
  { clearMarks: 'attacked' },
  { playerActions: 'End combat phase' },
  { card: { side: 'shadow' }, action: 'discard' },
  'endPhase',
];
