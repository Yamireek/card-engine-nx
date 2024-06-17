import { enemy } from '@card-engine-nx/state';

export const mistyMountainGoblins = enemy({
  name: 'Misty Mountain Goblins',
  engagement: 15,
  threat: 2,
  attack: 2,
  defense: 1,
  hitPoints: 3,
  traits: ['goblin', 'orc'],
  // Forced: After Misty Mountain Goblins attacks, remove 1 progress token from the current quest.
  // Shadow: Remove 1 progress token from the current quest. (3 progress tokens instead if this attack is undefended.)
});
