import { location } from '@card-engine-nx/state';

export const gladdenFields = location({
  name: 'Gladden Fields',
  threat: 3,
  questPoints: 3,
  traits: ['marshland'],
  // Forced: While Gladden Fields is the active location, each player must raise
  // his threat by an additional point during the refresh phase.
});
