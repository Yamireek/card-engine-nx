import { CardId, PlayerId } from '@card-engine-nx/basic';
import { CardState, State } from '.';
import { CardView } from './view';

export type Ability = (state: State, card: CardView) => void;

export type Modifier = (state: State, card: CardView, ctx: Context) => void;

export type Context = { selfCard?: CardId };

export type ExecutorTypes = {
  Action: (state: State, ctx: Context) => void;
  Bool: () => boolean;
  Num: (state: State, ctx: Context) => number;

  PlayerAction: (state: State, playerId: PlayerId[]) => void;
  PlayerTarget: (state: State) => PlayerId[];

  CardAction: (state: State, cardIds: CardId[]) => void;
  CardTarget: (state: State, ctx: Context) => CardId[];
  CardNum: (state: State, card: CardState, ctx: Context) => number;

  Ability: Ability;
  Modifier: Modifier;
};
