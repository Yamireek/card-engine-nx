import { quest } from '@card-engine-nx/state';

export const fliesAndSpiders = quest({
  sequence: 1,
  name: 'Flies and Spiders',
  a: {
    abilities: [
      {
        description:
          'Setup: Search the encounter deck for 1 copy of the Forest Spider and 1 copy of the Old Forest Road, and add them to the staging area. Then, shuffle the encounter deck.',
        setup: [
          {
            card: {
              name: 'Forest Spider',
              take: 1,
            },
            action: {
              move: {
                to: 'stagingArea',
                side: 'front',
              },
            },
          },
          {
            card: {
              name: 'Old Forest Road',
              take: 1,
            },
            action: {
              move: {
                to: 'stagingArea',
                side: 'front',
              },
            },
          },
        ],
      },
    ],
  },
  b: {
    questPoints: 8,
  },
});
