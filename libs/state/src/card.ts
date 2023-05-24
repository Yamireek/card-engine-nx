import {
  CardId,
  Side,
  PlayerId,
  Marks,
  Tokens,
  Orientation,
  PrintedProps,
} from '@card-engine-nx/basic';
import { ModifierState } from './modifier';
import { Ability } from './types';

export type PlayerDeck = {
  name: string;
  heroes: CardDefinition[];
  library: CardDefinition[];
};

export type CardDefinition = {
  front: PrintedProps & { abilities: Ability[] };
  back: PrintedProps & { abilities: Ability[] };
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
  owner: PlayerId | 'game';
  controller: PlayerId | 'game';
  limitUses: {
    phase: Record<string, number>;
    round: Record<string, number>;
  };
  modifiers: Array<ModifierState>;
};
