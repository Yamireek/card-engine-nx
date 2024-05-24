import { Phase } from '@card-engine-nx/basic';
import { CardTarget } from '../card/target';
import { CardBoolExpr } from '../card/expression/bool';
import { NumberExpr } from './number';
import { EventBool } from '../event/bool';

export type BoolExpr =
  | boolean
  | 'enemiesToEngage'
  | 'undefended.attack'
  | {
      event?: EventBool;
      and?: BoolExpr[];
      not?: BoolExpr;
      phase?: Phase;
      someCard?: CardTarget;
      eq?: [NumberExpr, NumberExpr];
      more?: [NumberExpr, NumberExpr];
      less?: [NumberExpr, NumberExpr];
      card?: {
        target: CardTarget;
        value: CardBoolExpr;
      };
    };
