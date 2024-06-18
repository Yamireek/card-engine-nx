import { treachery } from '@card-engine-nx/state';

export const massingAtNight = treachery(
  { name: 'Massing at Night' }
  // When Revealed: Reveal X additional cards from the encounter deck. X is the number of players in the game.
  // Shadow: Deal X shadow cards to this attacker. X is the number of players in the game.
);
