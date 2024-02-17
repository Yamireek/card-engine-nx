import { merge } from 'ts-deepmerge';
import { Action } from '../action';
import { BoolExpr } from '../expression';

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
};

export function mergeCardRules(r1: CardRules, r2: CardRules): CardRules {
  return merge(r1, r2);
}
