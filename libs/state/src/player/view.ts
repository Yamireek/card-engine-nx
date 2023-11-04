import { PlayerId } from '@card-engine-nx/basic';

export type PlayerView = {
  id: PlayerId;
  multipleDefenders?: boolean;
  disableDraw?: boolean;
};
