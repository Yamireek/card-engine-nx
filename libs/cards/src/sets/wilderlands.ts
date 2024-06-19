import { EncounterSet } from '@card-engine-nx/state';
import * as enemy from '../cards/enemies';
import * as location from '../cards/locations';
import * as treachery from '../cards/treacheries';

export const wilderlands: EncounterSet = {
  easy: [
    enemy.wolfRider,
    enemy.hillTroll,
    enemy.goblinSniper,
    enemy.goblinSniper,
    enemy.wargs,
    enemy.wargs,
    location.theBrownLands,
    location.theBrownLands,
    location.theEastBight,
    location.theEastBight,
  ],
  normal: [enemy.marshAdder, treachery.despair, treachery.despair],
};
