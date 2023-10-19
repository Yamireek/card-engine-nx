import { Canvas } from '@react-three/fiber';
import { MapControls, Stats } from '@react-three/drei';
import { NoToneMapping } from 'three';
import * as THREE from 'three';
import { Perf } from 'r3f-perf';
import { Dimensions } from '@card-engine-nx/ui';
import { useMeasure } from 'react-use';

const near = 0.01;
const far = 50000;
const perspective = 3000;

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

export const GameScene = (
  props: React.PropsWithChildren<GameSceneProps & { size: Dimensions }>
) => {
  const width = props.size.width;
  const height = props.size.height;
  const aspect = width / height;
  const fov = calculateFov(height, perspective);

  return (
    <Canvas
      style={{ width, height }}
      camera={{
        position: [0, 0, 1.2],
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

const Lights = () => {
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

const Debug = () => {
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

function calculateFov(height: number, perspective: number) {
  return 2 * Math.atan(height / 2 / perspective) * (180 / Math.PI);
}
