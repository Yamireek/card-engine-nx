import { PlayerNumberExpr } from '@card-engine-nx/state';
import { ViewContext } from '../context';
import { PlayerId } from '@card-engine-nx/basic';

export function calculatePlayerExpr(
  expr: PlayerNumberExpr,
  playerId: PlayerId,
  ctx: ViewContext
): number {
  if ('resources' in expr) {
    return 20; // TODO count resources
  }

  throw new Error(`unknown player expr ${JSON.stringify(expr)}`);
}
