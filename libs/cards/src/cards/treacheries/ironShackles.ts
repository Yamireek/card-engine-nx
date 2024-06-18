import { treachery } from '@card-engine-nx/state';

export const ironShackles = treachery(
  { name: 'Iron Shackles' }
  // When Revealed: Attach Iron Shackles to the top of the first player's deck.
  // Counts as a Condition attachment with the text:
  // The next time a player would draw 1 or more cards from attached deck, discard Iron Shackles instead.
);
