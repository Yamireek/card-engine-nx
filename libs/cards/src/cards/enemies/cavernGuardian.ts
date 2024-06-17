import { enemy } from '@card-engine-nx/state';

export const cavernGuardian = enemy({
  name: 'Cavern Guardian',
  engagement: 8,
  threat: 2,
  attack: 2,
  defense: 1,
  hitPoints: 2,
  traits: ['undead'],
  keywords: { doomed: 1 },
  // Shadow: Choose and discard 1 attachment you control. Discarded objective cards are returned to the staging area.
  // (If this attack is undefended, discard all attachments you control.)
});
