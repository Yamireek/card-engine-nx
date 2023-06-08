import {
  PlayerDeck,
  Scenario,
  State,
  createState,
} from '@card-engine-nx/state';
import type { Game, Move } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import { UIEvents, consoleEvents } from './uiEvents';
import {
  addPlayerCard,
  advanceToChoiceState,
  createPlayerState,
} from './utils';
import { createView } from './view';
import { beginScenario } from './action';
import { ActivePlayers } from 'boardgame.io/core';

function createMoves(events: UIEvents): Record<string, Move<State>> {
  const skip: Move<State> = ({ G }) => {
    G.choice = undefined;
    advanceToChoiceState(G, events, true, false);
  };

  const choose: Move<State> = ({ G }, choosen: number[]) => {
    if (!G.choice) {
      return INVALID_MOVE;
    }

    const options = G.choice.options;
    const choices = choosen.map((index) => options[index]);
    G.choice = undefined;
    G.next.unshift(...choices.map((c) => c.action));
    advanceToChoiceState(G, events, false, false);
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
    advanceToChoiceState(G, events, false, false);
  };

  const selectScenario: Move<State> = ({ G }, scenario: Scenario) => {
    G.next.unshift(beginScenario(scenario));
    advanceToChoiceState(G, events, false, false);
  };

  const selectDeck: Move<State> = ({ G, ctx, playerID }, deck: PlayerDeck) => {
    for (const hero of deck.heroes) {
      addPlayerCard(G, hero, playerID as any, 'front', 'playerArea');
    }

    for (const card of deck.library) {
      addPlayerCard(G, card, playerID as any, 'back', 'library');
    }
  };

  return { skip, choose, action, selectDeck, selectScenario };
}

export function LotrLCGame(events: UIEvents): Game<State> {
  return {
    name: 'LotrLCG',
    setup: ({ ctx }) => {
      const state = createState();
      for (let index = 0; index < ctx.numPlayers; index++) {
        state.players[index] = createPlayerState(index.toString() as any);
      }
      return state;
    },
    minPlayers: 1,
    maxPlayers: 4,
    moves: createMoves(events),
    turn: {
      activePlayers: ActivePlayers.ALL,
    },
  };
}

// export const LotrLCGame: (events: UIEvents) => Game<State> = (events) => {
//   return {
//     name: 'LotrLCG',
//     setup: ({ ctx }) => {
//       const state = createState();
//       for (let index = 0; index < ctx.numPlayers; index++) {
//         state.players[index] = createPlayerState(index.toString() as any);
//       }
//       return state;
//     },
//     minPlayers: 1,
//     maxPlayers: 4,
//     moves: createMoves(events),
//     turn: {
//       activePlayers: ActivePlayers.ALL,
//     },
//   };
// };
