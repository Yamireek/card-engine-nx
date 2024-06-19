import { location } from '@card-engine-nx/state';

export const theBrownLands = location({
  name: 'The Brown Lands',
  threat: 5,
  questPoints: 1,
  traits: ['wasteland'],
  // Forced: After the players travel to The Brown Lands, place 1 progress token on it.
});
