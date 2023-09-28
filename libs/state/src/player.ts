import { PlayerId, PlayerZoneType } from '@card-engine-nx/basic';
import { ZoneState } from './zone';
import { Limit } from './types';

export type PlayerState = {
  id: PlayerId;
  zones: Record<PlayerZoneType, ZoneState>;
  thread: number;
  eliminated: boolean;
  limitUses: {
    game: Record<string, number>;
  };
  flags: Record<string, boolean>;
  limits: Record<string, Limit>;
};
