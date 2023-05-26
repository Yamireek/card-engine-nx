import {
  Board,
  CardDisplay,
  createBoardModel,
  getCardImageUrl,
  image,
  rotate,
  scale,
  transform,
  translate,
} from '@card-engine-nx/ui';
import { CssBaseline } from '@mui/material';
import { PropsWithChildren, useMemo } from 'react';
import { GameEngine, advanceToChoiceState } from './tests/GameEngine';
import { coreTactics } from './decks/coreTactics';
import { addCard } from './tests/addPlayer';
import { executeAction } from '@card-engine-nx/engine';
import {
  CardModel,
  DeckModel,
  Dimensions,
  FloatingCardModel,
  Point3D,
  ZoneModel,
  cardSize,
} from '@card-engine-nx/store';
import { BoardCamera } from '../libs/ui/src/lib/3d/BoardCamera';
import { Deck3D } from 'libs/ui/src/lib/3d/Deck3D';
import { playerBack } from 'libs/ui/src/images';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const drawerWidth = 430;

export const Location3D = (
  props: PropsWithChildren<{
    position: Point3D;
    rotation: Point3D;
  }>
) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        transition: 'transform 1s',
        transformStyle: 'preserve-3d',
        transform: transform(
          translate(props.position.x, props.position.y, props.position.z),
          rotate(props.rotation.x, props.rotation.y, props.rotation.z)
        ),
      }}
    >
      {props.children}
    </div>
  );
};

export const Playmat = (props: { size: Dimensions; image: string }) => {
  return (
    <Location3D
      position={{ x: -props.size.width / 2, y: -props.size.height / 2, z: 0 }}
      rotation={{ x: 0, y: 0, z: 0 }}
    >
      <img style={{ ...props.size }} src={props.image} alt="" />
    </Location3D>
  );
};

export const App = () => {
  const result = useMemo(() => {
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

    window['state'] = engine.state;

    return { board: createBoardModel(engine.state), engine };
  }, []);

  const board = result.board;

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

      <BoardCamera angle={45} rotation={0}>
        <Playmat
          image={image.board}
          size={{ width: 1608 * 3, height: 1620 * 3 }}
        />
        <Location3D
          position={{ x: 200, y: 200, z: 200 }}
          rotation={{ x: 0, y: 0, z: 45 }}
        >
          <CardDisplay
            scale={1}
            image="https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Gloin.jpg"
            orientation="portrait"
          />
        </Location3D>
        <Location3D
          position={{ x: 0, y: 0, z: 0 }}
          rotation={{ x: 0, y: 0, z: -10 }}
        >
          <Deck3D
            id="1"
            cards={60}
            image={playerBack}
            orientation="portrait"
            position={{ x: 0, y: 0 }}
          />
        </Location3D>
      </BoardCamera>

      {/* <Board
        perspective={1000}
        rotate={0}
        width={1608 * 3}
        height={1620 * 3}
        model={result.board}
      /> */}

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
