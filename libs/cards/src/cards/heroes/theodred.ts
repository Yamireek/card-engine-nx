import { hero } from '@card-engine-nx/state';

export const theodred = hero(
  {
    name: 'Théodred',
    threatCost: 8,
    willpower: 1,
    attack: 2,
    defense: 1,
    hitPoints: 4,
    traits: ['noble', 'rohan', 'warrior'],
    keywords: {},
    sphere: 'leadership',
  },
  {
    description:
      "Response: Response: After Théodred commits to a quest, choose a hero committed to that quest. Add 1 resource to that hero's resource pool.",
    response: {
      event: 'commits',
      action: {
        player: 'controller',
        action: {
          chooseCardActions: {
            title: 'Choose hero for 1 resource',
            target: {
              type: 'hero',
              mark: 'questing',
            },
            action: {
              generateResources: 1,
            },
          },
        },
      },
    },
  }
);
