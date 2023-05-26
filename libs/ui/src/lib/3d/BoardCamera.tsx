import { Dimensions, Point, Point3D } from '@card-engine-nx/store';
import { PropsWithChildren, useMemo, useState } from 'react';
import { useMeasure } from 'react-use';
import { createUnprojectFunction, createTransformFunctions } from './utils';

const moveKeyOffset = 16;
const zoomWheelRatio = 1.5;

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Line {
  point1: Point3D;
  point2: Point3D;
}

interface Plane {
  point1: Point3D;
  point2: Point3D;
  point3: Point3D;
}

function findIntersection(plane: Plane, line: Line): Point3D | null {
  const planeNormal = calculatePlaneNormal(plane);
  const lineDirection = calculateLineDirection(line);

  // Check if the line is parallel to the plane
  if (areParallel(planeNormal, lineDirection)) {
    return null; // No intersection, line is parallel to the plane
  }

  const planePoint = plane.point1;
  const linePoint = line.point1;
  const planeDistance = calculatePlaneDistance(planeNormal, planePoint);
  const lineDistance = calculateLineDistance(lineDirection, linePoint);

  const t =
    (planeDistance - dotProduct(planeNormal, linePoint)) /
    dotProduct(planeNormal, lineDirection);

  const intersectionPoint: Point3D = {
    x: linePoint.x + t * lineDirection.x,
    y: linePoint.y + t * lineDirection.y,
    z: linePoint.z + t * lineDirection.z,
  };

  return intersectionPoint;
}

function calculatePlaneNormal(plane: Plane): Point3D {
  const vector1: Point3D = {
    x: plane.point2.x - plane.point1.x,
    y: plane.point2.y - plane.point1.y,
    z: plane.point2.z - plane.point1.z,
  };

  const vector2: Point3D = {
    x: plane.point3.x - plane.point1.x,
    y: plane.point3.y - plane.point1.y,
    z: plane.point3.z - plane.point1.z,
  };

  // Calculate the cross product of the two vectors to get the plane normal
  const normal: Point3D = {
    x: vector1.y * vector2.z - vector1.z * vector2.y,
    y: vector1.z * vector2.x - vector1.x * vector2.z,
    z: vector1.x * vector2.y - vector1.y * vector2.x,
  };

  return normal;
}

function calculateLineDirection(line: Line): Point3D {
  return {
    x: line.point2.x - line.point1.x,
    y: line.point2.y - line.point1.y,
    z: line.point2.z - line.point1.z,
  };
}

function areParallel(vector1: Point3D, vector2: Point3D): boolean {
  // Check if the cross product of the two vectors is zero, indicating parallelism
  return (
    vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z === 0
  );
}

function calculatePlaneDistance(
  planeNormal: Point3D,
  planePoint: Point3D
): number {
  // Use the dot product to calculate the distance from the origin to the plane
  return (
    planeNormal.x * planePoint.x +
    planeNormal.y * planePoint.y +
    planeNormal.z * planePoint.z
  );
}

function calculateLineDistance(
  lineDirection: Point3D,
  linePoint: Point3D
): number {
  // Use the dot product to calculate the distance from the origin to the line
  return (
    lineDirection.x * linePoint.x +
    lineDirection.y * linePoint.y +
    lineDirection.z * linePoint.z
  );
}

function dotProduct(vector1: Point3D, vector2: Point3D): number {
  return vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z;
}

// Example usage:
const plane: Plane = {
  point1: { x: 1, y: 1, z: 1 },
  point2: { x: 2, y: 2, z: 2 },
  point3: { x: 3, y: 3, z: 3 },
};

const line: Line = {
  point1: { x: 0, y: 0, z: 0 },
  point2: { x: 1, y: 1, z: 1 },
};

const intersection = findIntersection(plane, line);

if (intersection) {
  console.log('Intersection point:', intersection);
} else {
  console.log('No intersection found.');
}

function transformPoint(matrix: DOMMatrix, point: Point3D) {
  const p = matrix.transformPoint(point);
  return {
    x: p.x / p.w,
    y: p.y / p.w,
    z: p.z / p.w,
  };
}

export const BoardCamera = (
  props: PropsWithChildren<{
    angle?: number;
    rotation?: number;
    perspective?: number;
  }>
) => {
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState<number>(2);
  const [mouseDown, setMouseDown] = useState(false);
  const perspective = props.perspective ?? 2000;
  const offsetZ = (1 - scale) * perspective;
  const [ref, client] = useMeasure();
  const angle = props.angle ?? 0;
  const rotation = props.rotation ?? 0;

  const sceneMatrix = useMemo(() => {
    const base = new DOMMatrix();
    const zoomed = base.translate(0, 0, offsetZ);
    const angled = zoomed.rotate(angle, 0, 0);
    const offseted = angled.translate(-offset.x, -offset.y);
    const final = offseted.rotate(rotation);
    return { base, zoomed, angled, offseted, final };
  }, [angle, offset.x, offset.y, offsetZ, rotation]);

  const point1 = transformPoint(sceneMatrix.final, {
    x: 0,
    y: 0,
    z: 0,
  });
  const point2 = transformPoint(sceneMatrix.final, {
    x: client.width,
    y: 0,
    z: 0,
  });
  const point3 = transformPoint(sceneMatrix.final, {
    x: client.width,
    y: client.height,
    z: 0,
  });
  const point4 = transformPoint(sceneMatrix.final, {
    x: 0,
    y: client.height,
    z: 0,
  });

  console.log('point1', point1);
  console.log('point2', point2);
  console.log('point3', point3);
  console.log('point4', point4);

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
        console.log(boardPoint);
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
            setOffset((p) => ({ ...p, x: p.x, y: p.y - moveKeyOffset }));
            break;
          case 's':
            setOffset((p) => ({ ...p, x: p.x, y: p.y + moveKeyOffset }));
            break;
          case 'a':
            setOffset((p) => ({ ...p, x: p.x - moveKeyOffset, y: p.y }));
            break;
          case 'd':
            setOffset((p) => ({ ...p, x: p.x + moveKeyOffset, y: p.y }));
            break;
        }
      }}
    >
      <div
        id="scene"
        style={{
          transformOrigin: 'top left',
          transition: !mouseDown ? 'transform 0.25s' : undefined,
          transform: sceneMatrix.final.toString(),
          transformStyle: 'preserve-3d',
        }}
      >
        {/* <img
          style={{
            width: 64,
            height: 64,
            position: 'absolute',
            top: 0,
            left: 0,
            transform: new DOMMatrix()
              .translate(-32, -32)
              .multiply(sceneMatrix.final.inverse())
              .translate(32, 32)
              .toString(),
          }}
          src="https://i.redd.it/6vmw0nvgbig51.png"
          alt=""
        /> */}
        {props.children}
        {/* <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            border: '20px solid green',
            transform: new DOMMatrix()
              .translate(-client.width / 2, -client.height / 2)
              .multiply(sceneMatrix.final.inverse())
              .translate(client.width / 2, client.height / 2)
              .toString(),
            width: client.width,
            height: client.height,
          }}
        /> */}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          border: '20px solid green',
          width: client.width,
          height: client.height,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          border: '20px solid yellow',
          transform: sceneMatrix.zoomed.toString(),
          width: client.width,
          height: client.height,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          border: '20px solid red',
          transform: sceneMatrix.angled.toString(),
          width: client.width,
          height: client.height,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          border: '20px solid orange',
          transform: sceneMatrix.offseted.toString(),
          width: client.width,
          height: client.height,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          border: '20px solid blue',
          transform: sceneMatrix.final.toString(),
          width: client.width,
          height: client.height,
        }}
      />
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
