import { State } from '@card-engine-nx/state';
import {
  image,
  CardDisplay,
  NextStepButton,
  createBoardModel,
  transform,
  translate,
} from '@card-engine-nx/ui';
import { playerBack } from 'libs/ui/src/images';
import { BoardCamera } from 'libs/ui/src/lib/3d/BoardCamera';
import { Deck3D } from 'libs/ui/src/lib/3d/Deck3D';
import { Playmat, Location3D } from './app';
import React, { useContext, useMemo } from 'react';
import { StateContext, StateProvider } from './StateContext';
import { Observer } from 'mobx-react';
import { Card3D } from 'libs/ui/src/lib/3d/Card3D';

const boardSize = { width: 1608 * 4, height: 1620 * 4 };
const offset = { x: -boardSize.width / 2, y: -boardSize.height / 2 };

export const GameDisplay = () => {
  const { state, setState } = useContext(StateContext);

  const board = useMemo(() => {
    return createBoardModel(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BoardCamera angle={45} rotation={0}>
        <Playmat image={image.board} size={boardSize} />
        <Observer>
          {() => (
            <>
              {board.zones.map((z) => (
                <Location3D
                  key={z.id}
                  position={{
                    x: z.location.x + offset.x,
                    y: z.location.y + offset.y,
                    z: 0,
                  }}
                  rotation={{ x: 0, y: 0, z: 0 }}
                >
                  <div
                    key={z.id}
                    style={{
                      backgroundColor: z.color,
                      opacity: 0.1,
                      width: z.size.width,
                      height: z.size.height,
                    }}
                  />
                </Location3D>
              ))}

              {board.allCards.map((d) => (
                <Card3D
                  key={d.id}
                  id={d.id}
                  image={d.images}
                  orientation={d.orientation}
                  position={{
                    x: d.position.x + offset.x,
                    y: d.position.y + offset.y,
                    z: 0,
                  }}
                  rotation={d.rotation}
                  scale={d.scale}
                  // transform={transform(
                  //   translate(-215, -300, 0),
                  //   translate(-offset.x, -offset.y, offset.z - perspective),
                  //   rotateX(-rotate),
                  //   translate(215, 300, 0)
                  // )}
                />
              ))}

              {board.decks.map((d) => (
                <Deck3D
                  key={d.id}
                  id={d.id}
                  image={d.image}
                  orientation={d.orientation}
                  position={{
                    x: d.position.x + offset.x,
                    y: d.position.y + offset.y,
                  }}
                  cards={d.cards}
                />
              ))}
            </>
          )}
        </Observer>
      </BoardCamera>
      <NextStepButton
        title="Next step"
        onClick={() => {
            
          console.log('next');
        }}
      />
    </>
  );
};
