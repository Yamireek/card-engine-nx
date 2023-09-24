import { PlayerDeck, Scenario, State, View } from '@card-engine-nx/state';
import { PlayerId } from '@card-engine-nx/basic';
import { createContext, useContext } from 'react';

export type Moves = {
  skip: () => void;
  choose: (...choosen: number[]) => void;
  split: (...amounts: number[]) => void;
  action: (index: number) => void;
  selectScenario: (scenario: Scenario) => void;
  selectDeck: (deck: PlayerDeck) => void;
};

export const StateContext = createContext<{
  state: State;
  view: View;
  moves: Moves;
  playerId?: PlayerId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}>({} as any);

export function useGameState() {
  return useContext(StateContext);
}
