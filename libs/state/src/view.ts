import { CardId, Mark, PlayerId, PrintedProps } from '@card-engine-nx/basic';
import { Modifier, Action, CardTarget, NextStage } from './types';

export type View = {
  cards: Record<CardId, CardView>;
  players: Partial<Record<PlayerId, PlayerView>>;
  actions: UserCardAction[];
};

export type UserCardAction = {
  card: CardId;
  description: string;
  action: Action;
  enabled?: true;
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

export type PlayerView = {
  id: PlayerId;
  modifiers: PlayerModifierView[];
  multipleDefenders?: boolean;
};

export type PlayerModifierView = { applied: boolean; modifier: PlayerModifier };

export type PlayerModifier = 'can_declate_multiple_defenders';
