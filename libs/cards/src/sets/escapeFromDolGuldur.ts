import { EncounterSet } from '@card-engine-nx/state';
import * as enemy from '../cards/enemies';
import * as location from '../cards/locations';
import * as treachery from '../cards/treacheries';

export const escapeFromDolGuldur: EncounterSet = {
  easy: [
    enemy.nazgulOfDolGuldur,
    enemy.cavernGuardian,
    enemy.cavernGuardian,
    treachery.underTheShadow,
    treachery.underTheShadow,
    treachery.ironShackles,
    location.endlessCaverns,
    location.endlessCaverns,
    location.towerGate,
    location.towerGate,
  ],
  normal: [enemy.dungeonJailor, enemy.dungeonJailor],
};