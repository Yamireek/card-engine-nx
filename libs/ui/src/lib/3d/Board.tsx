import { useMemo, useState } from "react";
import { Point3D } from "../../../../store/src/types";
import { Deck3D, Deck3DProps } from "./Deck3D";
import { Card3D, Card3DProps } from "./Card3D";
import { cardImages } from "./../storybook/cardImages";
import boardImage from "./../../images/board.jpg";
import { BoardModel, CardModel, ZoneModel } from "@card-engine-nx/store";
import { transform, translate } from "./utils";
import { Observer } from "mobx-react";

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
    x: -560,
    y: -290,
    z: perspective,
  });

  console.log(offset);

  const board = useMemo(
    () =>
      new BoardModel({
        height: props.height,
        width: props.width,
        zones: [
          new ZoneModel({
            cards: Array.from(Array(50).keys()).map(
              (i) =>
                new CardModel({
                  id: i.toString(),
                  images: {
                    front: cardImages[0],
                    back: cardImages[1],
                  },
                  orientation: "portrait",
                  rotation: {
                    x: 0,
                    y: 0,
                    z: 0,
                  },
                  attachments: [],
                })
            ),
            location: { x: 0, y: 0 },
            size: { width: 1000, height: 1000 },
            orientation: "portrait",
          }),
          new ZoneModel({
            cards: [],
            location: { x: 1100, y: 0 },
            size: { width: 1000, height: 1000 },
            orientation: "portrait",
          }),
        ],
        decks: [],
      }),
    [props.height, props.width]
  );

  const moveOffset = (perspective - offset.z) / perspective;

  const deckData: Deck3DProps[] = [];

  return (
    <div
      id="viewport"
      style={{
        transformStyle: "preserve-3d",
        boxSizing: "border-box",
        width: "100%",
        height: "100%",
        perspective,
        overflow: "hidden",
        userSelect: "none",
        outline: "none",
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
          case "w":
            setTranslate((p) => ({ ...p, x: p.x, y: p.y - moveOffset * 10 }));
            break;
          case "s":
            setTranslate((p) => ({ ...p, x: p.x, y: p.y + moveOffset * 10 }));
            break;
          case "a":
            setTranslate((p) => ({ ...p, x: p.x - moveOffset * 10, y: p.y }));
            break;
          case "d":
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
        Test
      </button>
      <div
        id="scene"
        style={{
          width: props.width,
          height: props.height,
          transformOrigin: "top left",
          transform: `
            rotateX(${rotate}deg)
            translate3d(${offset.x}px, ${offset.y}px, ${-(
            offset.z - perspective
          )}px)`,
          transformStyle: "preserve-3d",
        }}
      >
        <img
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
          src={props.imageUrl ?? boardImage}
          alt=""
        />

        <Observer>
          {() => (
            <>
              {board.zones.map((z) => (
                <div
                  style={{
                    position: "absolute",
                    backgroundColor: "green",
                    width: z.size.width,
                    height: z.size.height,
                    transform: transform(
                      translate(z.location.x, z.location.y, 0)
                    ),
                  }}
                />
              ))}

              {board.cards.map((d) => (
                <Card3D
                  key={d.id}
                  id={d.id}
                  image={d.images}
                  orientation={d.orientation}
                  position={d.position}
                  rotation={d.rotation}
                  size={d.size}
                  // transform={transform(
                  //   translate(-215, -300, 0),
                  //   translate(-offset.x, -offset.y, offset.z - perspective),
                  //   rotateX(-rotate),
                  //   translate(215, 300, 0)
                  // )}
                />
              ))}
            </>
          )}
        </Observer>

        {deckData.map((d) => (
          <Deck3D key={d.id} {...d} />
        ))}
      </div>
    </div>
  );
};
