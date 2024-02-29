import {
  CardId,
  GameZoneType,
  PlayerId,
  PlayerZoneType,
  ZoneId,
  ZoneType,
} from '@card-engine-nx/basic';
import { Scope, State, ZoneState, ZoneTarget } from '@card-engine-nx/state';
import { keys } from 'lodash/fp';
import { ViewContext } from '../context/view';
import { getTargetPlayer } from '../player/target/single';

export function isInGame(zone: ZoneId | ZoneType) {
  const inGameZones: Array<GameZoneType | PlayerZoneType> = [
    'activeLocation',
    'stagingArea',
    'playerArea',
    'engaged',
  ];

  if (typeof zone === 'string') {
    return inGameZones.includes(zone);
  } else {
    return inGameZones.includes(zone.type);
  }
}
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
}

export function getTargetZoneId(
  target: ZoneTarget,
  ctx: ViewContext,
  scopes: Scope[]
): ZoneId {
  if (typeof target === 'string') {
    return target;
  } else {
    const player = getTargetPlayer(target.player, ctx, scopes);
    return {
      player,
      type: target.type,
    };
  }
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
export function isInPlay(zone: PlayerZoneType | GameZoneType): boolean {
  switch (zone) {
    case 'activeLocation':
    case 'engaged':
    case 'playerArea':
    case 'questArea':
    case 'stagingArea':
      return true;
    default:
      return false;
  }
}
