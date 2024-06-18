import { treachery } from '@card-engine-nx/state';

export const pursuedByShadow = treachery(
  { name: 'Pursued by Shadow' }
  // When Revealed: Each player raises his threat by 1 for each character he
  // controls that is not currently committed to a quest.
  // Shadow: Defending player chooses and returns 1 exhausted ally he controls to its owner's hand.
  // If he controls no exhausted allies, raise his threat by 3.
);
