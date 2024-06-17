import { enemy } from '@card-engine-nx/state';

export const dungeonJailor = enemy({
  name: 'Dungeon Jailor',
  engagement: 38,
  threat: 1,
  attack: 2,
  defense: 3,
  hitPoints: 5,
  traits: ['dolGuldur', 'orc'],
  victory: 5,
  // Forced: If Dungeon Jailor is in the staging area after the players have just quested unsuccessfully,
  // shuffle 1 unclaimed objective card from the staging area back into the encounter deck.
});
