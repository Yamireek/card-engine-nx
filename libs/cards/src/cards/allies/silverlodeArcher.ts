import { ally } from '@card-engine-nx/state';

export const silverlodeArcher = ally({
  name: 'Silverlode Archer',
  cost: 3,
  willpower: 1,
  attack: 2,
  defense: 0,
  hitPoints: 1,
  traits: ['archer', 'silvan'],
  sphere: 'leadership',
  unique: false,
  keywords: {
    ranged: true,
  },
});
