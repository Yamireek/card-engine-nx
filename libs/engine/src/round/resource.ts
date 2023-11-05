import { Action } from '@card-engine-nx/state';

export const phaseResource: Action = [
  { beginPhase: 'resource' },
  { player: { target: 'each', action: { draw: 1 } } },
  {
    card: {
      target: { simple: 'inAPlay', type: 'hero' },
      action: { generateResources: 1 },
    },
  },
  { playerActions: 'End resource phase' },
  'endPhase',
];
