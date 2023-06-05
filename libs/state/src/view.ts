import { CardId, PrintedProps } from '@card-engine-nx/basic';
import { ModifierState } from './modifier';
import { Ability, Action } from './types';

export type View = {
  cards: Record<CardId, CardView>;
  actions: Array<{ card: CardId; description: string; action: Action }>;
};

export type PlayableCardAction = {
  payment: Action;
  effect: Action;
};

export type PlayableCardActionView = {
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
  actions: PlayableCardActionView[];
};
