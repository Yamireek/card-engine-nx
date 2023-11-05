import { CardDefinition } from '../definitions/types';

export type PlayerDeck = {
  name: string;
  heroes: CardDefinition[];
  library: CardDefinition[];
};
