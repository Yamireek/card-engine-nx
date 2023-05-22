import { useEffect, useLayoutEffect, useState } from "react";
import { CardDisplay } from "./CardDisplay";
import "./style.css";
import { cardImages } from "./HandLayout.stories";

type CardState = {
  id: number;
  x: number;
  y: number;
  image: string;
  originX: number;
  originY: number;
};

export type Point = { x: number; y: number };

export const Card3D = (props: {
  current: Point;
  origin: Point;
  image: string;
}) => {
  const [first, setFirst] = useState(true);

  useEffect(() => {
    setFirst(false);
  }, []);

  const x = first ? props.origin.x : props.current.x;
  const y = first ? props.origin.y : props.current.y;

  const transform = `translate3d(${x}px, ${y}px, 50px)`;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        transform,
        transition: "transform 1s",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          position: "relative",
          transition: "transform 1s",
        }}
      >
        <CardDisplay height={200} image={props.image} orientation="portrait" />
      </div>
    </div>
  );
};

export const Board = (props: { perspective: number; rotate: number }) => {
  const [cards, setCards] = useState<Array<CardState>>([]);

  const [translate, setTranslate] = useState<Point>({ x: 0, y: 0 });

  return (
    <div
      style={{
        perspective: props.perspective,
        height: "95vh",
        width: "95vw",
        userSelect: "none",
        overflow: "hidden",
      }}
      onMouseMove={(event) => {
        if (event.buttons) {
          setTranslate((p) => ({
            x: p.x + event.movementX,
            y: p.y + event.movementY,
          }));
        }
      }}
      onKeyDown={(event) => {
        console.log(event);
        if (event.key === "W") {
          setTranslate((p) => ({
            x: p.x + 10,
            y: p.y,
          }));
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
          setCards((p) => p.map((c) => ({ ...c, x: c.x += 50, y: c.y += 50 })));
        }}
      >
        move
      </button>
      <div
        style={{
          height: 1610,
          width: 1608,
          backgroundImage: "url(https://i.imgur.com/sHn4yAA.jpg)",
          objectFit: "cover",
          transform: `rotateX(${props.rotate}deg) translate3d(${translate.x}px, ${translate.y}px, 0px)`,
          position: "absolute",
          top: 0,
          left: 0,
          transformStyle: "preserve-3d",
        }}
      >
        {cards.map((c) => (
          <Card3D
            key={c.id}
            image={c.image}
            current={{ x: c.x, y: c.y }}
            origin={{ x: c.originX, y: c.originY }}
          />
        ))}

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translate3d(${-translate.x}px, ${-translate.y}px, 0px) rotateX(-${
              props.rotate
            }deg)`,
            transformStyle: "flat",
            perspective: "revert",
          }}
        >
          <div
            style={{
              position: "relative",
              transition: "transform 1s",
            }}
          >
            <CardDisplay
              height={200}
              image={cardImages[0]}
              orientation="portrait"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
