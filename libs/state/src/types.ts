import { CardId, CardType, PlayerId, Token } from '@card-engine-nx/basic';
import { PlayerDeck, Scenario } from './card';

export type ActionResult = 'none' | 'partial' | 'full';

export type Action =
  | 'empty'
  | 'shuffleEncounterDeck'
  | 'executeSetupActions'
  | {
      player?: { action: PlayerAction; target: PlayerTarget };
      sequence?: Action[];
      addPlayer?: PlayerDeck;
      setupScenario?: Scenario;
      addToStagingArea?: string;
    };

export type PlayerAction =
  | 'empty'
  | 'shuffleLibrary'
  | { draw?: number; sequence?: Action[]; incrementThreat?: NumberExpr };

export type CardAction =
  | 'empty'
  | { dealDamage?: number; heal?: number; sequence?: Action[] };

export type Ability = {
  description: string;
  selfModifier?: Modifier;
  action?: Action;
  setup?: Action;
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
