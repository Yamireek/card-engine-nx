import { ally } from '@card-engine-nx/state';

export const daughterOfTheNimrodel = ally(
  {
    name: 'Daughter of the Nimrodel',
    cost: 3,
    willpower: 1,
    attack: 0,
    defense: 0,
    hitPoints: 1,
    traits: ['silvan'],
    sphere: 'lore',
    unique: false,
  },
  {
    description:
      'Action: Exhaust Daughter of the Nimrodel to heal up to 2 damage on any 1 hero.',
    action: [
      { card: { target: 'self', action: 'exhaust' } },
      {
        player: {
          target: 'controller',
          action: {
            chooseCardActions: {
              title: 'Choose hero to heal',
              target: { type: 'hero' },
              action: { heal: 2 },
            },
          },
        },
      },
    ],
  }
);
