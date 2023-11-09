import { Action } from '@card-engine-nx/state';

export const phaseEncounter: Action = [
  { beginPhase: 'encounter' },
  { player: 'each', action: 'optionalEngagement' },
  { playerActions: 'Engagement Checks' },
  {
    while: {
      condition: 'enemiesToEngage',
      action: { player: 'each', action: 'engagementCheck' },
    },
  },
  { playerActions: 'Next encounter phase' },
  'endPhase',
];
