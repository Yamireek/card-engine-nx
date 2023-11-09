import { event } from '@card-engine-nx/state';

export const sneakAttack = event(
  {
    name: 'Sneak Attack',
    cost: 1,
    sphere: 'leadership',
  },
  {
    description:
      'Action: Put 1 ally card into play from your hand. At the end of the phase, if that ally is still in play, return it to your hand.',
    action: [
      {
        player: 'controller',
        action: {
          chooseCardActions: {
            title: 'Choose ally to put in play',
            target: { type: 'ally', zoneType: 'hand' },
            action: [
              {
                putInPlay: 'controller',
              },
              {
                mark: 'sneak.attack',
              },
            ],
          },
        },
      },
      {
        atEndOfPhase: [
          {
            card: { mark: 'sneak.attack' },
            action: [
              {
                move: {
                  to: {
                    player: { controllerOf: 'target' },
                    type: 'hand',
                  },
                },
              },
            ],
          },
          { clearMarks: 'sneak.attack' },
        ],
      },
    ],
  }
);
