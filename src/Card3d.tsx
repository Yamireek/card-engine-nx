import { useTexture } from '@react-three/drei';
import { image } from '@card-engine-nx/ui';
//import { useSpring } from 'react-spring';

export type Card3dProps = {};

export const Card3d = (props: Card3dProps) => {
  const texture = useTexture({
    front: image.aragorn,
    back: image.playerBack,
    roughness: './textures/wood-2k/Wood026_2K_Roughness.png',
    normal: './textures/wood-2k/Wood026_2K_NormalGL.png',
  });

  return (
    <mesh position={[0, 0, 0.02]} rotation={[0, 0, 0]} castShadow>
      <boxGeometry args={[0.0635, 0.0889, 0.000305]} />
      <meshPhysicalMaterial
        map={texture.front}
        roughnessMap={texture.roughness}
        normalMap={texture.normal}
      />
      {/* <meshBasicMaterial attach="material-0" color="gray" />
      <meshBasicMaterial attach="material-1" color="gray" />
      <meshBasicMaterial attach="material-2" color="gray" />
      <meshBasicMaterial attach="material-3" color="gray" />
      <meshPhysicalMaterial
        attach="material-4"
        map={texture.front}
        roughnessMap={texture.roughness}
        normalMap={texture.normal}
      />
      <meshPhysicalMaterial
        attach="material-5"
        map={texture.back}
        roughnessMap={texture.roughness}
        normalMap={texture.normal}
      /> */}
    </mesh>
  );
};
