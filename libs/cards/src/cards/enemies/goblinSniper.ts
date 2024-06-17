import { enemy } from '@card-engine-nx/state';

export const goblinSniper = enemy({
  name: 'Goblin Sniper',
  engagement: 48,
  threat: 2,
  attack: 2,
  defense: 0,
  hitPoints: 2,
  traits: ['goblin', 'orc'],
  // During the encounter phase, players cannot optionally engage Goblin Sniper if there are other enemies in the staging area.
  // Forced: If Goblin Sniper is in the staging area at the end of the combat phase, each player deals 1 point of damage
  // to 1 character he controls.
});
