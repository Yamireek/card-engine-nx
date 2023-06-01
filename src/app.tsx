import { CssBaseline } from '@mui/material';
import { GameEngine } from './tests/GameEngine';
import { coreTactics } from './decks/coreTactics';
import { addCard } from './tests/addPlayer';
import { GameDisplay } from './GameDisplay';
import { StateProvider } from './StateContext';

const engine = new GameEngine();
engine.addPlayer();

for (const hero of coreTactics.heroes) {
  engine.addHero(hero);
}

for (const card of coreTactics.library) {
  addCard(card, 'back', { type: 'library', owner: 'A' }).execute(engine.state);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any)['state'] = engine.state;

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

      <StateProvider init={engine.state}>
        <GameDisplay />
      </StateProvider>
    </div>
  );
};
