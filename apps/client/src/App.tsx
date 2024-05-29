import { CssBaseline } from '@mui/material';
import { Difficulty } from '@card-engine-nx/basic';
import { core, decks } from '@card-engine-nx/cards';
import { useState } from 'react';
import { DialogProvider } from './DialogsContext';
import { Lobby } from './Lobby';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

export type ConnectionParams = {
  playerID: string;
  matchID: string;
  credentials: string;
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
        <QueryClientProvider client={new QueryClient()}>
          <Lobby />
        </QueryClientProvider>
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
