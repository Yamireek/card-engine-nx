import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

/*import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from './App';
import { createState } from '@card-engine-nx/state';
import {
  addPlayerCard,
  advanceToChoiceState,
  createView,
  emptyEvents,
  gameRound,
  randomJS,
} from '@card-engine-nx/engine';
import { coreLeadershipSpirit } from './decks/coreLeadershipSpirit';
import { passageThroughMirkwood } from 'libs/cards/src/scenarios';

const state = createState();
state.next = [
  { addPlayer: coreLeadershipSpirit },
  {
    setupScenario: {
      scenario: passageThroughMirkwood,
      difficulty: 'easy',
    },
  },
  gameRound(),
];

advanceToChoiceState(
  state,
  emptyEvents,
  { actions: true, show: true },
  true,
  randomJS()
);

console.log(state, createView(state));
*/
