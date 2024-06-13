import { merge } from 'ts-deepmerge';
import { GameZoneType, PlayerId, PlayerZoneType } from './enums';
import { Flavor } from './flavors';

export type CardId = Flavor<number, 'CardId'>;

export type ZoneId = GameZoneType | { player: PlayerId; type: PlayerZoneType };

export type Keywords = {
  doomed?: number;
  surge?: number;
  ranged?: boolean;
  sentinel?: boolean;
};

export type Keyword = keyof Keywords;

export function mergeKeywords(k1?: Keywords, k2?: Keywords): Keywords {
  if (k1 && k2) {
    return {
      doomed: (k1.doomed ?? 0) + (k2.doomed ?? 0),
      surge: (k1.surge ?? 0) + (k2.surge ?? 0),
      ranged: k1.ranged || k2.ranged,
      sentinel: k1.sentinel || k2.sentinel,
    };
  }

  if (!k1 && k2) {
    return k2;
  }

  if (k1 && !k2) {
    return k1;
  }

  return {};
}
