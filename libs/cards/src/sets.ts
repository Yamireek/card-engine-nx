import { EncounterSet } from '@card-engine-nx/state';
import * as enemy from './enemies';
import * as location from './locations';
import * as treachery from './treacheries';

export const dolGuldurOrcs: EncounterSet = {
  easy: [
    enemy.dolGuldurOrcs,
    enemy.dolGuldurOrcs,
    enemy.dolGuldurOrcs,
    enemy.dolGuldurBeastmaster,
    treachery.drivenByShadow,
    treachery.theNecromancersReach,
    location.necromancersPass,
    location.enchantedStream,
    location.enchantedStream,
  ],
  normal: [
    enemy.chieftanUfthak,
    enemy.dolGuldurBeastmaster,
    treachery.theNecromancersReach,
    treachery.theNecromancersReach,
    location.necromancersPass,
  ],
};

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

export const spidersOfMirkwood: EncounterSet = {
  easy: [
    enemy.kingSpider,
    enemy.kingSpider,
    enemy.ungoliantsSpawn,
    location.greatForestWeb,
    location.greatForestWeb,
    location.mountainsOfMirkwood,
    location.mountainsOfMirkwood,
    location.mountainsOfMirkwood,
  ],
  normal: [
    enemy.hummerhorns,
    treachery.eyesOfTheForest,
    treachery.caughtInAWeb,
    treachery.caughtInAWeb,
  ],
};
