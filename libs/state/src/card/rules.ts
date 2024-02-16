import { merge } from 'ts-deepmerge';

export type CardRules = {
  attacksStagingArea?: true;
  noThreatContribution?: true;
  cantAttack?: true;
};

export function mergeCardRules(r1: CardRules, r2: CardRules): CardRules {
  return merge(r1, r2);
}
