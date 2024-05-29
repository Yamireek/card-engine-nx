import { CssBaseline } from '@mui/material';
import { Difficulty, keys } from '@card-engine-nx/basic';
import { core, decks } from '@card-engine-nx/cards';
import { GameSetupDialog } from './GameSetupDialog';
import { useMemo, useState } from 'react';
import { LobbyClient } from 'boardgame.io/client';
import { DialogProvider, useDialogs } from './DialogsContext';
import { Client } from 'boardgame.io/react';
import {
  LotrLCGame,
  ObservableContext,
  beginScenario,
  consoleLogger,
  emptyEvents,
  nullLogger,
} from '@card-engine-nx/engine';
import { LotrLCGBoard, rndJS } from './bgio/LotrLCGBoard';
import { rxEvents } from './GameDisplay';
import { Debug } from 'boardgame.io/debug';
import { createState } from '@card-engine-nx/state';
import { SocketIO } from 'boardgame.io/multiplayer';

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type NewGameParams = {
  type: 'new';
  server?: 'local' | { url: string };
  playerCount: '1' | '2' | '3' | '4';
  players: Array<keyof typeof decks>;
  scenario: keyof typeof core.scenario;
  difficulty: Difficulty;
  extra: {
    resources: number;
    cards: number;
  };
};

export type LoadGameParams = {
  type: 'load';
  state: string;
};

export type JoinGameParams = {
  type: 'join';
  server: {
    url: string;
    playerId: '0' | '1' | '2' | '3';
  };
};

export type SetupParams = NewGameParams | LoadGameParams | JoinGameParams;

const savedState = localStorage.getItem('saved_state');

export const Lobby = () => {
  const lobby = useMemo(
    () => new LobbyClient({ server: 'http://localhost:3000' }),
    []
  );

  const d = useDialogs();

  const GameClient = Client({
    game: LotrLCGame(rxEvents, consoleLogger),
    board: LotrLCGBoard,
    numPlayers: 1,
    debug: { collapseOnLoad: true, impl: Debug },
    multiplayer: SocketIO({ server: 'http://localhost:3000' }),
  });

  const [connection, setConnection] = useState<
    | {
        playerID: string;
        matchID: string;
        credentials: string;
      }
    | undefined
  >();

  return (
    <>
      lobby
      <button
        onClick={async () => {
          const params = await d.open({
            component: GameSetupDialog,
            action: async (r) => r,
          });

          const matchId = await createMatch(params, lobby);

          await delay(1000);

          const credentials = await lobby.joinMatch('LotrLCG', matchId, {
            playerName: 'player',
          });

          setConnection({
            playerID: credentials.playerID,
            matchID: matchId,
            credentials: credentials.playerCredentials,
          });
        }}
      >
        Create match
      </button>
      {connection && (
        <GameClient
          playerID={connection.playerID}
          matchID={connection.matchID}
          credentials={connection.credentials}
        />
      )}
    </>
  );
};

export const App = () => {
  const [setup, setSetup] = useState<SetupParams | undefined>(
    savedState ? { type: 'load', state: savedState } : undefined
  );

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        padding: 0,
        margin: 0,
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <CssBaseline />
      <DialogProvider>
        <Lobby />
        {/* {!setup && <GameSetupDialog onSubmit={setSetup} />}
      {setup && (
        <SnackbarProvider>
          <Game setup={setup} />
        </SnackbarProvider>
      )} */}
      </DialogProvider>
    </div>
  );
};
async function createMatch(setup: SetupParams, lobby: LobbyClient) {
  if (setup.type === 'join') {
    throw new Error('invalid params');
  }

  if (setup.type === 'load') {
    const state = JSON.parse(setup.state);
    const response = await lobby.createMatch('LotrLCG', {
      numPlayers: keys(state.players).length,
      setupData: setup,
    });
    return response.matchID;
  }

  if (setup.type === 'new') {
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

    const ctx = new ObservableContext(
      state,
      emptyEvents,
      rndJS(),
      nullLogger,
      false
    );

    ctx.advance({ actions: false, show: false }, true);

    const response = await lobby.createMatch('LotrLCG', {
      numPlayers: Number(setup.playerCount),
      setupData: state,
    });
    return response.matchID;
  }

  throw new Error('invalid params');
}
