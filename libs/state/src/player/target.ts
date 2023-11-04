import { PlayerId } from '@card-engine-nx/basic';
import { CardTarget } from '../card/target';

export type PlayerTarget =
  | PlayerId
  | PlayerId[]
  | 'each'
  | 'owner'
  | 'controller'
  | 'first'
  | 'next'
  | 'event'
  | 'highestThreat'
  | 'target'
  | 'defending'
  | {
      and?: PlayerTarget[];
      not?: PlayerTarget;
      controllerOf?: CardTarget;
      var?: string;
    };
