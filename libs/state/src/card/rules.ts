import { merge } from 'ts-deepmerge';
import { Action } from '../action';
import { BoolExpr } from '../expression';
import { CardAction } from './action';

export type CardRules = {
  attacksStagingArea?: true;
  noThreatContribution?: true;
  cantAttack?: true;
  shadows?: Array<{ description: string; action: Action }>;
  whenRevealed?: Array<{ description: string; action: Action }>;
  conditional?: {
    advance?: BoolExpr[];
    travel?: BoolExpr[];
  };
  refreshCost?: CardAction[];
  travel?: Action[];
  setup?: Action[];
};

export function mergeCardRules(r1: CardRules, r2: CardRules): CardRules {
  return merge(r1, r2);
}
