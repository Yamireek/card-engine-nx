import { GameZoneType, PlayerZoneType } from '@card-engine-nx/basic';
import { PlayerTarget } from '../player/target';

export type ZoneTarget =
  | GameZoneType
  | {
      player: PlayerTarget;
      type: PlayerZoneType;
    };
