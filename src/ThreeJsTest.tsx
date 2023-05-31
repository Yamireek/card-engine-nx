import { Canvas } from '@react-three/fiber';
import { Stats, MapControls } from '@react-three/drei';
import { useMeasure } from 'react-use';
import { Dimensions } from '@card-engine-nx/store';
import { NoToneMapping } from 'three';
import * as THREE from 'three';
import { Perf } from 'r3f-perf';

const near = 0.01;
const far = 50000;

function calculateFov(height: number, perspective: number) {
  return 2 * Math.atan(height / 2 / perspective) * (180 / Math.PI);
}

export type GameSceneProps = React.PropsWithChildren<{
  debug?: boolean;
  angle: number;
  rotation: number;
  perspective: number;
}>;

export const GameSceneLoader = (props: GameSceneProps) => {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      {width > 300 ? (
        <GameScene size={{ width, height }} {...props}>
          {props.children}
        </GameScene>
      ) : null}
    </div>
  );
};

export const Lights = () => {
  return (
    <>
      <pointLight
        position={[-2, 1, 4]}
        castShadow
        intensity={4}
        distance={10}
      />
      <directionalLight position={[-1, -1, 5]} intensity={0.2} />
    </>
  );
};

export const Debug = () => {
  return (
    <>
      <axesHelper args={[1024]} />
      <gridHelper
        args={[2, 20, 'red', 'black']}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <Perf matrixUpdate deepAnalyze overClock />
      <Stats />
    </>
  );
};

export const GameScene = (
  props: React.PropsWithChildren<GameSceneProps & { size: Dimensions }>
) => {
  const perspective = 3000;
  const width = props.size.width;
  const height = props.size.height;
  const aspect = width / height;
  const fov = calculateFov(height, perspective);

  return (
    <Canvas
      style={{ width, height }}
      camera={{
        position: [0, 0, 2],
        up: [0, 0, 1],
        fov,
        near,
        far,
        aspect,
      }}
      frameloop="always"
      shadows
      gl={{
        antialias: true,
        toneMapping: NoToneMapping,
        shadowMapType: THREE.PCFSoftShadowMap,
      }}
      linear={false}
    >
      <Lights />
      {props.children}
      <MapControls />
      {props.debug && <Debug />}
    </Canvas>
  );
};
