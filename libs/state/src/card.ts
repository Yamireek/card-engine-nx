import {
  CardId,
  CardDefinition,
  Side,
  PlayerId,
  Marks,
  Tokens,
} from "@card-engine-nx/basic";
import { ModifierState } from "./modifier";

export type CardState = {
  id: CardId;
  definition: CardDefinition;
  sideUp: Side;
  tapped: boolean;
  token: Tokens;
  mark: Marks;
  attachments: CardId[];
  owner: PlayerId | "game";
  controller: PlayerId | "game";
  limitUses: {
    phase: Record<string, number>;
    round: Record<string, number>;
  };
  modifiers: Array<ModifierState>;
};
