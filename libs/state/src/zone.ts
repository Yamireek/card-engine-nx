import { CardId } from '@card-engine-nx/basic';

export type ZoneState = {
  stack: boolean; // TODO remove
  cards: CardId[];
};
