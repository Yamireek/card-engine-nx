import { EncounterSet } from '@card-engine-nx/state';
import * as enemy from '../cards/enemies';
import * as location from '../cards/locations';
import * as treachery from '../cards/treacheries';

export const journeyAlongTheAnduin: EncounterSet = {
  easy: [
    enemy.mistyMountainGoblins,
    enemy.mistyMountainGoblins,
    enemy.mistyMountainGoblins,
    location.banksOfTheAnduin,
    location.banksOfTheAnduin,
    location.gladdenFields,
  ],
  normal: [
    treachery.massingAtNight,
    location.gladdenFields,
    location.gladdenFields,
  ],
};
