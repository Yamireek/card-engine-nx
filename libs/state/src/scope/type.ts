import { CardId, PlayerId } from '@card-engine-nx/basic';
import { PendingEffect } from '../effect';

export type Scope = {
  x?: number;
  card?: Record<string, CardId[]>;
  player?: Record<string, PlayerId[]>;
  event?: Event;
  effect?: PendingEffect;
};
