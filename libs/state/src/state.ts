import {
  CardId,
  GameZoneType,
  LimitType,
  Phase,
  PlayerId,
} from '@card-engine-nx/basic';
import { CardState } from './card/state';
import { PlayerState } from './player/state';
import { ZoneState } from './zone/state';
import { Action } from './action';
import { Choice } from './choice';
import { GameModifier } from './modifier';
import { PendingEffect } from './effect';
import { Scope } from './scope/type';
import { Event } from './event';

export type State = {
  round: number;
  phase: Phase;
  firstPlayer: PlayerId;
  players: Partial<Record<PlayerId, PlayerState>>;
  zones: Record<GameZoneType, ZoneState>;
  cards: Record<CardId, CardState>;
  triggers: {
    end_of_phase: Action[];
    end_of_round: Action[];
  };
  choice?: Choice;
  stack: PendingEffect[];
  next: Action[];
  result?: {
    win: boolean;
    score: number;
  };
  nextId: CardId;
  // TODO move to cards
  actionLimits: Array<{
    card: CardId;
    amount: number;
    type: LimitType;
  }>;
  event: Event[];
  modifiers: GameModifier[];
  scopes: Scope[];
  invalidate?: boolean;
};
