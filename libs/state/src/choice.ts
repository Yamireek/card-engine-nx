import { CardId, PlayerId } from '@card-engine-nx/basic';
import { Action } from './action';

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
      min: number;
      max: number;
      count?: { min?: number; max?: number };
      options: Array<{
        title: string;
        action: Action;
        cardId: CardId;
        min: number;
        max: number;
      }>;
    }
  | {
      id: number;
      player: PlayerId;
      type: 'X';
      min: number;
      max: number;
      action: Action;
    };
