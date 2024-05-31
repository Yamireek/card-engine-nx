import { Canvas } from '@react-three/fiber';
import { Environment, MapControls, Stats } from '@react-three/drei';
import { NoToneMapping } from 'three';
import * as THREE from 'three';
import { Perf } from 'r3f-perf';
import { Dimensions } from '@card-engine-nx/ui';
import { useMeasure } from 'react-use';
import { Tooltip } from '@mui/material';
import { CardDetail } from './CardDetail';
import { useContext } from 'react';
import { DetailContext } from './DetailContext';

export type GameSceneProps = React.PropsWithChildren<{
  debug?: boolean;
  angle: number;
  rotation: number;
  perspective: number;
}>;

export const GameSceneLoader = (props: GameSceneProps) => {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();
  const { cardId } = useContext(DetailContext);

  return (
    <Tooltip title={cardId ? <CardDetail /> : null} followCursor>
      <div ref={ref} style={{ width: '100%', height: '100%' }}>
        {width > 300 ? (
          <GameScene size={{ width, height }} {...props}>
            {props.children}
          </GameScene>
        ) : null}
      </div>
    </Tooltip>
  );
};

export const GameScene = (
  props: React.PropsWithChildren<GameSceneProps & { size: Dimensions }>
) => {
  const width = props.size.width;
  const height = props.size.height;

  return (
    <Canvas
      style={{ width, height }}
      camera={{
        position: [0, 0.35, 0],
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
      <Environment background preset="apartment" />
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
        intensity={1}
        distance={10}
      />
      <directionalLight position={[-1, -1, 5]} intensity={2} />
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
