import { Canvas, useFrame } from '@react-three/fiber';
import Cylinder3d from './Cylinder3d';
import { Stats, MapControls, OrbitControls } from '@react-three/drei';
import { useMeasure } from 'react-use';
import { Dimensions } from '@card-engine-nx/store';
import { NoToneMapping } from 'three';
import * as THREE from 'three';
import { useRef } from 'react';
import { useControls } from 'leva';

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
  const perspective = 3000;
  const width = props.size.width;
  const height = props.size.height;
  const zoom = width / height;
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
      shadows
    >
      <MapControls />
      <pointLight
        position={[4000, 4000, 5000]}
        castShadow
        intensity={5}
        distance={18000}
      />
      <Cylinder3d />
      {/* <axesHelper args={[1024]} />
      <gridHelper
        args={[10000, 100, 'red', 'black']}
        rotation={[-Math.PI / 2, 0, 0]}
      /> */}
      <Stats />
    </Canvas>
  );
}
