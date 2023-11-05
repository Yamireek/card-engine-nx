import { event } from '@card-engine-nx/state';

export const standAndFight = event(
  {
    name: 'Stand and Fight',
    cost: 'X',
    sphere: 'spirit',
  },
  {
    description:
      "Action: Choose an ally with a printed cost of X in any player's discard pile. Put that ally into play under your control. (The chosen ally can belong to any sphere of influence.)",
    action: {
      player: 'controller',
      action: {
        chooseCardActions: {
          title: 'Choose ally',
          target: {
            type: 'ally',
            sphere: 'any',
            zoneType: 'discardPile',
          },
          action: [
            {
              controller: {
                payResources: {
                  amount: { card: { target: 'target', value: 'cost' } },
                  sphere: 'spirit',
                },
              },
            },
            { putInPlay: 'controller' },
          ],
        },
      },
    },
  }
);
