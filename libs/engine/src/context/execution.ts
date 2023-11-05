import { Scope, State, View } from '@card-engine-nx/state';
import { UIEvents } from '../events/uiEvents';
import { Random } from '../utils/random';

export type ExecutionContext = {
  state: State;
  view: View;
  events: UIEvents;
  random: Random;
  scopes: Scope[];
};
