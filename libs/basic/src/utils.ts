import { PlayerId } from '.';

export function values<TK extends string | number, TI>(
  records?: Partial<Record<TK, TI>>
) {
  if (!records) {
    return [];
  }
  return Object.values(records) as TI[];
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
