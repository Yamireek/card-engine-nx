import { hero } from '@card-engine-nx/state';

export const beravor = hero(
  {
    name: 'Beravor',
    threatCost: 10,
    willpower: 2,
    attack: 2,
    defense: 2,
    hitPoints: 4,
    traits: ['dúnedain', 'ranger'],
    sphere: 'lore',
  },
  {
    description:
      'Exhaust Beravor to choose a player. That player draws 2 cards. Limit once per round.',
    limit: {
      max: 1,
      type: 'round',
    },
    action: {
      payment: {
        cost: {
          card: {
            target: 'self',
            action: 'exhaust',
          },
        },
        effect: {
          player: {
            target: 'controller',
            action: {
              choosePlayerActions: {
                title: 'Choose player to draw 2 cards',
                target: 'each',
                action: {
                  draw: 2,
                },
              },
            },
          },
        },
      },
    },
  }
);
