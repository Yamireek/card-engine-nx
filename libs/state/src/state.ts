import { CardId, GameZoneType, Phase, PlayerId } from '@card-engine-nx/basic';
import { CardState } from './card';
import { PlayerState } from './player';
import { ZoneState } from './zone';
import { Action } from './types';

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
  choice?: {
    id: number;
    player?: PlayerId;
    title: string;
    dialog: boolean;
    multi: boolean;
    optional: boolean;
    options: Array<{ title: string; action: Action; cardId?: CardId }>;
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
};
