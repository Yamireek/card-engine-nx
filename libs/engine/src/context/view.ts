import { Scope, State, View } from '@card-engine-nx/state';

export type ViewContext = {
  state: State;
  view: View;
  scopes: Scope[];
};
