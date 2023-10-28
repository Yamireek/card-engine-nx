import { Scenario } from '@card-engine-nx/state';
import * as quest from './quests';
import * as set from './sets';
import * as enemy from './enemies';

export const passageThroughMirkwood: Scenario = {
  name: 'Passage Through Mirkwood',
  quest: [
    quest.fliesAndSpiders,
    quest.aForkInTheRoad,
    quest.achosenPath1,
    quest.achosenPath2,
  ],
  sets: [set.dolGuldurOrcs, set.passageThroughMirkwood, set.spidersOfMirkwood],
};

export const testScenario: Scenario = {
  name: 'Test',
  quest: [
    quest.fliesAndSpiders,
    quest.aForkInTheRoad,
    quest.achosenPath1,
    quest.achosenPath2,
  ],
  sets: [
    {
      easy: [],
      normal: [enemy.kingSpider, enemy.kingSpider],
    },
  ],
};
