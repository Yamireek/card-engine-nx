import { Scenario } from '@card-engine-nx/state';
import {
  aForkInTheRoad,
  achosenPath1,
  achosenPath2,
  fliesAndSpiders,
} from '../cards';
import { ambushOnTheShore } from '../cards/quests/ambushOnTheShore';
import { anduinPassage } from '../cards/quests/anduinPassage';
import { outOfTheDungeons } from '../cards/quests/outOfTheDungeons';
import { theNecromancersTower } from '../cards/quests/theNecromancersTower';
import { throughTheCaverns } from '../cards/quests/throughTheCaverns';
import { toTheRiver } from '../cards/quests/toTheRiver';
import { dolGuldurOrcs } from '../sets/dolGuldurOrcs';
import { escapeFromDolGuldur as escape } from '../sets/escapeFromDolGuldur';
import { journeyAlongTheAnduin as journey } from '../sets/journeyAlongTheAnduin';
import { passageThroughMirkwood as passage } from '../sets/passageThroughMirkwood';
import { sauronsReach } from '../sets/sauronsReach';
import { spidersOfMirkwood } from '../sets/spidersOfMirkwood';
import { wilderlands } from '../sets/wilderlands';

export const passageThroughMirkwood: Scenario = {
  name: 'Passage Through Mirkwood',
  quest: [fliesAndSpiders, aForkInTheRoad, achosenPath1, achosenPath2],
  sets: [dolGuldurOrcs, passage, spidersOfMirkwood],
};

export const journeyAlongTheAnduin: Scenario = {
  name: 'Journey Along the Anduin',
  quest: [toTheRiver, anduinPassage, ambushOnTheShore],
  sets: [dolGuldurOrcs, journey, sauronsReach, wilderlands],
};

export const escapeFromDolGuldur: Scenario = {
  name: 'Escape from Dol Guldur',
  quest: [theNecromancersTower, throughTheCaverns, outOfTheDungeons],
  sets: [dolGuldurOrcs, escape, spidersOfMirkwood],
};
