import { PlayerId } from '@card-engine-nx/basic';
import { PlayerRules } from './rules';

export type PlayerView = {
  id: PlayerId;
  rules: PlayerRules;
};
