import { Scope, ZoneState, ZoneTarget } from '@card-engine-nx/state';
import { getTargetPlayers } from '../../player/target/multi';
import { ViewContext } from '../../context/view';

export function getTargetZones(
  target: ZoneTarget,
  ctx: ViewContext
): ZoneState[] {
  if (typeof target === 'string') {
    return [ctx.state.zones[target]];
  }

  const players = getTargetPlayers(target.player, ctx);
  return players.flatMap((p) => {
    const ps = ctx.state.players[p];
    if (ps) {
      return ps.zones[target.type];
    } else {
      return [];
    }
  });
}
