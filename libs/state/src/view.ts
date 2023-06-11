import { CardId, PrintedProps } from '@card-engine-nx/basic';
import { ModifierState } from './modifier';
import { Ability, Action, CardTarget } from './types';

export type View = {
  cards: Record<CardId, CardView>;
  actions: Array<{
    card: CardId;
    description: string;
    action: Action;
  }>;
};

export type ActivableCardAction = {
  description: string;
  action: Action;
};

export type CardView = {
  id: CardId;
  printed: PrintedProps;
  props: PrintedProps;
  abilities: Array<{ applied: boolean; ability: Ability }>;
  modifiers: Array<{ applied: boolean } & ModifierState>;
  setup: Action[];
  actions: ActivableCardAction[];
  attachesTo?: CardTarget;
};
