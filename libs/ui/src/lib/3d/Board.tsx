import { useMemo, useState } from 'react';
import { Point3D } from '../../../../store/src/types';
import { Deck3D, Deck3DProps } from './Deck3D';
import { Card3D, Card3DProps } from './Card3D';
import { cardImages } from './../storybook/cardImages';
import boardImage from './../../images/board.jpg';
import {
  BoardModel,
  CardModel,
  DeckModel,
  FloatingCardModel,
  ZoneModel,
} from '@card-engine-nx/store';
import { transform, translate } from './utils';
import { Observer } from 'mobx-react';
import { playerBack } from './../../images';
import { cardSize, createBoardModel } from 'libs/store/src/utils';
import { last } from 'lodash';
import { createState } from '@card-engine-nx/state';

export const Board = (props: {
  perspective: number;
  rotate: number;
  width: number;
  height: number;
  imageUrl?: string;
  model: BoardModel;
}) => {
  const perspective = props.perspective;
  const rotate = props.rotate;
  const board = props.model;

  const [offset, setTranslate] = useState<Point3D>({
    x: -560,
    y: -290,
    z: perspective,
  });

  console.log(offset);

  // const board = useMemo(
  //   () =>
  //     new BoardModel({
  //       height: props.height,
  //       width: props.width,
  //       zones: [
  //         new ZoneModel({
  //           cards: Array.from(Array(5).keys()).map(
  //             (i) =>
  //               new CardModel({
  //                 id: i.toString(),
  //                 images: {
  //                   front: cardImages[0],
  //                   back: cardImages[1],
  //                 },
  //                 orientation: "portrait",
  //                 rotation: {
  //                   x: 0,
  //                   y: 0,
  //                   z: 0,
  //                 },
  //                 attachments: [],
  //               })
  //           ),
  //           location: { x: 0, y: 0 },
  //           size: { width: 1000, height: 1000 },
  //           orientation: "portrait",
  //         }),
  //         new ZoneModel({
  //           cards: [],
  //           location: { x: 1100, y: 0 },
  //           size: { width: 1000, height: 1000 },
  //           orientation: "portrait",
  //         }),
  //       ],
  //       decks: [
  //         new DeckModel({
  //           cards: 60,
  //           image: playerBack,
  //           orientation: "portrait",
  //           position: {
  //             x: 2000,
  //             y: 0,
  //           },
  //         }),
  //       ],
  //       cards: [],
  //     }),
  //   [props.height, props.width]
  // );

  const moveOffset = (perspective - offset.z) / perspective;

  return (
    <div
      id="viewport"
      style={{
        transformStyle: 'preserve-3d',
        boxSizing: 'border-box',
        width: '100%',
        height: '100%',
        perspective,
        overflow: 'hidden',
        userSelect: 'none',
        outline: 'none',
      }}
      tabIndex={0}
      draggable={false}
      onMouseMove={(event) => {
        if (event.buttons) {
          event.preventDefault();
          setTranslate((p) => ({
            ...p,
            x: p.x + event.movementX * 5,
            y: p.y + event.movementY * 5,
          }));
        }
      }}
      onWheel={(event) => {
        if (event.deltaY > 0) {
          setTranslate((p) => ({
            ...p,
            z: p.z * 1.1,
          }));
        }

        if (event.deltaY < 0) {
          setTranslate((p) => ({
            ...p,
            z: p.z * 0.9,
          }));
        }
      }}
      onKeyDown={(event) => {
        switch (event.key) {
          case 'w':
            setTranslate((p) => ({ ...p, x: p.x, y: p.y - moveOffset * 10 }));
            break;
          case 's':
            setTranslate((p) => ({ ...p, x: p.x, y: p.y + moveOffset * 10 }));
            break;
          case 'a':
            setTranslate((p) => ({ ...p, x: p.x - moveOffset * 10, y: p.y }));
            break;
          case 'd':
            setTranslate((p) => ({ ...p, x: p.x + moveOffset * 10, y: p.y }));
            break;
        }
      }}
    >
      <button
        onClick={() => {
          board.update(() => {
            const card = board.zones[0].cards.shift();
            if (card) {
              board.zones[1].cards.push(card);
            }
          });
        }}
      >
        Move card
      </button>

      <button
        onClick={() => {
          board.update(() => {
            board.cards.push(
              new FloatingCardModel({
                images: { front: cardImages[0], back: playerBack },
                orientation: 'portrait',
                position: { x: 2000, y: 0, z: 60 * 4 },
                rotation: { x: 0, y: 180, z: 0 },
                scale: 1,
              })
            );
          });

          setTimeout(() => {
            board.update(() => {
              const card = last(board.cards);
              if (card) {
                card.position = {
                  ...card.position,
                  z: card.position.z + cardSize.width / 2,
                };
              }
            });
          }, 0);

          setTimeout(() => {
            board.update(() => {
              const card = last(board.cards);
              if (card) {
                card.rotation = { x: 0, y: 0, z: 0 };
              }
            });
          }, 500);

          setTimeout(() => {
            board.update(() => {
              const card = board.cards.pop();
              if (card) {
                board.zones[0].cards.push(
                  new CardModel({
                    id: card.id,
                    attachments: [],
                    images: { ...card.images },
                    orientation: card.orientation,
                    rotation: { x: 0, y: 0, z: 0 },
                  })
                );
              }
            });
          }, 1000);
        }}
      >
        Draw card
      </button>
      <div
        id="scene"
        style={{
          width: props.width,
          height: props.height,
          transformOrigin: 'top left',
          transform: `
            rotateX(${rotate}deg)
            translate3d(${offset.x}px, ${offset.y}px, ${-(
            offset.z - perspective
          )}px)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
          src={props.imageUrl ?? boardImage}
          alt=""
        />

        <Observer>
          {() => (
            <>
              {board.zones.map((z) => (
                <div
                  key={z.id}
                  style={{
                    position: 'absolute',
                    backgroundColor: z.color,
                    opacity: 0.1,
                    width: z.size.width,
                    height: z.size.height,
                    transform: transform(
                      translate(z.location.x, z.location.y, 0)
                    ),
                  }}
                />
              ))}

              {board.allCards.map((d) => (
                <Card3D
                  key={d.id}
                  id={d.id}
                  image={d.images}
                  orientation={d.orientation}
                  position={d.position}
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
                  position={d.position}
                  cards={d.cards}
                />
              ))}
            </>
          )}
        </Observer>
      </div>
    </div>
  );
};
