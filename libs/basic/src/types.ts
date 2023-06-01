import { GameZoneType, PlayerId, PlayerZoneType } from './enums';
import { Flavor } from './flavors';

export type CardId = Flavor<number, 'CardId'>;

export type CardNumProp = 'attack' | 'defense' | 'willpower';

export type ZoneId =
  | { owner: 'game'; type: GameZoneType }
  | { owner: PlayerId; type: PlayerZoneType };

export type Keywords = {
  ranged: boolean;
  sentinel: boolean;
};
