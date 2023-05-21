import { CardId, Token } from '@card-engine-nx/basic';

export type ActionResult = 'none' | 'partial' | 'full';

export type Action = 'empty';

export type CardAction = 'empty' | { dealDamage?: number; heal?: number };

export type Ability = {
  description: string;
  selfModifier?: Modifier;
  action?: Action;
};

export type Modifier = {
  increment?: {
    prop: 'attack' | 'defense';
    amount: NumberExpr;
  };
};

export type NumberExpr =
  | number
  | {
      fromCard?: {
        card: CardTarget;
        value: CardNumberExpr;
      };
    };

export type CardNumberExpr = {
  tokens: Token;
};

export type CardTarget = 'self' | 'each';

export type Context = { selfCard?: CardId };
