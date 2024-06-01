import { Phase } from '@card-engine-nx/basic';
import { CardBoolExpr } from '../card/expression/bool';
import { CardTarget } from '../card/target';
import { EventBool } from '../event/bool';
import { NumberExpr } from './number';

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
