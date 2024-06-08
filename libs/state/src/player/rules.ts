import { merge } from 'ts-deepmerge';

export type PlayerRules = {
  multipleDefenders?: true;
  disableDraw?: true;
};

export function mergePlayerRules(
  r1: PlayerRules | undefined,
  r2: PlayerRules | undefined
): PlayerRules {
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
