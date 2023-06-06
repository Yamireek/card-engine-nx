import { State, View } from '@card-engine-nx/state';
import React, { useMemo } from 'react';
import {
  advanceToChoiceState,
  consoleEvents,
  createView,
} from '@card-engine-nx/engine';
import { BoardProps, Client } from 'boardgame.io/react';
import { Game, Move } from 'boardgame.io';
import { GameDisplay } from './GameDisplay';

export type LotrLCGMoves = {
  next: () => void;
};

export const StateContext = React.createContext<{
  state: State;
  view: View;
  setState: (newState: State) => void;
  moves: LotrLCGMoves;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}>({} as any);

const next: Move<State> = ({ G, ctx }) => {
  G.choice = undefined;
  advanceToChoiceState(G, consoleEvents, true);
  return G;
};

export const LotrLCGBoard = (props: BoardProps<State>) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <StateProvider state={props.G} moves={props.moves as any}>
      <GameDisplay />
    </StateProvider>
  );
};

export const BoardGameIOContext = (props: { init: State }) => {
  const LotrLCGClient = useMemo(() => {
    const LotrLCGame: Game<State> = {
      setup: () => props.init,
      moves: {
        next,
      },
    };
    return Client({ game: LotrLCGame, board: LotrLCGBoard });
  }, [props.init]);

  return <LotrLCGClient />;
};

export const StateProvider = (
  props: React.PropsWithChildren<{ state: State; moves: LotrLCGMoves }>
) => {
  const view = useMemo(() => createView(props.state), [props.state]);
  return (
    <StateContext.Provider
      value={{
        state: props.state,
        view,
        setState: () => {
          throw new Error('dont use');
        },
        moves: props.moves,
      }}
    >
      {props.children}
    </StateContext.Provider>
  );
};

export function useGameState() {
  return React.useContext(StateContext);
}
