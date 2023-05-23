import { useState } from 'react';
import { Point3D } from './types';
import { Deck3D, Deck3DProps } from './Deck3D';
import { Card3D, Card3DProps } from './Card3D';
import { cardImages } from './../storybook/cardImages';
import boardImage from './../../images/board.jpg';
import { rotateX, rotateZ, transform, translate } from './utils';

export const Board = (props: {
  perspective: number;
  rotate: number;
  width: number;
  height: number;
  imageUrl?: string;
}) => {
  const perspective = props.perspective;
  const rotate = props.rotate;

  const [offset, setTranslate] = useState<Point3D>({
    x: -0,
    y: -0,
    z: 500,
  });

  console.log(offset);

  const moveOffset = (perspective - offset.z) / perspective;

  const cardData: Card3DProps[] = Array.from(Array(5).keys()).map((i) => ({
    id: i,
    image: {
      front: cardImages[0],
      back: cardImages[1],
    },
    orientation: 'portrait',
    position: {
      x: (i % 10) * 430,
      y: (i / 10) * 600,
      z: 0,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
    size: {
      height: 600,
      width: 430,
    },
    animationDuration: '0.5s',
  }));

  const deckData: Deck3DProps[] = [];

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

        {cardData.map((d) => (
          <Card3D
            key={d.id}
            {...d}
            // transform={transform(
            //   translate(-215, -300, 0),
            //   translate(-offset.x, -offset.y, offset.z - perspective),
            //   rotateX(-rotate),
            //   translate(215, 300, 0)
            // )}
          />
        ))}

        {deckData.map((d) => (
          <Deck3D key={d.id} {...d} />
        ))}
      </div>
    </div>
  );
};
