import { CardId, Mark, Phase, PrintedProps } from '@card-engine-nx/basic';
import { ModifierState } from './modifier';
import {
  Modifier,
  Action,
  CardTarget,
  Limit,
  NextStage,
  PaymentConditions,
} from './types';

export type View = {
  cards: Record<CardId, CardView>;
  actions: UserCardAction[];
};

export type UserCardAction = {
  card: CardId;
  description: string;
  action: Action;
  payment?: PaymentConditions;
  limit?: Limit;
  phase?: Phase;
};

export type AbilityView = {
  printed: boolean;
  applied: boolean;
  ability: Modifier;
};

export type CardView = {
  id: CardId;
  printed: PrintedProps;
  props: PrintedProps;
  abilities: Array<AbilityView>;
  actions: UserCardAction[];
  setup?: Action[];
  attachesTo?: CardTarget;
  nextStage?: NextStage;
  responses?: {
    receivedDamage?: Array<{ description: string; action: Action }>;
  };
  disabled?: Partial<Record<Mark, boolean>>;
};
