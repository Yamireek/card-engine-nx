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
  action?: Action[];
};

export function mergeCardRules(
  r1: CardRules | undefined,
  r2: CardRules | undefined
): CardRules {
  if (r1) {
    if (r2) {
      return merge(r1, r2);
    } else {
      return r1;
    }
  } else {
    return r2 ?? {};
  }
}
