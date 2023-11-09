import { event } from '@card-engine-nx/state';

export const bladeMastery = event(
  {
    name: 'Blade Mastery',
    cost: 1,
    sphere: 'tactics',
  },
  {
    description:
      'Action: Choose a character. Until the end of the phase, that character gains +1 [attack] and +1 [defense].',
    action: {
      player: 'controller',
      action: {
        chooseCardActions: {
          title: 'Choose character for +1 Attack and +1 Defense.',
          target: 'character',
          action: {
            modify: {
              increment: { attack: 1, defense: 1 },
            },
            until: 'end_of_phase',
          },
        },
      },
    },
  }
);
