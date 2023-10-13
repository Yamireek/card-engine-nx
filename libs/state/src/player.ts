import { PlayerId, PlayerZoneType } from '@card-engine-nx/basic';
import { ZoneState } from './zone';
import { LimitType } from './types';

export type PlayerState = {
  id: PlayerId;
  zones: Record<PlayerZoneType, ZoneState>;
  thread: number;
  eliminated: boolean;
  flags: Record<string, boolean>;
  limits: Record<string, { type: LimitType; uses: number }>;
};
