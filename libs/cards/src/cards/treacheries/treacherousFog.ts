import { treachery } from '@card-engine-nx/state';

export const treacherousFog = treachery(
  { name: 'Treacherous Fog' }
  // When Revealed: Each location in the staging area gets +1 Threat until the end of the phase.
  // Then, each player with a threat of 35 or higher chooses and discards 1 card from his hand.
);
