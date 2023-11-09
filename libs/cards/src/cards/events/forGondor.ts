import { event } from '@card-engine-nx/state';

export const forGondor = event(
  {
    name: 'For Gondor!',
    cost: 2,
    sphere: 'leadership',
  },
  {
    description:
      'Action: Until the end of the phase, all characters get +1 [attack]. All Gondor characters also get +1 [defense] until the end of the phase.',
    action: [
      {
        card: 'character',
        action: {
          modify: {
            increment: {
              attack: 1,
            },
          },
          until: 'end_of_phase',
        },
      },
      {
        card: { trait: 'gondor' },
        action: {
          modify: {
            increment: {
              defense: 1,
            },
          },
          until: 'end_of_phase',
        },
      },
    ],
  }
);
