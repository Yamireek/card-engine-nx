import { CardId, PrintedProps } from '@card-engine-nx/basic';
import { ModifierState } from './modifier';
import { Ability, Action } from './types';

export type View = {
  cards: Record<CardId, CardView>;
};

export type CardView = {
  id: CardId;
  props: PrintedProps;
  abilities: Array<{ applied: boolean; ability: Ability }>;
  modifiers: Array<{ applied: boolean } & ModifierState>;
  setup: Action[];
};
