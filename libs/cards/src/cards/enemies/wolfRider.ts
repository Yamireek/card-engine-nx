import { enemy } from '@card-engine-nx/state';

export const wolfRider = enemy({
  name: 'Wolf Rider',
  engagement: 10,
  threat: 1,
  attack: 2,
  defense: 0,
  hitPoints: 2,
  traits: ['goblin', 'orc'],
  keywords: {
    surge: 1,
  },
  // Shadow: Wolf Rider attacks the defending player. That player may declare 1 character as a defender.
  // Deal Wolf Rider its own Shadow card. After combat, return Wolf Rider to the top of the encounter deck.
});
