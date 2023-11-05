import { event } from '@card-engine-nx/state';

export const thicketOfSpears = event(
  {
    name: 'Thicket of Spears',
    cost: 3,
    sphere: 'tactics',
  },
  {
    description:
      "You must use resources from 3 different heroes' pools to pay for this card. Action: Choose a player. That player's engaged enemies cannot attack that player this phase.",
    cost: {
      heroes: 3,
    },
    phase: 'combat',
    action: {
      player: {
        target: 'controller',
        action: {
          choosePlayerActions: {
            title: 'Choose player',
            target: 'each',
            action: {
              engaged: {
                modify: {
                  rule: {
                    cantAttack: true,
                  },
                },
                until: 'end_of_phase',
              },
            },
          },
        },
      },
    },
  }
);
