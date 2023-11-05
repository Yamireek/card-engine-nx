import { PlayerTarget } from '@card-engine-nx/state';
import { ViewContext } from '../../context/view';
import { getTargetPlayers } from './multi';

export function getTargetPlayer(target: PlayerTarget, ctx: ViewContext) {
  const results = getTargetPlayers(target, ctx);
  if (results.length === 1) {
    return results[0];
  } else {
    throw new Error('unexpected result count');
  }
}
