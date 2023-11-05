import { ally } from '@card-engine-nx/state';

export const horsebackArcher = ally({
  name: 'Horseback Archer',
  unique: false,
  cost: 3,
  willpower: 0,
  attack: 2,
  defense: 1,
  hitPoints: 2,
  traits: ['rohan', 'archer'],
  sphere: 'tactics',
  keywords: {
    ranged: true,
  },
});
