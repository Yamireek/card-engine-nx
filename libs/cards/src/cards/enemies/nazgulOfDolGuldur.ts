import { enemy } from '@card-engine-nx/state';

export const nazgulOfDolGuldur = enemy({
  name: 'Nazgûl of Dol Guldur',
  engagement: 40,
  threat: 5,
  attack: 4,
  defense: 3,
  hitPoints: 9,
  traits: ['nazgul'],
  // No attachments can be played on Nazgûl of Dol Guldur.
  // Forced: When the prisoner is 'rescued', move Nazgûl of Dol Guldur into the staging area.
  // Forced: After a shadow effect dealt to Nazgûl of Dol Guldur resolves, the engaged player must choose
  // and discard 1 character he controls.
});
