import { sum } from 'lodash/fp';
import { PlayerId } from '@card-engine-nx/basic';
import { PlayerNumberExpr } from '@card-engine-nx/state';
import { getTargetCards } from '../../card/target/multi';
import { ViewContext } from '../../context/view';

export function calculatePlayerExpr(
  expr: PlayerNumberExpr,
  playerId: PlayerId,
  ctx: ViewContext
): number {
  if ('resources' in expr) {
    const sphere = expr.resources;
    const heroes = getTargetCards({ sphere, controller: playerId }, ctx);
    return sum(heroes.map((id) => ctx.state.cards[id].token.resources));
  }

  throw new Error(`unknown player expr ${JSON.stringify(expr)}`);
}
