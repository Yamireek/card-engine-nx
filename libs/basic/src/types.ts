import { sum } from 'lodash';
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

export function mergeKeywords(...list: Keywords[]): Keywords {
  return list.reduce(
    (p, c) => ({
      doomed: sum([p.doomed, c.doomed]),
      surge: sum([p.surge, c.surge]),
      ranged: p.ranged || c.ranged,
      sentinel: p.sentinel || c.sentinel,
    }),
    {}
  );
}
