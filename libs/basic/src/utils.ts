import { isArray } from 'lodash';
import { PlayerId, ZoneId } from '.';

export function values<TK extends string | number, TI>(
  records?: Partial<Record<TK, TI>>
) {
  if (!records) {
    return [];
  }
  return Object.values(records) as TI[];
}

export function keys<TK extends string | number, TI>(
  records?: Partial<Record<TK, TI>>
): TK[] {
  if (!records) {
    return [];
  }
  return Object.keys(records).filter(
    (k) => records[k as TK] !== undefined
  ) as TK[];
}

export function validPlayerId(id?: number | string | null): PlayerId {
  if (id === undefined || id === null) {
    throw new Error('invalid playerId');
  }

  if (typeof id === 'number') {
    if (id >= 0 && id <= 4) {
      return id.toString() as PlayerId;
    } else {
      throw new Error('invalid playerId');
    }
  }

  if (['0', '1', '2', '3'].includes(id)) {
    return id as PlayerId;
  } else {
    throw new Error('invalid playerId');
  }
}

export function capitalizeFirst(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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

export function mergeArrays<T>(array: T[] | undefined, item: T | T[]): T[] {
  if (!array) {
    return asArray(item);
  }

  return [...array, ...asArray(item)];
}

export function asArray<T>(item?: T | T[]): T[] {
  if (!item) {
    return [];
  }

  if (isArray(item)) {
    return item;
  } else {
    return [item];
  }
}
