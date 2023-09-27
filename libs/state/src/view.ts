import { CardId, Mark, PrintedProps } from '@card-engine-nx/basic';
import {
  Modifier,
  Action,
  CardTarget,
  NextStage,
} from './types';

export type View = {
  cards: Record<CardId, CardView>;
  actions: UserCardAction[];
};

export type UserCardAction = {
  card: CardId;
  description: string;
  action: Action;
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
  setup?: Action[];
  attachesTo?: CardTarget;
  nextStage?: NextStage;
  responses?: {
    receivedDamage?: Array<{ description: string; action: Action }>;
  };
  disabled?: Partial<Record<Mark, boolean>>;
};
