import { Dimensions, Point, Point3D } from "@card-engine-nx/store";
import {
  rotateX,
  rotateY,
  rotateZ,
  scale,
  transform,
  translate,
} from "libs/ui/src/lib/3d/utils";
import { useRef, useState } from "react";

const moveKeyOffset = 16;
const zoomWheelRatio = 1.5;
const perspective = 500;

export const Test = () => {
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState<number>(1);
  const offsetZ = (1 - scale) * perspective;

  console.log(offset, offsetZ);

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      style={{
        height: "100%",
        width: "100%",
        perspective,
        transformStyle: "preserve-3d",
        boxSizing: "border-box",
        userSelect: "none",
        outline: "none",
      }}
      draggable={false}
      onMouseMove={(event) => {
        if (event.buttons) {
          event.preventDefault();
          setOffset((p) => ({
            ...p,
            x: p.x - event.movementX * scale,
            y: p.y - event.movementY * scale,
          }));
        }
      }}
      onWheel={(event) => {
        if (!containerRef.current) {
          return;
        }

        const newScale =
          event.deltaY > 0 ? scale * zoomWheelRatio : scale / zoomWheelRatio;

        const containerRect = containerRef.current.getBoundingClientRect();

        const client = {
          width: containerRect.width,
          height: containerRect.height,
        };

        const clientPoint = {
          x: event.clientX,
          y: event.clientY,
        };
        const mousePoint = { x: event.clientX, y: event.clientY };
        const boardPoint = getBoardPoint(clientPoint, client, offset, scale);
        const newMousePoint = getMousePoint(
          boardPoint,
          client,
          offset,
          newScale
        );
        const offsetX = newMousePoint.x - mousePoint.x;
        const offsetY = newMousePoint.y - mousePoint.y;

        setOffset((p) => ({
          x: p.x + offsetX * newScale,
          y: p.y + offsetY * newScale,
        }));
        setScale(newScale);
      }}
      onKeyDown={(event) => {
        switch (event.key) {
          case "w":
            setOffset((p) => ({ ...p, x: p.x, y: p.y + moveKeyOffset }));
            break;
          case "s":
            setOffset((p) => ({ ...p, x: p.x, y: p.y - moveKeyOffset }));
            break;
          case "a":
            setOffset((p) => ({ ...p, x: p.x + moveKeyOffset, y: p.y }));
            break;
          case "d":
            setOffset((p) => ({ ...p, x: p.x - moveKeyOffset, y: p.y }));
            break;
        }
      }}
    >
      <div
        id="scene"
        style={{
          transformOrigin: "top left",
          transform: transform(
            rotateX(5),
            translate(-offset.x, -offset.y, offsetZ),
            rotateZ(45)
          ),
          transformStyle: "preserve-3d",
        }}
      >
        <img src="https://i.redd.it/6vmw0nvgbig51.png" alt="" />

        <img
          style={{
            width: 64,
            height: 64,
            position: "absolute",
            top: 0,
            left: 0,
            transform: transform(
              translate(-32, -32, 0),
              rotateZ(-45),
              translate(offset.x, offset.y, -offsetZ),
              rotateX(-5),
              translate(32, 32, 0)
            ),
          }}
          src="https://i.redd.it/6vmw0nvgbig51.png"
          alt=""
        />
      </div>
    </div>
  );
};

export function getBoardPoint(
  mouse: Point,
  client: Dimensions,
  offset: Point,
  scale: number
): Point {
  const ratio = scale / 2 - 0.5;
  return {
    x: mouse.x * scale - client.width * ratio - offset.x,
    y: mouse.y * scale - client.height * ratio - offset.y,
  };
}

export function getMousePoint(
  board: Point,
  client: Dimensions,
  offset: Point,
  scale: number
): Point {
  const ratio = scale / 2 - 0.5;
  return {
    x: (board.x + client.width * ratio + offset.x) / scale,
    y: (board.y + client.height * ratio + offset.y) / scale,
  };
}
