import { ZoneId } from '@card-engine-nx/basic';
import { State, ZoneState } from '@card-engine-nx/state';

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
