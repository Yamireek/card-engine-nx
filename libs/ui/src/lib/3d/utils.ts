import { Dimensions, Point, Point3D } from '@card-engine-nx/store';
import { ProjectionCalculator2d } from 'projection-3d-2d';

export function translate(x: number, y: number, z: number) {
  return `translate3d(${x}px, ${y}px, ${z}px)`;
}

export function rotate(x: number, y: number, z: number) {
  return `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
}

export function rotateX(x: number) {
  return `rotateX(${x}deg)`;
}

export function rotateY(x: number) {
  return `rotateY(${x}deg)`;
}

export function rotateZ(x: number) {
  return `rotateZ(${x}deg)`;
}

export function translateZ(x: number) {
  return `translateZ(${x}px)`;
}

export function transform(...items: string[]) {
  return items.join(' ');
}

export function scale(amount: number) {
  return `scale(${amount})`;
}

export function transformPoint(matrix: DOMMatrix, point: Point3D) {
  const t = matrix.transformPoint(point);
  return {
    x: t.x / t.w,
    y: t.y / t.w,
    z: t.z / t.w,
  };
}

export function applyPerspective(matrix: DOMMatrix, perspective: number) {
  const m = new DOMMatrix();
  m.m34 = -1 / perspective;
  return matrix.multiply(m);
}

export function createTransformFunctions(
  size: Dimensions,
  perspective: number,
  scale: number,
  angle: number,
  rotation: number,
  offset: Point
): { toBoard: (point: Point) => Point; toScreen: (point: Point) => Point } {
  const width = size.width;
  const height = size.height;
  const offsetZ = (1 - scale) * perspective;

  const matrix = applyPerspective(
    new DOMMatrix().translate(width / 2, height / 2),
    perspective
  )
    .translate(0, 0, offsetZ)
    .rotate(angle, 0, 0)
    .translate(-offset.x, -offset.y, 0)
    .rotate(rotation)
    .translate(-width / 2, -height / 2);

  const topLeft = transformPoint(matrix, { x: 0, y: 0, z: 0 });
  const topBottom = transformPoint(matrix, { x: width, y: 0, z: 0 });
  const rightLeft = transformPoint(matrix, { x: 0, y: height, z: 0 });
  const rightBottom = transformPoint(matrix, {
    x: width,
    y: height,
    z: 0,
  });

  const points3d = [
    [0, 0],
    [width, 0],
    [0, height],
    [width, height],
  ] as any;

  const points2d = [
    [topLeft.x, topLeft.y],
    [topBottom.x, topBottom.y],
    [rightLeft.x, rightLeft.y],
    [rightBottom.x, rightBottom.y],
  ] as any;

  const projectionCalculator = new ProjectionCalculator2d(points3d, points2d);

  return {
    toBoard(screen) {
      const result = projectionCalculator.getUnprojectedPoint([
        screen.x,
        screen.y,
      ]);
      return {
        x: result[0],
        y: result[1],
      };
    },
    toScreen(board) {
      const result = projectionCalculator.getProjectedPoint([
        board.x,
        board.y,
      ]);
      return {
        x: result[0],
        y: result[1],
      };
    },
  };
}

export function createUnprojectFunction(
  m: DOMMatrix,
  size: Dimensions
): (point: Point) => Point {
  const width = size.width;
  const height = size.height;

  const topLeft = transformPoint(m, { x: 0, y: 0, z: 0 });
  const topBottom = transformPoint(m, { x: width, y: 0, z: 0 });
  const rightLeft = transformPoint(m, { x: 0, y: height, z: 0 });
  const rightBottom = transformPoint(m, { x: width, y: height, z: 0 });

  const points3d = [
    [0, 0],
    [width, 0],
    [0, height],
    [width, height],
  ] as any;

  const points2d = [
    [topLeft.x, topLeft.y],
    [topBottom.x, topBottom.y],
    [rightLeft.x, rightLeft.y],
    [rightBottom.x, rightBottom.y],
  ] as any;

  const projectionCalculator = new ProjectionCalculator2d(points3d, points2d);

  return (screen) => {
    const result = projectionCalculator.getUnprojectedPoint([
      screen.x,
      screen.y,
    ]);
    return {
      x: result[0],
      y: result[1],
    };
  };
}
