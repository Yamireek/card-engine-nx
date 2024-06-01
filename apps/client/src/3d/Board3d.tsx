import { useLoader } from '@react-three/fiber';
import { Group, Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function addShadows(scene: Group | Object3D) {
  for (const child of scene.children) {
    addShadows(child);
  }

  scene.castShadow = true;
  scene.receiveShadow = true;
}

export const Board3d = () => {
  const table = useLoader(GLTFLoader, './models/wooden-table/scene.gltf');
  const candle = useLoader(GLTFLoader, './models/candlestick/scene.gltf');

  console.log(table.scene);

  addShadows(table.scene);
  addShadows(candle.scene);

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
