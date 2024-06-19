import { EncounterSet } from '@card-engine-nx/state';
import * as enemy from '../cards/enemies';
import * as location from '../cards/locations';
import * as treachery from '../cards/treacheries';

export const sauronsReach: EncounterSet = {
  easy: [
    enemy.easternCrows,
    treachery.evilStorm,
    treachery.evilStorm,
    treachery.pursuedByShadow,
    treachery.pursuedByShadow,
    treachery.treacherousFog,
    treachery.treacherousFog,
  ],
  normal: [enemy.easternCrows, enemy.easternCrows, treachery.evilStorm],
};
