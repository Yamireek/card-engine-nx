import { State, View } from '@card-engine-nx/state';
import React, { useMemo } from 'react';
import { createView } from '@card-engine-nx/engine';

export type Moves = {
  next: () => void;
  makeChoice: (choice: number[]) => void;
};

export const StateContext = React.createContext<{
  state: State;
  view: View;
  moves: Moves;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}>({} as any);

export const StateProvider = (
  props: React.PropsWithChildren<{ init: State }>
) => {
  const [state, setState] = React.useState<State>(props.init);
  const view = useMemo(() => createView(state), [state]);

  const moves: Moves = {
    next: () => {
      throw new Error('not implemented');
    },
    makeChoice: () => {
      throw new Error('not implemented');
    },
  };

  return (
    <StateContext.Provider value={{ state, moves, view }}>
      {props.children}
    </StateContext.Provider>
  );
};

export function useGameState() {
  return React.useContext(StateContext);
}
