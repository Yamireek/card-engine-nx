import { location } from '@card-engine-nx/state';

export const banksOfTheAnduin = location({
  name: 'Banks of the Anduin',
  threat: 1,
  questPoints: 3,
  traits: ['riverland'],
  // Forced: If Banks of the Anduin leaves play, return it to the top of the encounter deck
  // instead of placing it in the discard pile.
});
