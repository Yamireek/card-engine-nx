import {
  CardId,
  Side,
  PlayerId,
  Marks,
  Tokens,
  Orientation,
  PrintedProps,
  Keywords,
  PlayerZoneType,
  GameZoneType,
} from '@card-engine-nx/basic';
import { CardModifier } from './types';

export type PlayerDeck = {
  name: string;
  heroes: CardDefinition[];
  library: CardDefinition[];
};

export type Scenario = {
  name: string;
  questCards: CardDefinition[];
  encounterCards: CardDefinition[];
};

export type CardDefinition = {
  front: PrintedProps & { abilities: CardModifier[] };
  back: PrintedProps & { abilities: CardModifier[] };
  orientation: Orientation;
};

export type CardState = {
  id: CardId;
  definition: CardDefinition;
  sideUp: Side;
  tapped: boolean;
  token: Tokens;
  mark: Marks;
  attachments: CardId[];
  attachedTo?: CardId;
  owner: PlayerId | undefined;
  controller: PlayerId | undefined;
  limitUses: {
    phase: Record<string, number>;
    round: Record<string, number>;
  };
  keywords: Keywords;
  zone: PlayerZoneType | GameZoneType;
};
