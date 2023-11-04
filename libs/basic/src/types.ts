import { GameZoneType, PlayerId, PlayerZoneType } from './enums';
import { Flavor } from './flavors';

export type CardId = Flavor<number, 'CardId'>;

export type ZoneId = GameZoneType | { player: PlayerId; type: PlayerZoneType };

export type Keywords = {
  ranged?: boolean;
  sentinel?: boolean;
  surge?: boolean;
};
