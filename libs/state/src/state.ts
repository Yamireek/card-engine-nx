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
import {
  Action,
  CardTarget,
  Limit,
  CardModifier,
  PlayerTarget,
  Until,
  BoolExpr,
} from './types';
import { PlayerModifier } from './view';

export type Event =
  | {
      type: 'receivedDamage';
      card: CardId;
      damage: number;
    }
  | {
      type: 'destroyed';
      card: CardId;
      attackers: CardId[];
    }
  | { type: 'declaredAsDefender'; card: CardId; attacker: CardId }
  | { type: 'enteredPlay'; card: CardId }
  | { type: 'leftPlay'; card: CardId }
  | { type: 'revealed'; card: CardId }
  | { type: 'traveled'; card: CardId }
  | { type: 'engaged'; card: CardId; player: PlayerId }
  | { type: 'end_of_round' }
  | { type: 'attacked'; card: CardId }
  | { type: 'explored'; card: CardId }
  | { type: 'whenRevealed' };

export type PendingEffect = {
  description: string;
  whenRevealed: Action;
  canceled?: true;
};

export type Choice =
  | {
      id: number;
      title: string;
      type: 'show';
      cardId: CardId;
    }
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
  vars: {
    card: Record<string, CardId | undefined>;
    player: Record<string, PlayerId | undefined>;
  };
  actionLimits: Array<{ type: Limit; card: CardId; index: number }>;
  event: Event[];
  modifiers: GameModifier[];
};

export type GameModifier =
  | {
      source: CardId;
      card: CardTarget;
      modifier: CardModifier;
      condition?: BoolExpr;
      until?: Until;
    }
  | {
      source: CardId;
      player: PlayerTarget;
      modifier: PlayerModifier;
      condition?: BoolExpr;
      until?: Until;
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
