import { Action, PlayerDeck, Scenario, State } from '@card-engine-nx/state';
import { Difficulty, PlayerId } from '@card-engine-nx/basic';
import { createContext, useContext } from 'react';

export type Moves = {
  skip: () => void;
  choose: (...choosen: number[]) => void;
  split: (...amounts: number[]) => void;
  action: (index: number) => void;
  selectScenario: (scenario: Scenario, difficulty: Difficulty) => void;
  selectDeck: (deck: PlayerDeck) => void;
  load: (state: State) => void;
  json: (action: Action) => void;
};

export const StateContext = createContext<{
  state: State;
  moves: Moves;
  playerId?: PlayerId;
  undo: () => void;
  redo: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}>({} as any);

export function useGameState() {
  return useContext(StateContext);
}
