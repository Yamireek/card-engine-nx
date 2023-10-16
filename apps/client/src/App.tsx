import { CssBaseline } from '@mui/material';
import { Game } from './Game';
import { core } from '@card-engine-nx/cards';
import { coreThree } from './decks/coreThree';

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
      <Game
        players={1}
        playerID={window.location.hash.substring(1)}
        multiplayer={false}
        server="localhost:3000"
        setup={{
          scenario: core.scenario.passageThroughMirkwood,
          players: [coreThree],
          difficulty: 'easy',
          extra: {
            resources: 1,
            cards: 0,
          },
        }}
      />
    </div>
  );
};
