import { treachery } from '@card-engine-nx/state';

export const despair = treachery(
  { name: 'Despair' }
  // When Revealed: Remove 4 progress tokens from the current quest card.
  // (If there are fewer than 4 progress tokens on the quest, remove all progress tokens from that quest.)
  // Shadow: Defending character does not count its Defense
);
