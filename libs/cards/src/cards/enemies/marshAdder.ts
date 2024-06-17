import { enemy } from '@card-engine-nx/state';

export const marshAdder = enemy({
  name: 'Marsh Adder',
  engagement: 40,
  threat: 3,
  attack: 4,
  defense: 1,
  hitPoints: 7,
  traits: ['creature'],
  victory: 3,
  // Forced: Each time Marsh Adder attacks you, raise your threat by 1.
});
