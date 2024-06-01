import {
  CardId,
  GameZoneType,
  LimitType,
  Phase,
  PlayerId,
} from '@card-engine-nx/basic';
import { Action } from './action';
import { CardState } from './card/state';
import { Choice } from './choice';
import { PendingEffect } from './effect';
import { Event } from './event';
import { GameModifier } from './modifier';
import { PlayerState } from './player/state';
import { Scope } from './scope/type';
import { ZoneState } from './zone/state';

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
  surge: 0;
};
