import { PlayerId, values } from '@card-engine-nx/basic';
import { PlayerTarget } from '@card-engine-nx/state';
import { isArray } from 'lodash';
import { ViewContext } from '../context';

export function getTargetPlayer(
  target: PlayerTarget,
  ctx: ViewContext
): PlayerId[] {
  if (isArray(target)) {
    return target;
  }

  if (target === 'each') {
    return values(ctx.state.players)
      .filter((p) => !p.eliminated)
      .map((p) => p.id);
  }

  if (target === 'owner') {
    if (ctx.player['owner']) {
      return [ctx.player['owner']];
    } else if (ctx.state.vars.player['owner']) {
      return [ctx.state.vars.player['owner']];
    } else {
      throw new Error('no owner player in context');
    }
  }

  if (target === 'first') {
    // TODO fix
    return ['0'];
  }

  if (['0', '1', '2', '3'].includes(target)) {
    return [target];
  }

  throw new Error(`unknown player target: ${JSON.stringify(target)}`);
}
