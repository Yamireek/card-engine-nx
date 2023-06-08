import { CssBaseline } from '@mui/material';
import { coreTactics } from './decks/coreTactics';
import { createState } from '@card-engine-nx/state';
import {
  LotrLCGame,
  advanceToChoiceState,
  beginScenario,
  consoleEvents,
  createView,
} from '@card-engine-nx/engine';
import { core } from '@card-engine-nx/cards';
import { DetailProvider } from './DetailContext';
import { LotrLCGBoard, LotrLCGClient } from './bgio/LotrLCGBoard';
import { Lobby } from 'boardgame.io/react';

const state = createState(
  beginScenario(core.scenario.passageThroughMirkwood, coreTactics)
);

advanceToChoiceState(state, consoleEvents, true, true);

const view = createView(state);

console.log(view.actions);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any)['state'] = state;

export const App = () => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        padding: 0,
        margin: 0,
        overflow: 'hidden',
      }}
    >
      <CssBaseline />
      <DetailProvider>
        {/* <Lobby
          gameServer={`http://localhost:3000`}
          lobbyServer={`http://localhost:3000`}
          gameComponents={[{ game: LotrLCGame, board: LotrLCGBoard }]}
        /> */}

        {/* <StateProvider init={state}>
          <GameDisplay />
        </StateProvider> */}
        <LotrLCGClient />
      </DetailProvider>
    </div>
  );
};
