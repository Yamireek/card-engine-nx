import { CardId, PlayerId, PrintedProps, ZoneId } from '@card-engine-nx/basic';
import {
  CardModifier,
  Action,
  CardTarget,
  NextStage,
  EventType,
  BoolExpr,
  CardAction,
  CostModifier,
} from './types';
import { GameModifier, State } from './state';

export type View = {
  cards: Record<CardId, CardView>;
  players: Partial<Record<PlayerId, PlayerView>>;
  setup: Action[];
  actions: UserCardAction[];
  modifiers: GameModifierState[];
  responses: Partial<
    Record<
      EventType,
      Array<{
        source: CardId;
        card: CardId;
        description: string;
        condition?: BoolExpr;
        action: Action;
        forced: boolean;
      }>
    >
  >;
};

export type GameModifierState = {
  applied: boolean;
  modifier: GameModifier;
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
  ability: CardModifier;
};

export type CardRules = {
  attacksStagingArea?: true;
  noThreatContribution?: true;
  cantAttack?: true;
};

export type CardView = {
  id: CardId;
  printed: PrintedProps;
  props: PrintedProps;
  zone: ZoneId;
  attachesTo?: CardTarget;
  nextStage?: NextStage;
  effects: string[];
  whenRevealed: Array<{ description: string; action: Action }>;
  travel: Action[];
  conditional: {
    advance: BoolExpr[];
    travel: BoolExpr[];
  };
  refreshCost: CardAction[];
  cost?: CostModifier;
  rules: CardRules;
  shadows: Array<{ description: string; action: Action }>;
};

export type PlayerView = {
  id: PlayerId;
  multipleDefenders?: boolean;
  disableDraw?: boolean;
};

export type PlayerModifierView = { applied: boolean; modifier: PlayerModifier };

export type PlayerModifier = 'can_declate_multiple_defenders' | 'disable_draw';

export type StateView = State & View;
