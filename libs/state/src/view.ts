import { CardId, Mark, Phase, PrintedProps } from '@card-engine-nx/basic';
import { ModifierState } from './modifier';
import { Ability, Action, CardTarget, Limit, NextStage } from './types';

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
  limit?: Limit;
  phase?: Phase;
};

export type CardView = {
  id: CardId;
  printed: PrintedProps;
  props: PrintedProps;
  abilities: Array<{ applied: boolean; ability: Ability }>;
  modifiers: Array<{ applied: boolean } & ModifierState>;
  actions: ActivableCardAction[];
  setup?: Action[];
  attachesTo?: CardTarget;
  nextStage?: NextStage;
  responses?: {
    receivedDamage?: Array<{ description: string; action: Action }>;
  };
  disabled?: Partial<Record<Mark, boolean>>;
};
