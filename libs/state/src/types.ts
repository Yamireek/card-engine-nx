import { CardId, PlayerId } from '@card-engine-nx/basic';
import { CardState, State } from '.';
import { CardView } from './view';

export type ActionResult = 'none' | 'partial' | 'full';

export type Action<T = void> = {
  print(): string;
  execute(state: State): T;
  result(state: State): ActionResult;
};

export type CardAction = {
  print(): string;
  execute(state: State, card: CardState): void;
  result(state: State): ActionResult;
};

export type Ability = {
  description: string;
  print(): string;
  apply(state: State, card: CardView): void;
};

export type Modifier = {
  print(): string;
  apply(state: State, card: CardView, ctx: Context): void;
};

export type Exp<T> = {
  print(): string;
  calc(state: State, ctx: Context): T;
};

export type CardExp<T> = {
  print(): string;
  calc(state: State, card: CardState): T;
};

export type CardTarget = {
  print(): string;
  get(state: State, ctx: Context): CardId[];
};

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
