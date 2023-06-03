import { ZoneId } from '@card-engine-nx/basic';
import { State, ZoneState, ZoneTarget } from '@card-engine-nx/state';
import { getTargetPlayer } from '../player/target';

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

export function getTargetZone(target: ZoneTarget, state: State): ZoneState[] {
  if (target.game) {
    return [state.zones[target.game]];
  }

  if (target.player) {
    const ids = getTargetPlayer(target.player.id, state);
    const zone = target.player.zone;
    return ids.map((id) => {
      const player = state.players[id];
      if (!player) {
        throw new Error('player not found');
      }
      return player.zones[zone];
    });
  }

  throw new Error(`unknown zone target: ${JSON.stringify(target)}`);
}
