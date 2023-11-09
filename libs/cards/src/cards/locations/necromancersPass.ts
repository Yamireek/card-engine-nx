import { location } from '@card-engine-nx/state';

export const necromancersPass = location(
  {
    name: "Necromancer's Pass",
    threat: 3,
    questPoints: 2,
    traits: ['stronghold', 'dolGuldur'],
  },
  {
    description:
      'Travel: The first player must discard 2 cards from his hand at random to travel here.',
    travel: {
      player: 'first',
      action: {
        discard: {
          amount: 2,
          target: 'random',
        },
      },
    },
  }
);
