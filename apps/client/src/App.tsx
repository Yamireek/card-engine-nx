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
game.chooseSkip();
game.chooseAction('Play ally Henamarth Riversong');
game.chooseSkip();
game.chooseOptions(['1', '2', '3', '51']);
game.chooseSkip();
game.chooseSkip();
game.chooseSkip();
game.chooseSkip();
game.chooseOption('54');
game.chooseOption(
  'Response: After you travel to Old Forest Road the first player may choose and ready 1 character he controls.'
);
game.chooseOption('3');
game.chooseSkip();
game.chooseSkip();
game.chooseSkip();
game.chooseSkip();
game.chooseSkip();
game.chooseSkip();
game.chooseOption('3');
game.chooseSkip();
game.chooseSkip();
game.chooseSkip();
game.chooseSkip();
game.chooseAction('Play attachment Steward of Gondor');
game.chooseOption('3');
game.chooseAction(
  "Action: Exhaust Steward of Gondor to add 2 resources to attached hero's resource pool."
);
game.chooseAction('Play ally Gléowine');
game.chooseAction(
  'Action: Exhaust Gléowine to choose a player. That player draws 1 card.'
);

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
