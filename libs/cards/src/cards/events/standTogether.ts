import { event } from '@card-engine-nx/state';

export const standTogether = event(
  {
    name: 'Stand Together',
    cost: 0,
    sphere: 'tactics',
  },
  {
    description:
      'Action: Choose a player. That player may declare any number of his eligible characters as defenders against each enemy attacking him this phase.',
    phase: 'combat',
    action: {
      player: 'controller',
      action: {
        choosePlayerActions: {
          title: 'Choose player',
          target: 'each',
          action: {
            modify: { multipleDefenders: true },
            until: 'end_of_phase',
          },
        },
      },
    },
  }
);
