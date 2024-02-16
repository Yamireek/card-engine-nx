import { PlayerId } from '@card-engine-nx/basic';

export type PlayerView = {
  id: PlayerId;
  multipleDefenders?: boolean; // TODO move to rules
  disableDraw?: boolean; // TODO move to rules
};
