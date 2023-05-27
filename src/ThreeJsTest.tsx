import { Canvas } from '@react-three/fiber';
import Cylinder3d from './Cylinder3d';
import { Stats, MapControls } from '@react-three/drei';
import { useMeasure } from 'react-use';
import { Dimensions } from '@card-engine-nx/store';

const near = Number.EPSILON;
const far = Number.MAX_SAFE_INTEGER;

function calculateFov(width: number, distance: number) {
  return 2 * Math.atan((width / distance) * 2) * (180 / Math.PI);
}

export const ThreeJsAutosized = () => {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      {width > 300 ? <ThreeJsTest size={{ width, height }} /> : null}
    </div>
  );
};

export function ThreeJsTest(props: { size: Dimensions }) {
  const perspective = 1024;
  const width = props.size.width;
  const height = props.size.height;
  const zoom = (width / height) * 4;
  const fov = calculateFov(width, perspective);

  return (
    <Canvas
      style={{ width, height }}
      camera={{
        position: [0, 0, perspective],
        up: [0, 0, 1],
        fov,
        near,
        far,
        zoom,
      }}
      frameloop="demand"
    >
      <MapControls />
      <ambientLight />
      <Cylinder3d />
      <axesHelper args={[1024]} />
      {/* <gridHelper
        args={[1024, 64, 'red', 'black']}
        rotation={[-Math.PI / 2, 0, 0]}
      /> */}
      <Stats />
    </Canvas>
  );
}
