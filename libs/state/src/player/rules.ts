import { merge } from 'ts-deepmerge';

export type PlayerRules = {
  multipleDefenders?: true;
  disableDraw?: true;
};

export function mergePlayerRules(r1: PlayerRules, r2: PlayerRules): PlayerRules {
  return merge(r1, r2);
}
