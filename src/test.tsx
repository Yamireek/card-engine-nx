import { Dimensions, Point, Point3D } from '@card-engine-nx/store';
import ReactDOM from 'react-dom/client';
import { ProjectionCalculator2d } from 'projection-3d-2d';
import {
  applyPerspective,
  createUnprojectFunction,
  createTransformFunctions,
} from '@card-engine-nx/ui';

const perspective = 1000;
const scale = 2;
const width = 800;
const height = 600;
const angle = 45;
const rotation = 20;
const offset = { x: 100, y: 150 };

const offsetZ = (1 - scale) * perspective;

const matrix2 = new DOMMatrix()
  .translate(width / 2, height / 2)
  .translate(0, 0, offsetZ)
  .rotate(angle, 0, 0)
  .translate(-offset.x, -offset.y, 0)
  .rotate(rotation)
  .translate(-width / 2, -height / 2);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

//const f = createUnprojectFunction(matrix1, { width, height });
const f = createTransformFunctions(
  { width, height },
  perspective,
  scale,
  angle,
  rotation,
  offset
);

root.render(
  <div
    style={{
      width,
      height,
      border: '1px solid black',
      marginLeft: 0,
      marginTop: 0,
      perspective,
    }}
    onMouseMove={(e) => {
      const point = {
        x: e.clientX,
        y: e.clientY,
      };

      console.log(f(point));
    }}
  >
    <div
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: 'blue',
        transformOrigin: 'top left',
        transform: matrix2.toString(),
        transition: 'all 1s',
      }}
    ></div>
  </div>
);
