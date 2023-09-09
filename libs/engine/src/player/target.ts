import { PlayerId, values } from '@card-engine-nx/basic';
import { PlayerTarget } from '@card-engine-nx/state';
import { intersection, isArray, uniq } from 'lodash';
import { ViewContext } from '../context';
import { canPlayerExecute } from '../resolution';

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
    return [ctx.state.firstPlayer];
  }

  if (typeof target === 'object') {
    if (target.and) {
      const lists = target.and.map((t) => getTargetPlayer(t, ctx));
      return uniq(intersection(...lists));
    }

    if (target.canExecute) {
      const action = target.canExecute;
      return values(ctx.state.players)
        .filter((p) => canPlayerExecute(action, p.id, ctx))
        .map((p) => p.id);
    }

    if (target.controller) {
      const card = ctx.state.cards[target.controller];
      if (card.controller) {
        return [card.controller];
      } else {
        return [];
      }
    }

    throw new Error(`unknown player target: ${JSON.stringify(target)}`);
  }

  if (target === 'next') {
    const players = values(ctx.state.players)
      .filter((p) => !p.eliminated)
      .map((p) => p.id);

    if (players.length === 1) {
      return players;
    }

    const index = players.findIndex((p) => p === ctx.state.firstPlayer);
    if (index === players.length - 1) {
      return [players[0]];
    } else {
      return [players[index + 1]];
    }
  }

  if (['0', '1', '2', '3'].includes(target)) {
    return [target];
  }

  throw new Error(`unknown player target: ${JSON.stringify(target)}`);
}
