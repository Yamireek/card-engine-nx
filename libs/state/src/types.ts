import {
  CardId,
  CardType,
  PlayerId,
  Token,
  ZoneId,
} from '@card-engine-nx/basic';

export type ActionResult = 'none' | 'partial' | 'full';

export type Action =
  | 'empty'
  | {
      player?: { action: PlayerAction; target: PlayerTarget };
      shuffle?: { zone: ZoneId };
      sequence?: Action[];
    };

export type PlayerAction =
  | 'empty'
  | { draw?: number; sequence?: Action[]; incrementThreat?: NumberExpr };

export type CardAction =
  | 'empty'
  | { dealDamage?: number; heal?: number; sequence?: Action[] };

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
        sum?: true;
        card: CardTarget;
        value: CardNumberExpr;
      };
    };

export type CardNumberExpr =
  | number
  | 'threadCost'
  | {
      tokens: Token;
    };

export type CardTarget =
  | 'self'
  | { owner?: PlayerId; and?: CardTarget[]; type?: CardType[] };

export type PlayerTarget = PlayerId | 'each';

export type Context = { selfCard?: CardId };
