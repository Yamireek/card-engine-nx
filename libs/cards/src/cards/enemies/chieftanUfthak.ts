import { enemy } from '@card-engine-nx/state';

export const chieftanUfthak = enemy(
  {
    name: 'Chieftan Ufthak',
    engagement: 35,
    threat: 2,
    attack: 3,
    defense: 3,
    hitPoints: 6,
    victory: 4,
    traits: ['dolGuldur', 'orc'],
  },
  {
    description:
      'Chieftain Ufthak get +2 Attack for each resource token on him.',
    increment: {
      attack: {
        multiply: [
          2,
          {
            card: {
              target: 'self',
              value: {
                tokens: 'resources',
              },
            },
          },
        ],
      },
    },
  },
  {
    description:
      'Forced: After Chieftain Ufthak attacks, place 1 resource token on him.',
    target: 'self',
    forced: {
      event: 'attacked',
      action: {
        card: 'event',
        action: {
          generateResources: 1,
        },
      },
    },
  }
);
