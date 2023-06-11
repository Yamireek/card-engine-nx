import {
  CardId,
  GameZoneType,
  PlayerId,
  PlayerZoneType,
  ZoneId,
} from '@card-engine-nx/basic';
import { State, ZoneState, ZoneTarget } from '@card-engine-nx/state';
import { getTargetPlayer } from '../player/target';
import { keys } from 'lodash/fp';
import { ViewContext } from '../context';

export function getZoneState(zoneId: ZoneId, state: State): ZoneState {
  if (zoneId.owner === 'game') {
    return state.zones[zoneId.type];
  } else {
    const player = state.players[zoneId.owner];
    if (player) {
      return player.zones[zoneId.type];
    } else {
      throw new Error('zone not found');
    }
  }

  throw new Error(`unknown zone target: ${JSON.stringify(zoneId)}`);
}

export function getTargetZone(
  target: ZoneTarget,
  ctx: ViewContext
): ZoneState[] {
  if (target.game) {
    return [ctx.state.zones[target.game]];
  }

  if (target.player) {
    const ids = getTargetPlayer(target.player.id, ctx);
    const zone = target.player.zone;
    return ids.map((id) => {
      const player = ctx.state.players[id];
      if (!player) {
        throw new Error('player not found');
      }
      return player.zones[zone];
    });
  }

  throw new Error(`unknown zone target: ${JSON.stringify(target)}`);
}

export function getCardZoneId(cardId: CardId, state: State): ZoneId {
  for (const zone of keys(state.zones) as GameZoneType[]) {
    if (state.zones[zone].cards.includes(cardId)) {
      return { owner: 'game', type: zone };
    }
  }

  for (const player of keys(state.players) as PlayerId[]) {
    for (const zone of keys(state.players[player]?.zones) as PlayerZoneType[]) {
      if (state.players[player]?.zones[zone].cards.includes(cardId)) {
        return { owner: player, type: zone };
      }
    }
  }

  throw new Error(`card not found`);
}
