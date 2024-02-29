import { Action, State, createState } from '@card-engine-nx/state';
import type { Game, Move } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import { UIEvents } from '../events/uiEvents';
import { createView } from '../view';
import { beginScenario } from '../round/beginScenario';
import { ActivePlayers } from 'boardgame.io/core';
import { PowerSet } from 'js-combinatorics';
import { randomBgIO } from '../utils/random';
import { GameSetupData } from '../GameSetupData';
import { Logger } from '../logger/types';
import { consoleLogger } from '../logger/console';
import { toJS } from 'mobx';
import { ObservableContext } from '../context';

const skipOptions = { actions: false, show: false };

function createMoves(
  events: UIEvents,
  logger: Logger
): Record<string, Move<State>> {
  const skip: Move<State> = ({ G, random }) => {
    const ctx = new ObservableContext(G, events, randomBgIO(random), logger);
    ctx.state.choice = undefined;
    ctx.advance(skipOptions, false);
    return toJS(ctx.state);
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

    const ctx = new ObservableContext(G, events, randomBgIO(random), logger);
    const options = G.choice.options;
    const choices = choosen.map((index) => options[index]);
    ctx.state.choice = undefined;
    ctx.state.next.unshift(...choices.map((c) => c.action));
    ctx.advance(skipOptions, false);
    return toJS(ctx.state);
  };

  const json: Move<State> = ({ G, random }, action: Action) => {
    const ctx = new ObservableContext(G, events, randomBgIO(random), logger);

    const choice = ctx.state.choice;
    const next = ctx.state.next;

    ctx.state.choice = undefined;
    ctx.state.next = [action];

    ctx.advance(skipOptions, false);

    if (!ctx.state.choice) {
      ctx.state.choice = choice;
    }

    ctx.state.next = next;

    return toJS(ctx.state);
  };

  const split: Move<State> = ({ G, random }, ...amounts: number[]) => {
    const ctx = new ObservableContext(G, events, randomBgIO(random), logger);

    if (
      !ctx.state.choice ||
      (ctx.state.choice.type !== 'split' && ctx.state.choice.type !== 'X')
    ) {
      return INVALID_MOVE;
    }

    if (ctx.state.choice.type === 'X') {
      const action: Action = {
        useScope: { x: amounts[0] },
        action: ctx.state.choice.action,
      };
      ctx.state.choice = undefined;
      ctx.state.next.unshift(action);
    } else {
      const options = ctx.state.choice.options;
      ctx.state.choice = undefined;
      ctx.state.next.unshift(
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

    ctx.advance(skipOptions, false);
    return toJS(ctx.state);
  };

  const action: Move<State> = ({ G, random }, index: number) => {
    if (!G.choice) {
      return INVALID_MOVE;
    }

    const title = 'title' in G.choice ? G.choice.title : '';
    const ctx = new ObservableContext(G, events, randomBgIO(random), logger);
    const action = ctx.view.actions[index];
    ctx.state.choice = undefined;
    ctx.state.next.unshift({ playerActions: title });
    ctx.state.next.unshift(action.action);
    ctx.advance(skipOptions, false);
    return toJS(ctx.state);
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
    moves: createMoves(events, consoleLogger),
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
