import {
  advanceToChoiceState,
  beginScenario,
  consoleEvents,
  createView,
} from '@card-engine-nx/engine';
import { State, createState } from '@card-engine-nx/state';
import type { Game, Move } from 'boardgame.io';
import { BoardProps, Client } from 'boardgame.io/react';
import { INVALID_MOVE } from 'boardgame.io/core';
import { GameDisplay } from '../GameDisplay';
import { StateContext } from '../StateContext';
import { useMemo } from 'react';
import './styles.css';
import { coreTactics } from '../decks/coreTactics';
import { core } from '@card-engine-nx/cards/core';

const skip: Move<State> = ({ G }) => {
  G.choice = undefined;
  advanceToChoiceState(G, consoleEvents, true, true);
};

const choose: Move<State> = ({ G }, choosen: number[]) => {
  if (!G.choice) {
    return INVALID_MOVE;
  }

  const options = G.choice.options;
  const choices = choosen.map((index) => options[index]);
  G.choice = undefined;
  G.next.unshift(...choices.map((c) => c.action));
  advanceToChoiceState(G, consoleEvents, false, true);
};

const action: Move<State> = ({ G }, index: number) => {
  if (!G.choice) {
    return INVALID_MOVE;
  }

  const view = createView(G);

  const action = view.actions[index];
  const title = G.choice.title;
  G.choice = undefined;
  G.next.unshift({ playerActions: title });
  G.next.unshift(action.action);
  advanceToChoiceState(G, consoleEvents, false, true);
};

export type LotrLCGProps = BoardProps<State>;

export const LotrLCGBoard = (props: LotrLCGProps) => {
  const view = useMemo(() => createView(props.G), [props.G]);

  return (
    <StateContext.Provider
      value={{
        state: props.G,
        moves: props.moves as any,
        view,
        events: consoleEvents,
      }}
    >
      <GameDisplay />
    </StateContext.Provider>
  );
};

export const LotrLCGame: Game<State> = {
  setup: () => {
    const state = createState(
      beginScenario(core.scenario.passageThroughMirkwood, coreTactics)
    );
    advanceToChoiceState(state, consoleEvents, false, true);
    return state;
  },
  moves: { skip, choose, action },
};

export const LotrLCGClient = Client({
  game: LotrLCGame,
  board: LotrLCGBoard,
  numPlayers: 1,
});
