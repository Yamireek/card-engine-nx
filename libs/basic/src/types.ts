import { merge } from 'ts-deepmerge';
import { GameZoneType, PlayerId, PlayerZoneType } from './enums';
import { Flavor } from './flavors';

export type CardId = Flavor<number, 'CardId'>;

export type ZoneId = GameZoneType | { player: PlayerId; type: PlayerZoneType };

export type Keywords = {
  doomed?: number;
  ranged?: boolean;
  sentinel?: boolean;
  surge?: boolean;
};

export type Keyword = keyof Keywords;

export function mergeKeywords(k1?: Keywords, k2?: Keywords): Keywords {
  if (k1 && k2) {
    return merge(k1, k2);
  }

  if (!k1 && k2) {
    return k2;
  }

  if (k1 && !k2) {
    return k1;
  }

  return {};
}
