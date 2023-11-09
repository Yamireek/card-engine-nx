import { ally } from '@card-engine-nx/state';

export const gandalf = ally(
  {
    name: 'Gandalf',
    unique: true,
    cost: 5,
    willpower: 4,
    attack: 4,
    defense: 4,
    hitPoints: 5,
    traits: ['istari'],
    sphere: 'neutral',
  },
  {
    description: 'At the end of the round, discard Gandalf from play.',
    forced: {
      event: 'end_of_round',
      condition: {
        card: {
          target: 'self',
          value: 'in_a_play',
        },
      },
      action: {
        card: 'self',
        action: 'discard',
      },
    },
  },
  {
    description:
      'Response: After Gandalf enters play, (choose 1): draw 3 cards, deal 4 damage to 1 enemy in play, or reduce your threat by 5.',
    target: 'self',
    response: {
      event: 'enteredPlay',
      action: {
        player: 'controller',
        action: {
          chooseActions: {
            title: 'Choose one',
            actions: [
              {
                title: 'Draw 3 cards',
                action: {
                  player: 'controller',
                  action: {
                    draw: 3,
                  },
                },
              },
              {
                title: 'Deal 4 damage to 1 enemy in play',
                action: {
                  player: 'controller',
                  action: {
                    chooseCardActions: {
                      title: 'Choose enemy',
                      target: {
                        type: 'enemy',
                      },
                      action: {
                        dealDamage: 4,
                      },
                    },
                  },
                },
              },
              {
                title: 'Reduce your threat by 5',
                action: {
                  player: 'controller',
                  action: {
                    incrementThreat: -5,
                  },
                },
              },
            ],
          },
        },
      },
    },
  }
);
