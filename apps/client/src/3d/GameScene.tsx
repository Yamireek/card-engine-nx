import { Tooltip } from '@mui/material';
import {
  Environment,
  MapControls,
  Stats,
  Text } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Perf } from 'r3f-perf';
import { Suspense, useContext } from 'react';
import { useMeasure } from 'react-use';
import * as THREE from 'three';
import { Dimensions, LoadingDialog } from '@card-engine-nx/ui';
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

export const Test = () => {
  return (
    <Text rotation={[-Math.PI / 2, 0, 0]} scale={[0.05, 0.05, 0.05]}>
      Loading...
    </Text>
  );
};

export const GameScene = (
  props: React.PropsWithChildren<GameSceneProps & { size: Dimensions }>
) => {
  const width = props.size.width;
  const height = props.size.height;

  return (
    <Suspense fallback={<LoadingDialog />}>
      <Canvas
        style={{ width, height }}
        camera={{
          position: [0, 0.35, 0],
        }}
        frameloop="demand"
        shadows
        gl={{
          antialias: true,
          shadowMapType: THREE.PCFSoftShadowMap,
          toneMappingExposure: Math.pow(0.7, 5.0),
        }}
        linear={false}
      >
        <Environment background preset="apartment" />
        <Lights />
        {props.children}
        <MapControls />
        {props.debug && <Debug />}
      </Canvas>
    </Suspense>
  );
};

const Lights = () => {
  return (
    <pointLight
      position={[-6, 5, 5]}
      castShadow
      power={150}
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
    />
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
