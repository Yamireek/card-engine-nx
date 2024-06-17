import { enemy } from '@card-engine-nx/state';

export const easternCrows = enemy({
  name: 'Eastern Crows',
  engagement: 30,
  threat: 1,
  attack: 1,
  defense: 0,
  hitPoints: 1,
  traits: ['creature'],
  keywords: {
    surge: 1,
  },
  // Forced: After Eastern Crows is defeated, shuffle it back into the encounter deck.
  // Shadow: attacking enemy gets +1 Attack (+2 Attack instead if defending player's threat is 35 or higher.)
});
