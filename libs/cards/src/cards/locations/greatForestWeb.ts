import { location } from '@card-engine-nx/state';

export const greatForestWeb = location(
  {
    name: 'Great Forest Web',
    threat: 2,
    questPoints: 2,
    traits: ['forest'],
  },
  {
    description:
      'Travel: Each player must exhaust 1 hero he controls to travel here.',
    travel: {
      player: 'each',
      action: {
        chooseCardActions: {
          title: 'Choose hero to exhaust',
          target: {
            type: 'hero',
            controller: 'target',
          },
          action: 'exhaust',
        },
      },
    },
  }
);
