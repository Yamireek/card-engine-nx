import { Tooltip } from '@mui/material';
import { Environment, MapControls, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Perf } from 'r3f-perf';
import { useContext } from 'react';
import { useMeasure } from 'react-use';
import { NoToneMapping } from 'three';
import * as THREE from 'three';
import { Dimensions } from '@card-engine-nx/ui';
import { CardDetail } from '../game/CardDetail';
import { DetailContext } from '../game/DetailContext';

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
      frameloop="demand"
      shadows
      gl={{
        antialias: true,
        toneMapping: NoToneMapping,
        shadowMapType: THREE.PCFSoftShadowMap,
      }}
      linear={false}
    >
      {/* <Environment  background preset="apartment" /> */}
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
        distance={100000}
      />
      {/* <directionalLight castShadow position={[3, 3, 1]} intensity={1} /> */}
    </>
  );
};

const Debug = () => {
  return (
    <>
      <axesHelper args={[1024]} />
      <gridHelper args={[2, 20, 'red', 'black']} rotation={[0, 0, 0]} />
      <Perf matrixUpdate deepAnalyze overClock />
      <Stats />
    </>
  );
};
