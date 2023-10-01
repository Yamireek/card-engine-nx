import {
  CardId,
  GameZoneType,
  Mark,
  PlayerId,
  PlayerZoneType,
  PrintedProps,
} from '@card-engine-nx/basic';
import {
  Modifier,
  Action,
  CardTarget,
  NextStage,
  EventType,
  BoolExpr,
} from './types';
import { GameModifier } from './state';

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
  ability: Modifier;
};

export type CardView = {
  id: CardId;
  printed: PrintedProps;
  props: PrintedProps;
  zone: PlayerZoneType | GameZoneType;
  attachesTo?: CardTarget;
  nextStage?: NextStage;
  disabled?: Partial<Record<Mark, boolean>>;
  abilities: string[];
};

export type PlayerView = {
  id: PlayerId;
  multipleDefenders?: boolean;
};

export type PlayerModifierView = { applied: boolean; modifier: PlayerModifier };

export type PlayerModifier = 'can_declate_multiple_defenders';
