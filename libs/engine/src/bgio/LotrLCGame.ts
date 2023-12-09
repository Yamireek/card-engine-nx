import { Action, State, createState } from '@card-engine-nx/state';
import type { Game, Move } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import { UIEvents } from '../events/uiEvents';
import { advanceToChoiceState } from '../utils';
import { createView } from '../view';
import { beginScenario } from '../round/beginScenario';
import { ActivePlayers } from 'boardgame.io/core';
import { PowerSet } from 'js-combinatorics';
import { randomBgIO } from '../utils/random';
import { GameSetupData } from '../GameSetupData';

const skipOptions = { actions: false, show: false };

function createMoves(events: UIEvents): Record<string, Move<State>> {
  const skip: Move<State> = ({ G, random }) => {
    G.choice = undefined;
    advanceToChoiceState(G, events, skipOptions, false, randomBgIO(random));
  };

  const load: Move<State> = (_, state: State) => {
    return state;
  };

  const choose: Move<State> = ({ G, random }, ...choosen: number[]) => {
    if (!G.choice) {
      return INVALID_MOVE;
    }

    if (G.choice.type === 'actions') {
      return INVALID_MOVE;
    }

    if (G.choice.type === 'show') {
      return INVALID_MOVE;
    }

    if (G.choice.type === 'X') {
      return INVALID_MOVE;
    }

    const options = G.choice.options;
    const choices = choosen.map((index) => options[index]);
    G.choice = undefined;
    G.next.unshift(...choices.map((c) => c.action));
    advanceToChoiceState(G, events, skipOptions, false, randomBgIO(random));
  };

  const json: Move<State> = ({ G, random }, action: Action) => {
    const choice = G.choice;
    const next = G.next;

    G.choice = undefined;
    G.next = [action];

    advanceToChoiceState(G, events, skipOptions, false, randomBgIO(random));

    if (!G.choice) {
      G.choice = choice;
    }

    G.next = next;
  };

  const split: Move<State> = ({ G, random }, ...amounts: number[]) => {
    if (!G.choice || (G.choice.type !== 'split' && G.choice.type !== 'X')) {
      return INVALID_MOVE;
    }

    if (G.choice.type === 'X') {
      const action: Action = {
        useScope: { x: amounts[0] },
        action: G.choice.action,
      };
      G.choice = undefined;
      G.next.unshift(action);
    } else {
      const options = G.choice.options;
      G.choice = undefined;
      G.next.unshift(
        ...options.flatMap((o, i) => {
          const amount = amounts[i];
          if (amount > 0) {
            return [
              {
                repeat: {
                  amount,
                  action: o.action,
                },
              },
            ];
          } else {
            return [];
          }
        })
      );
    }

    advanceToChoiceState(G, events, skipOptions, false, randomBgIO(random));
  };

  const action: Move<State> = ({ G, random }, index: number) => {
    if (!G.choice) {
      return INVALID_MOVE;
    }

    const view = createView(G);
    const action = view.actions[index];
    const title = 'title' in G.choice ? G.choice.title : '';
    G.choice = undefined;
    G.next.unshift({ playerActions: title });
    G.next.unshift(action.action);
    advanceToChoiceState(G, events, skipOptions, false, randomBgIO(random));
  };

  return {
    skip,
    choose,
    split,
    action,
    load,
    json,
  };
}

export function LotrLCGame(
  events: UIEvents,
  setupClient?: GameSetupData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Game<State, any, GameSetupData | { state: State }> {
  return {
    name: 'LotrLCG',
    setup: (_, setupServer) => {
      const setup = setupServer ?? setupClient;

      if (!setup) {
        throw new Error('missing setupData');
      }

      if ('state' in setup) {
        return setup.state;
      }

      const state = createState();
      state.choice = {
        id: 0,
        player: '0',
        title: '',
        type: 'single',
        options: [
          {
            title: 'START',
            action: {},
          },
        ],
        optional: false,
      };
      state.next = [beginScenario(setup)];

      return state;
    },
    minPlayers: 1,
    maxPlayers: 4,
    moves: createMoves(events),
    turn: {
      activePlayers: ActivePlayers.ALL,
    },
    endIf: ({ G }) => {
      if (G.result?.win) {
        return {
          score: 100 / G.result.score,
          winner: '0',
        };
      }

      return G.result;
    },
    ai: {
      enumerate: (G) => {
        const choice = G.choice;
        if (!choice) {
          return [];
        }

        if (choice.type === 'actions') {
          const view = createView(G);
          return [
            { move: 'skip' },
            ...view.actions
              .filter((a) => a.enabled)
              .map((_, i) => ({ move: 'action', args: [i] })),
          ];
        }

        if (choice.type === 'multi') {
          const sets = new PowerSet(choice.options.map((o, i) => i));
          const array = sets.toArray();
          return array.map((a) => ({
            move: 'choose',
            args: a,
          }));
        }

        if (choice.type === 'single') {
          if (choice.optional) {
            return [
              { move: 'skip' },
              ...choice.options.map((o, i) => ({ move: 'choose', args: [i] })),
            ];
          } else {
            return choice.options.map((o, i) => ({
              move: 'choose',
              args: [i],
            }));
          }
        }

        if (choice.type === 'show') {
          return [{ move: 'skip' }];
        }

        if (choice.type === 'split') {
          return [{ move: 'split', args: choice.options.map(() => 1) }]; // TODO real split
        }

        return [];
      },
    },
  };
}