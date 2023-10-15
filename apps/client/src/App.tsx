import { CssBaseline } from '@mui/material';
import { Game } from './Game';
import { beginScenario } from '@card-engine-nx/engine';
import { testScenario } from './decks/coreTest';
import { coreThree } from './decks/coreThree';
import { TestEngine } from './tests/TestEngine';
import { GameScene } from './GameScene';
import { reverse } from 'lodash/fp';

const game = new TestEngine({
  players: [],
});

game.do({ addPlayer: coreThree });
game.do(beginScenario(testScenario, 'normal'));

game.skip();
game.chooseAction('Play ally Henamarth Riversong');
game.skip();
game.chooseOptions(['1', '2', '3', '51']);
game.chooseOption(
  "Response: Response: After Théodred commits to a quest, choose a hero committed to that quest. Add 1 resource to that hero's resource pool."
);
game.chooseOption('3');
game.skip();
game.skip();
game.skip();
game.skip();
game.chooseOption('54');
game.chooseOption(
  'Response: After you travel to Old Forest Road the first player may choose and ready 1 character he controls.'
);
game.chooseOption('3');
game.skip();
game.skip();
game.skip();
game.skip();
game.skip();
game.skip();
game.chooseOption('3');
game.skip();
game.skip();
game.skip();
game.skip();
game.chooseAction('Play attachment Steward of Gondor');
game.chooseOption('3');
game.chooseAction(
  "Action: Exhaust Steward of Gondor to add 2 resources to attached hero's resource pool."
);
game.chooseAction('Play ally Gléowine');
game.chooseAction(
  'Action: Exhaust Gléowine to choose a player. That player draws 1 card.'
);
game.chooseAction('Play ally Miner of the Iron Hills');
game.skip();
game.chooseOptions(['1', '2']);
game.chooseOption(
  "Response: Response: After Théodred commits to a quest, choose a hero committed to that quest. Add 1 resource to that hero's resource pool."
);
game.chooseOption('1');
game.skip();
game.skip();
game.skip();
game.skip();
game.skip();
game.skip();
game.skip();
game.skip();
game.skip();
game.chooseOption('3');
game.skip();
game.skip();
game.skip();
game.chooseAction(
  "Action: Exhaust Steward of Gondor to add 2 resources to attached hero's resource pool."
);
game.chooseAction(
  'Action: Exhaust Gléowine to choose a player. That player draws 1 card.'
);
game.skip();
game.chooseAction('Play attachment Dark Knowledge');
game.chooseOption('3');
game.chooseAction('Play ally Guard of the Citadel');
game.skip();
game.chooseOptions(['1', '2']);
game.chooseOption(
  "Response: Response: After Théodred commits to a quest, choose a hero committed to that quest. Add 1 resource to that hero's resource pool."
);
game.chooseOption('1');
game.skip();

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
