import { PlayerId, keys, values } from '@card-engine-nx/basic';
import { PlayerTarget } from '@card-engine-nx/state';
import { intersection, isArray, last, uniq } from 'lodash';
import { ViewContext } from '../context';
import { getTargetCard } from '../card';

export function getTargetPlayer(target: PlayerTarget, ctx: ViewContext) {
  const results = getTargetPlayers(target, ctx);
  if (results.length === 1) {
    return results[0];
  } else {
    throw new Error('unexpected result count');
  }
}

export function getTargetPlayers(
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

  if (
    target === 'owner' ||
    target === 'controller' ||
    target === 'target' ||
    target === 'defending'
  ) {
    const inCtx = ctx.player[target];
    if (inCtx) {
      return [inCtx];
    } else {
      const inVar = ctx.state.vars.player[target];
      if (inVar) {
        return [inVar];
      }
    }

    throw new Error(`no ${target} player in context`);
  }

  if (target === 'first') {
    return [ctx.state.firstPlayer];
  }

  if (typeof target === 'object') {
    if (target.and) {
      const lists = target.and.map((t) => getTargetPlayers(t, ctx));
      return uniq(intersection(...lists));
    }

    if (target.not) {
      const not = getTargetPlayers(target.not, ctx);
      return keys(ctx.state.players).filter((key) => !not.includes(key));
    }

    if (target.controllerOf) {
      const cardId = getTargetCard(target.controllerOf, ctx);
      if (!cardId) {
        return [];
      }
      const card = ctx.state.cards[cardId];
      if (card.controller) {
        return [card.controller];
      } else {
        return [];
      }
    }

    if (target.var) {
      const inVar = ctx.player[target.var] ?? ctx.state.vars.player[target.var];
      if (inVar) {
        return [inVar];
      } else {
        throw new Error('player var not found');
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

  if (target === 'event') {
    const event = last(ctx.state.event);
    if (event && 'player' in event) {
      return [event.player];
    } else {
      throw new Error('no player in event');
    }
  }

  if (target === 'highestThreat') {
    // TODO highestThreat
    return ['0'];
  }

  if (['0', '1', '2', '3'].includes(target)) {
    return [target];
  }

  throw new Error(`unknown player target: ${JSON.stringify(target)}`);
}
