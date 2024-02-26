import { core } from '@card-engine-nx/cards';
import {
  advanceToChoiceState,
  consoleLogger,
  createView,
  emptyEvents,
} from '@card-engine-nx/engine';
import { createState } from '@card-engine-nx/state';

const state = createState({ players: [{}] });

state.next = [
  {
    addCard: {
      definition: core.hero.gimli,
      zone: { player: '0', type: 'playerArea' },
      side: 'front',
    },
  },
];

advanceToChoiceState(
  state,
  emptyEvents,
  { actions: true, show: true },
  true,
  null as any,
  consoleLogger
);

state.cards[1].token.damage = 1;

console.log(state);
console.log(createView(state));

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
