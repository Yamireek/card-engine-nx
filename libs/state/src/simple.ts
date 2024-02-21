import { GameZoneType, PlayerZoneType, Side } from '@card-engine-nx/basic';
import { CardDefinition } from './definitions/types';

export type SimpleState = {
  players: Array<Partial<Record<PlayerZoneType, SimpleCardState[]>>>;
} & Partial<Record<GameZoneType, SimpleCardState[]>>;

export type SimpleCardState =
  | CardDefinition
  | {
      card: CardDefinition;
      resources?: number;
      progress?: number;
      damage?: number;
      exhausted?: boolean;
      attachments?: CardDefinition[];
      side?: Side;
    };
