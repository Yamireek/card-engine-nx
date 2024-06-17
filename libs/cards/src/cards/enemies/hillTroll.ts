import { enemy } from '@card-engine-nx/state';

export const hillTroll = enemy({
  name: 'Hill Troll',
  engagement: 30,
  threat: 1,
  attack: 6,
  defense: 3,
  hitPoints: 9,
  traits: ['troll'],
  victory: 4,
  // Excess combat damage dealt by Hill Troll (damage that is dealt beyond the remaining hit points
  // of the character damaged by its attack) must be assigned as an increase to your threat.
});
