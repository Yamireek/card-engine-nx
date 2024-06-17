import { Action } from '../action';
import { BoolExpr } from '../expression';
import { CardAction } from './action';

export type CardRules = {
  attacksStagingArea?: boolean;
  noThreatContribution?: boolean;
  cantAttack?: boolean;
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

export function mergeArrays<T>(lists: (T[] | undefined)[]): T[] {
  return lists.flatMap((i) => i ?? []);
}

export function mergeBools(list: (boolean | undefined)[]): boolean {
  return list.some((l) => l === true);
}

export function mergeCardRules(...list: CardRules[]): CardRules {
  return {
    attacksStagingArea: mergeBools(list.map((l) => l.attacksStagingArea)),
    noThreatContribution: mergeBools(list.map((l) => l.noThreatContribution)),
    cantAttack: mergeBools(list.map((l) => l.cantAttack)),
    shadows: mergeArrays(list.map((l) => l.shadows)),
    whenRevealed: mergeArrays(list.map((l) => l.whenRevealed)),
    refreshCost: mergeArrays(list.map((l) => l.refreshCost)),
    travel: mergeArrays(list.map((l) => l.travel)),
    setup: mergeArrays(list.map((l) => l.setup)),
    action: mergeArrays(list.map((l) => l.action)),
    conditional: {
      advance: mergeArrays(list.map((l) => l.conditional?.advance)),
      travel: mergeArrays(list.map((l) => l.conditional?.travel)),
    },
  };
}
