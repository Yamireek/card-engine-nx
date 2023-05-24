import { createState, hero } from '@card-engine-nx/state';
import { Board, CardDisplay, NextStepButton } from '@card-engine-nx/ui';
import { CssBaseline } from '@mui/material';
import { createBoardModel } from 'libs/store/src/utils';
import { HandLayout } from 'libs/ui/src/lib/HandLayout';
import { useMemo } from 'react';
import { core } from '@card-engine-nx/cards/core';
import { GameEngine } from './tests/GameEngine';
import { coreTactics } from './decks/coreTactics';
import { addCard } from './tests/addPlayer';

const drawerWidth = 430;

export const App = () => {
  const board = useMemo(() => {
    const engine = new GameEngine();
    engine.addPlayer();

    for (const hero of coreTactics.heroes) {
      engine.addHero(hero);
    }

    for (const card of coreTactics.library) {
      addCard(card, 'back', { type: 'library', owner: 'A' }).execute(
        engine.state
      );
    }

    return createBoardModel(engine.state);
  }, []);

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

      <Board
        perspective={1000}
        rotate={0}
        width={1608 * 3}
        height={1620 * 3}
        model={board}
      />

      {/* <div style={{ position: 'absolute', top: 0 }}>
        <CardDisplay
          height={600}
          image={cardImages[0]}
          orientation="portrait"
        />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: -100,
          width: '100%',
        }}
      >
        <HandLayout cardImages={cardImages} cardWidth={200} rotate={2} />
      </div>

      */}
      {/* <NextStepButton
        title="Next step"
        onClick={() => {
          console.log('next');
        }}
      /> */}
    </div>
  );
};
