import { Action } from '@card-engine-nx/state';

export const phaseQuest: Action = [
  { beginPhase: 'quest' },
  {
    player: 'each',
    action: 'commitCharactersToQuest',
  },
  'sendCommitedEvents',
  { playerActions: 'Staging' },
  { repeat: { amount: 'countOfPlayers', action: 'revealEncounterCard' } },
  { playerActions: 'Quest resolution' },
  'resolveQuesting',
  { playerActions: 'End phase' },
  { clearMarks: 'questing' },
  'endPhase',
];
