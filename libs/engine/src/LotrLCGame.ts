import { State, createState } from '@card-engine-nx/state';
import type { Game, Move } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import { consoleEvents } from './uiEvents';
import { advanceToChoiceState } from './utils';
import { createView } from './view';

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

export const LotrLCGame: Game<State> = {
  name: 'LotrLCG',
  setup: () => {
    const state = createState();
    advanceToChoiceState(state, consoleEvents, false, true);
    return state;
  },
  moves: { skip, choose, action },
};
