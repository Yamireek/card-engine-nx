import { PlayerDeck, Scenario, State, View } from '@card-engine-nx/state';
import React, { useMemo } from 'react';
import {
  UIEvents,
  advanceToChoiceState,
  createView,
} from '@card-engine-nx/engine';
import { createRxUiEvents } from './GameDisplay';
import { PlayerId } from '@card-engine-nx/basic';

export type Moves = {
  skip: () => void;
  choose: (choosen: number[]) => void;
  action: (index: number) => void;
  selectScenario: (scenario: Scenario) => void;
  selectDeck: (deck: PlayerDeck) => void;
};

export const StateContext = React.createContext<{
  state: State;
  view: View;
  moves: Moves;
  events: UIEvents;
  playerId: PlayerId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}>({} as any);

export const StateProvider = (
  props: React.PropsWithChildren<{ init: State }>
) => {
  const [state, setState] = React.useState<State>(props.init);
  const view = useMemo(() => createView(state), [state]);
  const events = useMemo(() => createRxUiEvents(), []);

  const moves: Moves = {
    skip: () => {
      state.choice = undefined;
      advanceToChoiceState(state, events, true, true);
      setState({ ...state });
    },
    choose: (choosen) => {
      if (!state.choice) {
        return;
      }

      const options = state.choice.options;
      const choices = choosen.map((index) => options[index]);
      state.choice = undefined;
      state.next.unshift(...choices.map((c) => c.action));
      advanceToChoiceState(state, events, false, true);
      setState({ ...state });
    },
    action: (index) => {
      if (!state.choice) {
        return;
      }

      const action = view.actions[index];
      const title = state.choice.title;
      state.choice = undefined;
      state.next.unshift({ playerActions: title });
      state.next.unshift(action.action);
      advanceToChoiceState(state, events, false, true);
      setState({ ...state });
    },
    selectDeck: () => {
      return;
    },
    selectScenario: () => {
      return;
    },
  };

  return (
    <StateContext.Provider
      value={{ state, moves, view, events, playerId: '0' }}
    >
      {props.children}
    </StateContext.Provider>
  );
};

export function useGameState() {
  return React.useContext(StateContext);
}
