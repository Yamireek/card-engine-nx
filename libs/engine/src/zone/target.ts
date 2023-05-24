import { CardId, PlayerId, keys } from '@card-engine-nx/basic';
import {
  State,
  CardTarget,
  Context,
  PlayerTarget,
  ZoneState,
} from '@card-engine-nx/state';
import { ZoneId } from '../player/action';

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
