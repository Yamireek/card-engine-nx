import { treachery } from '@card-engine-nx/state';

export const underTheShadow = treachery(
  { name: 'Under the Shadow' }
  // When Revealed: Until the end of the phase, raise the total Threat in the staging area by X,
  // where X is the number of players in the game.
  // Shadow: Defending player raises his threat by the number of enemies with which he is engaged.
);
