import { Scenario } from '@card-engine-nx/state';
import {
  kingSpider,
  hummerhorns,
  ungoliantsSpawn,
  dolGuldurOrcs,
  chieftanUfthak,
  dolGuldurBeastmaster,
  forestSpider,
  eastBightPatrol,
  blackForestBats,
} from './enemies';
import {
  greatForestWeb,
  mountainsOfMirkwood,
  necromancersPass,
  enchantedStream,
  oldForestRoad,
  forestGate,
} from './locations';
import {
  fliesAndSpiders,
  aForkInTheRoad,
  achosenPath1,
  achosenPath2,
} from './quests';
import {
  eyesOfTheForest,
  caughtInAWeb,
  drivenByShadow,
  theNecromancersReach,
} from './treacheries';

export const passageThroughMirkwood: Scenario = {
  name: 'Passage Through Mirkwood',
  questCards: [fliesAndSpiders, aForkInTheRoad, achosenPath1, achosenPath2],
  encounterCards: [
    // kingSpider,
    // kingSpider,
    // hummerhorns,
    // ungoliantsSpawn,
    // greatForestWeb,
    // greatForestWeb,
    // mountainsOfMirkwood,
    // mountainsOfMirkwood,
    // mountainsOfMirkwood,
    // eyesOfTheForest,
    // caughtInAWeb,
    caughtInAWeb,
    // dolGuldurOrcs,
    // dolGuldurOrcs,
    // dolGuldurOrcs,
    // chieftanUfthak,
    // dolGuldurBeastmaster,
    // dolGuldurBeastmaster,
    // drivenByShadow,
    // theNecromancersReach,
    // theNecromancersReach,
    // theNecromancersReach,
    // necromancersPass,
    // necromancersPass,
    // enchantedStream,
    // enchantedStream,
    // forestSpider,
    // forestSpider,
    // forestSpider,
    // forestSpider,
    // eastBightPatrol,
    // blackForestBats,
    // oldForestRoad,
    // oldForestRoad,
    // forestGate,
    // forestGate,
  ],
};
