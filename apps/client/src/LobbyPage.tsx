import { GameSetupDialog } from './GameSetupDialog';
import { useMemo } from 'react';
import { LobbyClient } from 'boardgame.io/client';
import { useDialogs } from './DialogsContext';
import {
  ObservableContext,
  beginScenario,
  emptyEvents,
  nullLogger,
} from '@card-engine-nx/engine';
import { rndJS } from './bgio/LotrLCGBoard';
import { SetupParams } from './App';
import { createState } from '@card-engine-nx/state';
import { core, decks } from '@card-engine-nx/cards';
import { keys } from '@card-engine-nx/basic';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from '@mui/material';
import { Matches } from './Matches';

export const GAME_NAME = 'LotrLCG';

export const SERVER_URL =
  window.location.origin === 'http://localhost:4200'
    ? 'http://localhost:3000'
    : 'https://card-engine-server.onrender.com';

export const LobbyPage = () => {
  const lobby = useMemo(() => new LobbyClient({ server: SERVER_URL }), []);
  const navigate = useNavigate();
  const d = useDialogs();

  return (
    <Dialog open fullWidth>
      <DialogTitle>Game Lobby</DialogTitle>
      <Divider />
      <DialogContent>
        <Matches lobby={lobby} />
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={() => navigate('/')}>back</Button>
        <Button
          variant="contained"
          onClick={async () => {
            const params = await d.open({
              component: GameSetupDialog,
              action: async (r) => r,
            });

            const matchId = await createMatch(params, lobby);

            const credentials = await lobby.joinMatch(GAME_NAME, matchId, {
              playerName: 'player',
            });

            const state: SetupParams = {
              type: 'join',
              playerID: credentials.playerID,
              matchID: matchId,
              credentials: credentials.playerCredentials,
              server: SERVER_URL,
            };

            navigate('/game', { state });
          }}
        >
          Start new game
        </Button>
      </DialogActions>
    </Dialog>
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
