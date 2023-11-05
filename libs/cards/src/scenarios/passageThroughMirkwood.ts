import { Scenario } from '@card-engine-nx/state';
import * as achosenPath2 from '../cards/quests/achosenPath2';
import * as achosenPath1 from '../cards/quests/achosenPath1';
import * as aForkInTheRoad from '../cards/quests/aForkInTheRoad';
import * as fliesAndSpiders from '../cards/quests/fliesAndSpiders';
import { spidersOfMirkwood } from '../sets/spidersOfMirkwood';
import { passageThroughMirkwood as passage } from '../sets/passageThroughMirkwood';
import { dolGuldurOrcs } from '../sets/dolGuldurOrcs';

export const passageThroughMirkwood: Scenario = {
  name: 'Passage Through Mirkwood',
  quest: [
    fliesAndSpiders.fliesAndSpiders,
    aForkInTheRoad.aForkInTheRoad,
    achosenPath1.achosenPath1,
    achosenPath2.achosenPath2,
  ],
  sets: [dolGuldurOrcs, passage, spidersOfMirkwood],
};
