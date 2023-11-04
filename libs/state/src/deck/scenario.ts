import { CardDefinition } from '../definitions/types';
import { EncounterSet } from './encounter';


export type Scenario = {
  name: string;
  quest: CardDefinition[];
  sets: EncounterSet[];
};
