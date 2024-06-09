import { Debug } from 'boardgame.io/debug';
import { Local, SocketIO } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import { randomJS } from '@card-engine-nx/basic';
import { core, decks } from '@card-engine-nx/cards';
import {
  ExeCtx,
  Logger,
  LotrLCGame,
  UIEvents,
  beginScenario,
  nullLogger,
} from '@card-engine-nx/engine';
import { createState } from '@card-engine-nx/state';
import { LoadingDialog } from '@card-engine-nx/ui';
import { NewGameParams, SetupParams } from '../game/types';
import { LotrLCGBoard } from './LotrLCGBoard';

export function LotrLCGClient(
  events: UIEvents,
  setup: SetupParams,
  logger?: Logger
) {
  if (setup.type === 'load') {
    return Client({
      game: LotrLCGame(events, logger, JSON.parse(setup.state)),
      board: LotrLCGBoard,
      numPlayers: 1,
      debug: { collapseOnLoad: true, impl: Debug },
      loading: LoadingDialog,
    });
  }

  if (setup.type === 'join') {
    return Client({
      game: LotrLCGame(events, logger),
      board: LotrLCGBoard,
      numPlayers: 1,
      multiplayer: SocketIO({ server: setup.server }),
      debug: { collapseOnLoad: true, impl: Debug },
      loading: LoadingDialog,
    });
  }

  if (setup.type === 'new') {
    const state = createNewGameState(setup, events);

    return Client({
      game: LotrLCGame(events, logger, state),
      board: LotrLCGBoard,
      numPlayers:
        setup.server && setup.server !== 'local'
          ? Number(setup.playerCount)
          : 1,
      multiplayer:
        setup.server === 'local'
          ? Local({ persist: true })
          : setup.server
          ? SocketIO({ server: setup.server.url })
          : undefined,
      debug: { collapseOnLoad: true, impl: Debug },
      loading: LoadingDialog,
    });
  }

  throw new Error('not implemented');
}

export function createNewGameState(setup: NewGameParams, events: UIEvents) {
  const state = createState();

  state.next = [
    beginScenario({
      players: setup.players
        .filter((p, i) => i < Number(setup.playerCount))
        .map((key) => decks[key]),
      scenario: core.scenario[setup.scenario],
      difficulty: setup.difficulty,
      extra: setup.extra,
    }),
  ];

  const ctx = new ExeCtx(state, events, randomJS(), nullLogger, false);

  ctx.advance({ actions: false, show: false }, true);
  return state;
}
