import { PlayerZoneType, GameZoneType } from '@card-engine-nx/basic';

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
