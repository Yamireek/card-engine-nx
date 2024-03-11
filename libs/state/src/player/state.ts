import { LimitType, PlayerId, PlayerZoneType } from '@card-engine-nx/basic';
import { ZoneState } from '../zone/state';
import { PlayerView } from './view';

export type PlayerState = {
  id: PlayerId;
  zones: Record<PlayerZoneType, ZoneState>;
  thread: number;
  eliminated: boolean;
  flags: Record<string, boolean>;
  limits: Record<string, { type: LimitType; uses: number }>;
  view: PlayerView;
};
