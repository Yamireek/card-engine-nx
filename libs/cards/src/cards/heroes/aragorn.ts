import { hero } from '@card-engine-nx/state';

export const aragorn = hero(
  {
    name: 'Aragorn',
    threatCost: 12,
    willpower: 2,
    attack: 3,
    defense: 2,
    hitPoints: 5,
    traits: ['dúnedain', 'noble', 'ranger'],
    keywords: {
      sentinel: true,
    },
    sphere: 'leadership',
  },
  {
    description:
      'Response: After Aragorn commits to a quest, spend 1 resource from his resource pool to ready him.',
    response: {
      event: 'commits',
      action: {
        card: 'self',
        action: [
          {
            payResources: 1,
          },
          'ready',
        ],
      },
    },
  }
);
