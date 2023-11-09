import { hero } from '@card-engine-nx/state';

export const eowyn = hero(
  {
    name: 'Éowyn',
    threatCost: 9,
    willpower: 4,
    attack: 1,
    defense: 1,
    hitPoints: 3,
    traits: ['noble', 'rohan'],
    sphere: 'spirit',
  },
  {
    description:
      'Discard 1 card from your hand to give Éowyn +1 [willpower] until the end of the phase. This effect may be triggered by each player once each round.',
    action: {
      payment: {
        cost: {
          player: 'controller',
          action: {
            choosePlayerActions: {
              target: 'each',
              title: 'Choose player to discard card',
              action: [
                {
                  discard: {
                    amount: 1,
                    target: 'choice',
                  },
                },
                {
                  useLimit: {
                    key: 'eowyn_action',
                    limit: {
                      max: 1,
                      type: 'round',
                    },
                  },
                },
              ],
            },
          },
        },
        effect: {
          card: {
            target: 'self',
            action: {
              modify: {
                increment: {
                  willpower: 1,
                },
              },
              until: 'end_of_phase',
            },
          },
        },
      },
    },
  }
);
