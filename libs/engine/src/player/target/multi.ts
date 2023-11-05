import { PlayerId, keys, values } from '@card-engine-nx/basic';
import { PlayerTarget } from '@card-engine-nx/state';
import { intersection, isArray, last, uniq } from 'lodash';
import { ViewContext } from '../../context/view';
import { max } from 'lodash/fp';
import { getPlayerFromScope } from '../../scope/getPlayer';
import { getTargetCard } from '../../card/target/single';

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
    const player = getPlayerFromScope(ctx, target);

    if (player) {
      return player;
    }

    throw new Error(`no ${target} player in scope`);
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
    const players = values(ctx.state.players);
    const value = max(players.map((p) => p.thread));
    if (value !== undefined) {
      return players.filter((p) => value === p.thread).map((p) => p.id);
    } else {
      return [];
    }
  }

  if (['0', '1', '2', '3'].includes(target)) {
    return [target];
  }

  throw new Error(`unknown player target: ${JSON.stringify(target)}`);
}
