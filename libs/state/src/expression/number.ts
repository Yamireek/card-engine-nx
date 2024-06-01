import { CardNumberExpr } from '../card/expression/number';
import { CardTarget } from '../card/target';
import { EventNumbers } from '../event/number';
import { PlayerNumberExpr } from '../player/number';
import { PlayerTarget } from '../player/target';
import { BoolExpr } from './bool';

export type NumberExpr =
  | number
  | 'countOfPlayers'
  | 'totalThreat'
  | 'surge'
  | 'X'
  | {
      count?: {
        cards?: CardTarget;
      };
      card?: {
        sum?: true;
        target: CardTarget;
        value: CardNumberExpr;
      };
      player?: {
        target: PlayerTarget;
        value: PlayerNumberExpr;
      };
      event?: EventNumbers;
      plus?: NumberExpr[];
      minus?: [NumberExpr, NumberExpr];
      if?: {
        cond: BoolExpr;
        true: NumberExpr;
        false: NumberExpr;
      };
      multiply?: [NumberExpr, NumberExpr];
      min?: NumberExpr[];
    };
