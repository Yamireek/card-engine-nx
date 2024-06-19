import { location } from '@card-engine-nx/state';

export const theEastBight = location({
  name: 'The East Bight',
  threat: 1,
  questPoints: 6,
  traits: ['wasteland'],
  // When faced with the option to travel, the players must travel to The East Bight if there is no active location.
});
