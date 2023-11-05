import { EncounterSet } from '@card-engine-nx/state';
import * as enemy from '../cards/enemies';
import * as location from '../cards/locations';

export const passageThroughMirkwood: EncounterSet = {
  easy: [
    enemy.forestSpider,
    enemy.forestSpider,
    enemy.forestSpider,
    enemy.forestSpider,
    enemy.eastBightPatrol,
    enemy.blackForestBats,
    location.oldForestRoad,
    location.oldForestRoad,
    location.forestGate,
    location.forestGate,
  ],
  normal: [],
};
