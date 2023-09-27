import {
  CardId,
  Side,
  PlayerId,
  Marks,
  Tokens,
  Orientation,
  PrintedProps,
  Keywords,
} from '@card-engine-nx/basic';
import { Modifier } from './types';

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
  front: PrintedProps & { abilities: Modifier[] };
  back: PrintedProps & { abilities: Modifier[] };
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
  modifiers: Modifier[];
  keywords: Keywords;
};
