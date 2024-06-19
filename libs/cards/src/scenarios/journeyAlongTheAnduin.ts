import { Scenario } from '@card-engine-nx/state';
import { ambushOnTheShore } from '../cards/quests/ambushOnTheShore';
import { anduinPassage } from '../cards/quests/anduinPassage';
import { toTheRiver } from '../cards/quests/toTheRiver';
import { dolGuldurOrcs } from '../sets/dolGuldurOrcs';
import { journeyAlongTheAnduin as journey } from '../sets/journeyAlongTheAnduin';
import { sauronsReach } from '../sets/sauronsReach';
import { wilderlands } from '../sets/wilderlands';

export const journeyAlongTheAnduin: Scenario = {
  name: 'Journey Along the Anduin',
  quest: [toTheRiver, anduinPassage, ambushOnTheShore],
  sets: [dolGuldurOrcs, journey, sauronsReach, wilderlands],
};
