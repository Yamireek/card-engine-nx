import { hero } from '@card-engine-nx/state';

export const dunhere = hero(
  {
    name: 'Dúnhere',
    threatCost: 8,
    willpower: 1,
    attack: 2,
    defense: 1,
    hitPoints: 4,
    traits: ['rohan', 'warrior'],
    sphere: 'spirit',
  },
  {
    description:
      'Dúnhere can target enemies in the staging area when he attacks alone. When doing so, he gets +1 Attack.',
    card: [
      {
        rules: {
          attacksStagingArea: true,
        },
      },
      {
        if: {
          condition: {
            and: [
              {
                hasMark: 'attacking',
              },
              {
                global: {
                  someCard: {
                    mark: 'defending',
                    zoneType: 'stagingArea',
                  },
                },
              },
            ],
          },
          true: {
            increment: {
              attack: 1,
            },
          },
        },
      },
    ],
  }
);
