import { PlayerTarget, Scope } from '@card-engine-nx/state';
import { ViewContext } from '../../context/view';
import { getTargetPlayers } from './multi';

export function getTargetPlayer(
  target: PlayerTarget,
  ctx: ViewContext,
  scopes: Scope[]
) {
  const results = getTargetPlayers(target, ctx, scopes);
  if (results.length === 1) {
    return results[0];
  } else {
    throw new Error('unexpected result count');
  }
}
