import { enemy } from '@card-engine-nx/state';

export const kingSpider = enemy(
  {
    name: 'King Spider',
    engagement: 20,
    threat: 2,
    attack: 3,
    defense: 1,
    hitPoints: 3,
    traits: ['creature', 'spider'],
  },
  {
    description:
      'When Revealed: Each player must choose and exhaust 1 character he controls.',
    whenRevealed: {
      player: 'each',
      action: {
        chooseCardActions: {
          title: 'Choose character to exhaust',
          target: {
            simple: 'character',
            controller: 'target',
          },
          action: 'exhaust',
        },
      },
    },
  },
  {
    description:
      'Shadow: Defending player must choose and exhaust 1 character he controls. (2 characters instead if this attack is undefended.)',
    shadow: [
      {
        repeat: {
          amount: {
            if: {
              cond: 'undefended.attack',
              false: 1,
              true: 2,
            },
          },
          action: {
            player: 'defending',
            action: {
              chooseCardActions: {
                title: 'Choose character to exhaust',
                target: { simple: 'character', controller: 'defending' },
                action: 'exhaust',
              },
            },
          },
        },
      },
    ],
  }
);
