import { Scenario } from '@card-engine-nx/state';
import {
  aForkInTheRoad,
  achosenPath1,
  achosenPath2,
  fliesAndSpiders,
} from '../cards';
import { dolGuldurOrcs } from '../sets/dolGuldurOrcs';
import { passageThroughMirkwood as passage } from '../sets/passageThroughMirkwood';
import { spidersOfMirkwood } from '../sets/spidersOfMirkwood';

export const passageThroughMirkwood: Scenario = {
  name: 'Passage Through Mirkwood',
  quest: [fliesAndSpiders, aForkInTheRoad, achosenPath1, achosenPath2],
  sets: [dolGuldurOrcs, passage, spidersOfMirkwood],
};
