import { CssBaseline } from '@mui/material';
import { Game } from './Game';
import { beginScenario } from '@card-engine-nx/engine';
import { testScenario } from './decks/coreTest';
import { coreThree } from './decks/coreThree';
import { TestEngine } from './tests/TestEngine';

const game = new TestEngine({
  players: [],
});

game.do({ addPlayer: coreThree });
game.do(beginScenario(testScenario, 'normal'));

console.log(game.state);

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
        initState={game.state}
      />
    </div>
  );
};
