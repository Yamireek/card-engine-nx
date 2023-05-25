import { Dimensions, Point } from '@card-engine-nx/store';
import { rotateX, rotateZ, transform, translate } from './utils';
import { PropsWithChildren, useState } from 'react';
import { useMeasure } from 'react-use';

const moveKeyOffset = 16;
const zoomWheelRatio = 1.5;

export const BoardCamera = (
  props: PropsWithChildren<{
    angle?: number;
    rotation?: number;
    perspective?: number;
  }>
) => {
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState<number>(1);
  const [mouseDown, setMouseDown] = useState(false);
  const perspective = props.perspective ?? 2000;
  const offsetZ = (1 - scale) * perspective;
  const [ref, client] = useMeasure();
  const angle = props.angle ?? 0;
  const rotation = props.rotation ?? 0;

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      tabIndex={0}
      style={{
        height: '100%',
        width: '100%',
        perspective,
        transformStyle: 'preserve-3d',
        boxSizing: 'border-box',
        userSelect: 'none',
        outline: 'none',
        overflow: 'hidden',
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
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => setMouseDown(false)}
      onWheel={(event) => {
        const newScale =
          event.deltaY > 0 ? scale * zoomWheelRatio : scale / zoomWheelRatio;

        if (newScale < 1) {
          return;
        }

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
          case 'w':
            setOffset((p) => ({ ...p, x: p.x, y: p.y + moveKeyOffset }));
            break;
          case 's':
            setOffset((p) => ({ ...p, x: p.x, y: p.y - moveKeyOffset }));
            break;
          case 'a':
            setOffset((p) => ({ ...p, x: p.x + moveKeyOffset, y: p.y }));
            break;
          case 'd':
            setOffset((p) => ({ ...p, x: p.x - moveKeyOffset, y: p.y }));
            break;
        }
      }}
    >
      <div
        id="scene"
        style={{
          transformOrigin: 'top left',
          transition: !mouseDown ? 'transform 0.25s' : undefined,
          transform: transform(
            translate(0, 0, offsetZ),
            rotateX(angle),
            translate(-offset.x, -offset.y, 0),
            rotateZ(rotation)
          ),
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          style={{
            width: 64,
            height: 64,
            position: 'absolute',
            top: 0,
            left: 0,
            transform: transform(
              translate(-32, -32, 0),
              rotateZ(-rotation),
              translate(offset.x, offset.y, 0),
              rotateX(-angle),
              translate(0, 0, -offsetZ),
              translate(32, 32, 0)
            ),
          }}
          src="https://i.redd.it/6vmw0nvgbig51.png"
          alt=""
        />
        {props.children}
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
