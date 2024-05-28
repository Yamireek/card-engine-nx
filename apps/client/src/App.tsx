import { CssBaseline } from '@mui/material';
import { Game } from './Game';
import { useState } from 'react';
import { GameSetupData } from '@card-engine-nx/engine';
import { GameSetupDialog } from './GameSetupDialog';
import { SnackbarProvider } from 'notistack';

const savedState = localStorage.getItem('saved_state');

export const App = () => {
  const [setup, setSetup] = useState<GameSetupData | undefined>();

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

      {!setup && !savedState && <GameSetupDialog onSubmit={setSetup} />}

      {(setup || savedState) && (
        <SnackbarProvider>
          <Game
            players={1}
            playerID={window.location.hash.substring(1)}
            multiplayer={false}
            server="localhost:3000"
            setup={
              savedState
                ? { type: 'state', state: JSON.parse(savedState) }
                : setup
            }
          />
        </SnackbarProvider>
      )}
    </div>
  );
};
