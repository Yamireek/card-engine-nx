import { ally } from '@card-engine-nx/state';

export const guardOfTheCitadel = ally({
  name: 'Guard of the Citadel',
  cost: 2,
  willpower: 1,
  attack: 1,
  defense: 0,
  hitPoints: 2,
  traits: ['gondor', 'warrior'],
  sphere: 'leadership',
  unique: false,
});
