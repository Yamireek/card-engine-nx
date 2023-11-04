import { Token } from '@card-engine-nx/basic';

export type CardNumberExpr =
  | number
  | 'threadCost'
  | 'willpower'
  | 'threat'
  | 'sequence'
  | 'cost'
  | {
      tokens: Token;
    };
