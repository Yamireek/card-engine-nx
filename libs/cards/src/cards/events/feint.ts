import { event } from '@card-engine-nx/state';

export const feint = event(
  {
    name: 'Feint',
    cost: 1,
    sphere: 'tactics',
  },
  {
    description:
      'Combat Action: Choose an enemy engaged with a player. That enemy cannot attack that player this phase.',
    phase: 'combat',
    action: {
      player: 'controller',
      action: {
        chooseCardActions: {
          action: {
            modify: {
              rules: {
                cantAttack: true,
              },
            },
            until: 'end_of_phase',
          },
          title: 'Choose enemy',
          target: { type: 'enemy', zoneType: 'engaged' },
        },
      },
    },
  }
);
