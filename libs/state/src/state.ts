import {
  CardId,
  GameZoneType,
  Phase,
  PlayerId,
  PlayerZoneType,
} from '@card-engine-nx/basic';
import { CardDefinition, CardState } from './card';
import { PlayerState } from './player';
import { ZoneState } from './zone';
import { Action, Limit } from './types';

export type Event =
  | 'none'
  | {
      type: 'receivedDamage';
      cardId: CardId;
      damage: number;
    };

export type State = {
  round: number;
  phase: Phase;
  firstPlayer: PlayerId;
  effects: Array<{ description: string }>;
  players: Partial<Record<PlayerId, PlayerState>>;
  zones: Record<GameZoneType, ZoneState>;
  cards: Record<CardId, CardState>;
  triggers: {
    end_of_phase: Action[];
    end_of_round: Action[];
  };
  choice?:
    | {
        id: number;
        title: string;
        type: 'actions';
      }
    | {
        id: number;
        player: PlayerId;
        title: string;
        type: 'single';
        optional: boolean;
        options: Array<{ title: string; action: Action; cardId?: CardId }>;
      }
    | {
        id: number;
        player: PlayerId;
        title: string;
        type: 'multi';
        options: Array<{ title: string; action: Action; cardId?: CardId }>;
      }
    | {
        id: number;
        player: PlayerId;
        title: string;
        type: 'split';
        amount: number;
        count?: { min?: number; max?: number };
        options: Array<{
          title: string;
          action: Action;
          cardId: CardId;
          min: number;
          max: number;
        }>;
      };
  next: Action[];
  result?: {
    win: boolean;
    score: number;
  };
  nextId: CardId;
  vars: {
    card: Record<string, CardId | undefined>;
    player: Record<string, PlayerId | undefined>;
  };
  actionLimits: Array<{ type: Limit; card: CardId; index: number }>;
  event?: Event;
};

export type SimpleCardState =
  | CardDefinition
  | {
      card: CardDefinition;
      resources?: number;
      progress?: number;
      damage?: number;
      exhausted?: boolean;
      attachments?: CardDefinition[];
    };

export type SimpleState = {
  players: Array<Partial<Record<PlayerZoneType, SimpleCardState[]>>>;
} & Partial<Record<GameZoneType, SimpleCardState[]>>;
