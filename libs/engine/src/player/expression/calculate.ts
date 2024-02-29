import { PlayerNumberExpr, Scope } from '@card-engine-nx/state';
import { ViewContext } from '../../context/view';
import { PlayerId } from '@card-engine-nx/basic';
import { sum } from 'lodash/fp';
import { getTargetCards } from '../../card/target/multi';

export function calculatePlayerExpr(
  expr: PlayerNumberExpr,
  playerId: PlayerId,
  ctx: ViewContext,
  scopes: Scope[]
): number {
  if ('resources' in expr) {
    const sphere = expr.resources;
    const heroes = getTargetCards(
      { sphere, controller: playerId },
      ctx,
      scopes
    );
    return sum(heroes.map((id) => ctx.state.cards[id].token.resources));
  }

  throw new Error(`unknown player expr ${JSON.stringify(expr)}`);
}
