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

function Polyhedron(props) {
  const ref = useRef();

  useFrame((_, delta) => {
    ref.current.rotation.x += 0.2 * delta;
    ref.current.rotation.y += 0.05 * delta;
  });

  return (
    <mesh {...props} ref={ref} castShadow receiveShadow>
      <icosahedronGeometry args={[2, 2]} />
    </mesh>
  );
}

export function ThreeJsTest2(props: { size: Dimensions }) {
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
      shadows
    >
      <MapControls panSpeed={0.25} />
      {/* <Cylinder3d /> */}
      {/* <ambientLight /> */}
      <directionalLight position={[200, 200, 1]} intensity={100} castShadow />
      {/* <pointLight position={[1000, 100, 200]} intensity={5} /> */}
      <axesHelper args={[1024]} />
      <gridHelper
        args={[10000, 100, 'red', 'black']}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <Stats />
    </Canvas>
  );
}

export function ThreeJsTest() {
  return (
    <Canvas camera={{ position: [4, 100, 0] }} shadows>
      <pointLight position={[0, 100, 0]} castShadow intensity={5} />
      <Cylinder3d />
      <OrbitControls target={[2, 2, 0]} />
      <axesHelper args={[5]} />
      <Stats />
    </Canvas>
  );
}
