import { Scope, State, View } from '@card-engine-nx/state';

export type ViewContext = {
  state: State;
  view: View;
  scopes: Scope[];
};

export function createViewContext(state: State, view: View): ViewContext {
  return {
    state,
    view,
    scopes: state.scopes,
  };
}
