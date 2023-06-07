import { CssBaseline } from '@mui/material';
import { coreTactics } from './decks/coreTactics';
import { GameDisplay } from './GameDisplay';
import { StateProvider } from './StateContext';
import { createState } from '@card-engine-nx/state';
import {
  advanceToChoiceState,
  beginScenario,
  consoleEvents,
  createView,
} from '@card-engine-nx/engine';
import { core } from '@card-engine-nx/cards/core';
import { DetailProvider } from './DetailContext';

const state = createState(
  beginScenario(core.scenario.passageThroughMirkwood, coreTactics)
);

advanceToChoiceState(state, consoleEvents, false, true);

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

      <StateProvider init={state}>
        <DetailProvider>
          <GameDisplay />
        </DetailProvider>
      </StateProvider>
    </div>
  );
};
