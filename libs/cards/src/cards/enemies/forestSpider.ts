import { enemy } from '@card-engine-nx/state';

export const forestSpider = enemy(
  {
    name: 'Forest Spider',
    engagement: 25,
    threat: 2,
    attack: 2,
    defense: 1,
    hitPoints: 4,
    traits: ['creature', 'spider'],
  },
  {
    description:
      'Forced: After Forest Spider engages a player, it gets +1 Attack until the end of the round.',
    target: 'self',
    forced: {
      event: 'engaged',
      action: {
        card: {
          target: 'self',
          action: {
            modify: {
              increment: {
                attack: 1,
              },
            },
            until: 'end_of_round',
          },
        },
      },
    },
  },
  {
    description:
      'Shadow: Defending player must choose and discard 1 attachment he controls.',
    shadow: {
      player: 'defending',
      action: {
        chooseCardActions: {
          title: 'Choose attachment to discard',
          target: { type: 'attachment', controller: 'defending' },
          action: 'discard',
        },
      },
    },
  }
);
