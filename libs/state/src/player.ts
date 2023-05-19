import { PlayerId, PlayerZoneType } from "@card-engine-nx/basic";
import { ZoneState } from "./zone";

export type PlayerState = {
  id: PlayerId;
  zones: Record<PlayerZoneType, ZoneState>;
  thread: number;
  limitUses: {
    game: Record<string, number>;
  };
  flags: Record<string, boolean>;
};
