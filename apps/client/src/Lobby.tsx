import { GameSetupDialog } from './GameSetupDialog';
import { useMemo, useState } from 'react';
import { LobbyClient } from 'boardgame.io/client';
import { useDialogs } from './DialogsContext';
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
import { SocketIO } from 'boardgame.io/multiplayer';
import { ConnectionParams, SetupParams, delay } from './App';
import { useQuery } from '@tanstack/react-query';
import { createState } from '@card-engine-nx/state';
import { core, decks } from '@card-engine-nx/cards';
import { keys } from '@card-engine-nx/basic';

const GAME_NAME = 'LotrLCG';

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

  const [connection, setConnection] = useState<ConnectionParams | undefined>();

  const matchesQ = useQuery({
    queryKey: ['matches'],
    queryFn: () => lobby.listMatches(GAME_NAME),
  });

  if (matchesQ.isPending) {
    return <>loading...</>;
  }

  if (matchesQ.isError) {
    return <>error...</>;
  }

  console.log(matchesQ.data.matches);

  return (
    <>
      matches:
      <ul>
        {matchesQ.data.matches.map((m) => (
          <li key={m.matchID}>
            {m.setupData.name}
            {m.players.some((p) => !p.name) && (
              <button
                onClick={async () => {
                  const result = await lobby.joinMatch(GAME_NAME, m.matchID, {
                    playerName: 'player',
                  });

                  setConnection({
                    playerID: result.playerID,
                    matchID: m.matchID,
                    credentials: result.playerCredentials,
                  });
                }}
              >
                join
              </button>
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={async () => {
          const params = await d.open({
            component: GameSetupDialog,
            action: async (r) => r,
          });

          const matchId = await createMatch(params, lobby);

          await delay(1000);

          const credentials = await lobby.joinMatch(GAME_NAME, matchId, {
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

export async function createMatch(setup: SetupParams, lobby: LobbyClient) {
  if (setup.type === 'join') {
    throw new Error('invalid params');
  }

  if (setup.type === 'load') {
    const state = JSON.parse(setup.state);
    const response = await lobby.createMatch(GAME_NAME, {
      numPlayers: keys(state.players).length,
      setupData: setup,
    });
    return response.matchID;
  }

  if (setup.type === 'new') {
    const state = createState();

    const data = {
      players: setup.players
        .filter((p, i) => i < Number(setup.playerCount))
        .map((key) => decks[key]),
      scenario: core.scenario[setup.scenario],
      difficulty: setup.difficulty,
      extra: setup.extra,
    };

    state.next = [beginScenario(data)];

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
      setupData: {
        name: `${data.scenario.name} - ${data.players
          .flatMap((p) => p.heroes.map((h) => h.front.name))
          .join(', ')}`,
        state,
      },
    });
    return response.matchID;
  }

  throw new Error('invalid params');
}
