import { Scenario } from '@card-engine-nx/state';
import { outOfTheDungeons } from '../cards/quests/outOfTheDungeons';
import { theNecromancersTower } from '../cards/quests/theNecromancersTower';
import { throughTheCaverns } from '../cards/quests/throughTheCaverns';
import { dolGuldurOrcs } from '../sets/dolGuldurOrcs';
import { escapeFromDolGuldur as escape } from '../sets/escapeFromDolGuldur';
import { spidersOfMirkwood } from '../sets/spidersOfMirkwood';

export const escapeFromDolGuldur: Scenario = {
  name: 'Escape from Dol Guldur',
  quest: [theNecromancersTower, throughTheCaverns, outOfTheDungeons],
  sets: [dolGuldurOrcs, escape, spidersOfMirkwood],
};
