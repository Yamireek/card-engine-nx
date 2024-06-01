import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const Board3d = () => {
  const table = useLoader(GLTFLoader, './models/wooden-table/scene.gltf');
  const candle = useLoader(GLTFLoader, './models/candlestick/scene.gltf');

  return (
    <>
      <group rotation={[Math.PI / 2, 0, 0.005]} scale={0.2}>
        <primitive
          object={table.scene}
          position={[0, 400.876, 0]}
          scale={5}
          rotation={[0, 0, 0]}
        />
      </group>
      <group rotation={[Math.PI / 2, 0, 0.005]} position={[0.6, 0.3, 0.45]}>
        <primitive object={candle.scene} scale={0.015} rotation={[0, 0, 0]} />
      </group>
    </>
  );
};
