import { PlayerTarget } from '../player/target';
import { CardTarget } from '../card/target';
import { CardNumberExpr } from '../card/expression/number';
import { BoolExpr } from './bool';
import { EventNumbers } from '../event/number';
import { PlayerNumberExpr } from '../player/number';

export type NumberExpr =
  | number
  | 'countOfPlayers'
  | 'totalThreat'
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
