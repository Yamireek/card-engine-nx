import {
  CardId,
  GameZoneType,
  Mark,
  PlayerId,
  PlayerZoneType,
  PrintedProps,
} from '@card-engine-nx/basic';
import { Modifier, Action, CardTarget, NextStage, EventType } from './types';
import { GameModifier } from './state';

export type View = {
  cards: Record<CardId, CardView>;
  players: Partial<Record<PlayerId, PlayerView>>;
  actions: UserCardAction[];
  modifiers: GameModifierState[];
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
  setup?: Action[];
  attachesTo?: CardTarget;
  nextStage?: NextStage;
  responses?: Partial<
    Record<EventType, Array<{ description: string; action: Action }>>
  >;
  disabled?: Partial<Record<Mark, boolean>>;
};

export type PlayerView = {
  id: PlayerId;
  multipleDefenders?: boolean;
};

export type PlayerModifierView = { applied: boolean; modifier: PlayerModifier };

export type PlayerModifier = 'can_declate_multiple_defenders';
