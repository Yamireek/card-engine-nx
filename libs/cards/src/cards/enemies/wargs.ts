import { enemy } from '@card-engine-nx/state';

export const wargs = enemy({
  name: 'Wargs',
  engagement: 20,
  threat: 2,
  attack: 3,
  defense: 1,
  hitPoints: 3,
  traits: ['creature'],
  // Forced: If Wargs is dealt a shadow card with no effect, return Wargs to the staging area after it attacks.
  // Shadow: attacking enemy gets +1 Attack (+2 Attack instead if this attack is undefended.)
});
