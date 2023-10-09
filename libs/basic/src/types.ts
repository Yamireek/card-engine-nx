import { GameZoneType, PlayerId, PlayerZoneType } from './enums';
import { Flavor } from './flavors';

export type CardId = Flavor<number, 'CardId'>;

export type CardNumProp = 'attack' | 'defense' | 'willpower';

export type ZoneId = GameZoneType | { player: PlayerId; type: PlayerZoneType };

export type Keywords = {
  ranged?: boolean;
  sentinel?: boolean;
  surge?: boolean;
};

export function getZoneType(zoneId: ZoneId) {
  if (typeof zoneId === 'string') {
    return zoneId;
  } else {
    return zoneId.type;
  }
}

export function getZoneIdString(zoneId: ZoneId) {
  if (typeof zoneId === 'string') {
    return zoneId;
  } else {
    return `${zoneId.player}-${zoneId.type}`;
  }
}

export function zonesEqual(a: ZoneId, b: ZoneId) {
  if (a === b) {
    return true;
  }

  if (typeof a !== 'string' && typeof b !== 'string') {
    return a.player === b.player && a.type === b.type;
  }

  return false;
}
