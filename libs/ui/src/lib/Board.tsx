import { useEffect, useState } from 'react';
import { CardDisplay } from './CardDisplay';
import './style.css';
import { cardImages } from './HandLayout.stories';
import boardImage from './../images/board.jpg';
import { useMeasure } from 'react-use';

type CardState = {
  id: number;
  x: number;
  y: number;
  image: string;
  originX: number;
  originY: number;
};

const matrix4 = `matrix3d(1,0,0,0,0,1,0,0,0,0,1,0.002,0,0,0,1)`;

export type Point = { x: number; y: number };

export const Card3D = (props: {
  current: Point;
  origin: Point;
  image: string;
  transform?: string;
  onClick?: () => void;
}) => {
  const [first, setFirst] = useState(true);

  useEffect(() => {
    setFirst(false);
  }, []);

  const x = first ? props.origin.x : props.current.x;
  const y = first ? props.origin.y : props.current.y;

  const transform = props.transform ?? `translate3d(${x}px, ${y}px, 0px)`;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        transform,
        transition: 'transform 0.5s',
        transformStyle: 'preserve-3d',
        transformOrigin: 'center bottom',
        zIndex: props.transform ? 5 : 0,
      }}
    >
      <div
        style={{
          position: 'relative',
          transition: 'transform 1s',
        }}
      >
        <CardDisplay
          height={600}
          image={props.image}
          orientation="portrait"
          onClick={props.onClick}
        />
      </div>
    </div>
  );
};

export const Board = (props: { perspective: number; rotate: number }) => {
  const [cards, setCards] = useState<Array<CardState>>([
    {
      id: 1,
      image: cardImages[0],
      originX: 0,
      originY: 0,
      x: 0,
      y: 0,
    },
    {
      id: 2,
      image: cardImages[1],
      originX: 0,
      originY: 0,
      x: 430,
      y: 600,
    },
  ]);

  const [translate, setTranslate] = useState<Point>({ x: 0, y: 0 });
  const [ref, { width, height }] = useMeasure();
  const [zoom, setZoom] = useState(1);
  const [detailCard, setDetailCard] = useState<number | undefined>();

  const detailtTransform = `
  scale(${1 / zoom})
  translate3d(${-translate.x}px, ${-translate.y}px, 0px)
  translate3d(${(width / 2 - 215) * zoom}px, ${(height - 600) * zoom}px, 0px)
  rotateX(${-props.rotate}deg)
  ${matrix4}
  translate3d(0px, ${-height / 2 + 300}px, 0px)
  `;

  return (
    <div
      ref={ref as any}
      style={{
        perspective: props.perspective,
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        outline: 'none',
        userSelect: 'none',
      }}
      tabIndex={0}
      onMouseMove={(event) => {
        if (event.buttons) {
          setTranslate((p) => ({
            x: p.x + event.movementX,
            y: p.y + event.movementY,
          }));
        }
      }}
      onWheel={(event) => {
        if (event.deltaY > 0) {
          setZoom((p) => p * 0.9);
        }

        if (event.deltaY < 0) {
          setZoom((p) => p * 1.1);
        }
      }}
      onKeyDown={(event) => {
        switch (event.key) {
          case 'w':
            setTranslate((p) => ({
              x: p.x,
              y: p.y + 10,
            }));
            break;
          case 's':
            setTranslate((p) => ({
              x: p.x,
              y: p.y - 10,
            }));
            break;
          case 'a':
            setTranslate((p) => ({
              x: p.x + 10,
              y: p.y,
            }));
            break;
          case 'd':
            setTranslate((p) => ({
              x: p.x - 10,
              y: p.y,
            }));
            break;
        }
      }}
    >
      <button
        onClick={() => {
          setCards((p) => [
            ...p,
            {
              id: p.length,
              image: cardImages[p.length],
              x: 100,
              y: 100,
              originX: 300,
              originY: 300,
            },
          ]);
        }}
      >
        add
      </button>
      <button
        onClick={() => {
          setCards((p) =>
            p.map((c) => ({ ...c, x: (c.x += 50), y: (c.y += 50) }))
          );
        }}
      >
        move
      </button>
      <div
        style={{
          height,
          width,
          transform: `rotateX(${props.rotate}deg) translate3d(${translate.x}px, ${translate.y}px, 0px) scale(${zoom})`,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center bottom',
        }}
      >
        <div
          style={{
            height: 1620,
            width: 1608,
            backgroundImage: `url(${boardImage})`,
            objectFit: 'cover',
            transform: 'scale(4) translate3d(603px, 607px, 0px)',
          }}
        />

        {cards.map((c) => (
          <Card3D
            key={c.id}
            image={c.image}
            current={{ x: c.x, y: c.y }}
            origin={{ x: c.originX, y: c.originY }}
            onClick={() =>
              setDetailCard(c.id !== detailCard ? c.id : undefined)
            }
            transform={c.id === detailCard ? detailtTransform : undefined}
          />
        ))}
      </div>
    </div>
  );
};
