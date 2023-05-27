import { Canvas } from '@react-three/fiber';
import Cylinder3d from './Cylinder3d';
import { Stats, MapControls } from '@react-three/drei';
import { useMeasure } from 'react-use';
import { Dimensions } from '@card-engine-nx/store';
import { NoToneMapping } from 'three';
import * as THREE from 'three';

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
      gl={{ antialias: false, toneMapping: NoToneMapping }}
    >
      <MapControls panSpeed={0.25} />
      <Cylinder3d />
      <directionalLight position={[200, 200, 1]} intensity={100} />
      <pointLight position={[-1000, -100, 200]} intensity={2} />
      <axesHelper args={[1024]} />
      <gridHelper
        args={[10000, 100, 'red', 'black']}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <Stats />
    </Canvas>
  );
}
