import {
  CardId,
  GameZoneType,
  PlayerId,
  PlayerZoneType,
  ZoneId,
} from '@card-engine-nx/basic';
import { State, ZoneState, ZoneTarget } from '@card-engine-nx/state';
import { getTargetPlayer, getTargetPlayers } from '../player/target';
import { keys } from 'lodash/fp';
import { ViewContext } from '../context';

export function getZoneState(zoneId: ZoneId, state: State): ZoneState {
  if (typeof zoneId === 'string') {
    return state.zones[zoneId];
  } else {
    const player = state.players[zoneId.player];
    if (player) {
      return player.zones[zoneId.type];
    } else {
      throw new Error('zone not found');
    }
  }

  throw new Error(`unknown zone target: ${JSON.stringify(zoneId)}`);
}

export function getTargetZone(target: ZoneTarget, ctx: ViewContext) {
  const zones = getTargetZones(target, ctx);
  if (zones.length <= 1) {
    return zones[0];
  } else {
    throw new Error('unexpected result count');
  }
}

export function getTargetZoneId(target: ZoneTarget, ctx: ViewContext): ZoneId {
  if (typeof target === 'string') {
    return target;
  } else {
    const player = getTargetPlayer(target.player, ctx);
    return {
      player,
      type: target.type,
    };
  }
}

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

  throw new Error(`unknown zone target: ${JSON.stringify(target)}`);
}

export function getCardZoneId(cardId: CardId, state: State): ZoneId {
  for (const zone of keys(state.zones) as GameZoneType[]) {
    if (state.zones[zone].cards.includes(cardId)) {
      return zone;
    }
  }

  for (const player of keys(state.players) as PlayerId[]) {
    for (const zone of keys(state.players[player]?.zones) as PlayerZoneType[]) {
      if (state.players[player]?.zones[zone].cards.includes(cardId)) {
        return { player: player, type: zone };
      }
    }
  }

  throw new Error(`card not found`);
}

export function getZoneType(zoneId: ZoneId | ZoneTarget) {
  if (typeof zoneId === 'string') {
    return zoneId;
  } else {
    return zoneId.type;
  }
}
