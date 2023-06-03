import { useTexture } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import {
  CardTextures,
  Dimensions,
  Dimensions3,
  Vector3,
} from '@card-engine-nx/ui';

export type Card3dProps = {
  id: number;
  name: string;
  position: Vector3;
  rotation?: Vector3;
  textures: CardTextures;
  scale?: number;
  size?: Dimensions;
  hidden?: boolean;
};

export const cardSize: Dimensions3 = {
  width: 0.0635,
  height: 0.0889,
  depth: 0.000305,
};

export const Card3d = (props: Card3dProps) => {
  const texture = useTexture({
    roughness: './textures/wood-2k/Wood026_2K_Roughness.png',
    normal: './textures/wood-2k/Wood026_2K_NormalGL.png',
  });

  const spring = useSpring({
    scale:
      props.scale ??
      (props.size?.width ? props.size.width / cardSize.width : 1),
    x: props.position[0],
    y: props.position[1],
    z: props.position[2],
    rotX: props.rotation?.[0],
    rotY: props.rotation?.[1],
    rotZ: props.rotation?.[2],
  });

  return (
    <animated.mesh
      name={props.name}
      position-x={spring.x}
      position-y={spring.y}
      position-z={spring.z}
      scale-x={spring.scale}
      scale-y={spring.scale}
      rotation-x={spring.rotX}
      rotation-y={spring.rotY}
      rotation-z={spring.rotZ}
      castShadow
    >
      {!props.hidden && (
        <>
          <boxGeometry
            args={[cardSize.width, cardSize.height, cardSize.depth]}
          />
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
        </>
      )}
    </animated.mesh>
  );
};
