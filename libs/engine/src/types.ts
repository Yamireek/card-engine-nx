import { CardId } from "@card-engine-nx/basic";
import { State } from "@card-engine-nx/state";

export type ExecutorTypes = {
  Action: (state: State) => void;
  Bool: () => void;
  CardAction: (state: State, cardIds: CardId[]) => void;
  CardTarget: (state: State) => CardId[];
  Num: (state: State) => number;
  PlayerAction: () => void;
  PlayerTarget: () => void;
};
