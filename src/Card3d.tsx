import { useTexture } from '@react-three/drei';
import { image } from '@card-engine-nx/ui';
import { Mesh, Texture } from 'three';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
//import { useSpring } from 'react-spring';

export type Vector2 = [number, number];

export type Vector3 = [number, number, number];

export type CardTextures = { front: Texture; back: Texture };

export type Card3dProps = {
  position: Vector3;
  textures: CardTextures;
};

export const Card3d = (props: Card3dProps) => {
  const texture = useTexture({
    roughness: './textures/wood-2k/Wood026_2K_Roughness.png',
    normal: './textures/wood-2k/Wood026_2K_NormalGL.png',
  });

  return (
    <mesh position={props.position} rotation={[0, 0, 0]} castShadow>
      <boxGeometry args={[0.0635, 0.0889, 0.000305]} />
      <meshBasicMaterial attach="material-0" color="gray" />
      <meshBasicMaterial attach="material-1" color="gray" />
      <meshBasicMaterial attach="material-2" color="gray" />
      <meshBasicMaterial attach="material-3" color="gray" />
      <meshPhysicalMaterial
        attach="material-4"
        map={props.textures.front}
        roughnessMap={texture.roughness}
        normalMap={texture.normal}
      />
      <meshPhysicalMaterial
        attach="material-5"
        map={props.textures.back}
        roughnessMap={texture.roughness}
        normalMap={texture.normal}
      />
      {/* <meshPhysicalMaterial
        map={props.textures.front}
        roughnessMap={texture.roughness}
        normalMap={texture.normal}
      />
      <meshBasicMaterial color="gray" />
      <meshBasicMaterial color="gray" />
      <meshBasicMaterial color="gray" />
      <meshBasicMaterial color="gray" />
      <meshPhysicalMaterial
        map={props.textures.front}
        roughnessMap={texture.roughness}
        normalMap={texture.normal}
      /> */}
      {/* <meshPhysicalMaterial attach="material" />
      <meshBasicMaterial attach="material-0" color="gray" />
      <meshBasicMaterial attach="material-1" color="gray" />
      <meshBasicMaterial attach="material-2" color="gray" />
      <meshBasicMaterial attach="material-3" color="gray" />
      <meshPhysicalMaterial
        attach="material-4"
        map={props.textures.front}
        roughnessMap={texture.roughness}
        normalMap={texture.normal}
      />
      <meshPhysicalMaterial
        attach="material-5"
        map={props.textures.back}
        roughnessMap={texture.roughness}
        normalMap={texture.normal}
      /> */}
    </mesh>
  );
};
