import { useTexture } from '@react-three/drei';
import { image } from '@card-engine-nx/ui';
import { Mesh, Texture } from 'three';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Dimensions } from '@card-engine-nx/store';
import { useSpring, animated } from '@react-spring/three';
//import { useSpring } from 'react-spring';

export type Vector2 = [number, number];

export type Vector3 = [number, number, number];

export type CardTextures = { front: Texture; back: Texture };

export type Card3dProps = {
  position: Vector3;
  textures: CardTextures;
  size?: Dimensions;
};

export const cardSize: Dimensions = {
  width: 0.0635,
  height: 0.0889,
};

export const Card3d = (props: Card3dProps) => {
  const texture = useTexture({
    roughness: './textures/wood-2k/Wood026_2K_Roughness.png',
    normal: './textures/wood-2k/Wood026_2K_NormalGL.png',
  });

  const spring = useSpring({
    scale: props.size?.width ? props.size.width / cardSize.width : 1,
    x: props.position[0],
    y: props.position[1],
    z: props.position[2],
  });

  return (
    <animated.mesh
      position-x={spring.x}
      position-y={spring.y}
      position-z={spring.z}
      scale-x={spring.scale}
      scale-y={spring.scale}
      rotation={[0, 0, 0]}
      castShadow
    >
      <boxGeometry args={[cardSize.width, cardSize.height, 0.000305]} />
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
    </animated.mesh>
  );
};
