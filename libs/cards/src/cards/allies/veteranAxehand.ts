import { ally } from '@card-engine-nx/state';

export const veteranAxehand = ally({
  name: 'Veteran Axehand',
  cost: 2,
  willpower: 0,
  attack: 2,
  defense: 1,
  hitPoints: 2,
  traits: ['dwarf', 'warrior'],
  sphere: 'tactics',
  unique: false,
});
