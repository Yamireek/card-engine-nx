import { useSpring, animated } from '@react-spring/three';
import { Text } from '@react-three/drei';
import { useContext } from 'react';
import { Texture } from 'three';
import { Orientation } from '@card-engine-nx/basic';
import {
  CardTexture,
  Dimensions,
  Dimensions3,
  Vector3,
  useTextures,
} from '@card-engine-nx/ui';
import { DetailContext } from '../game/DetailContext';

export const cardSize: Dimensions3 = {
  width: 0.0635,
  height: 0.0889,
  thick: 0.000305,
};

export type Card3dProps = React.PropsWithChildren<{
  id: number;
  name: string;
  position: Vector3;
  rotation?: Vector3;
  texture: CardTexture;
  size?: Dimensions;
  hidden?: boolean;
  orientation?: Orientation;
  onClick?: () => void;
  showId?: boolean;
}>;

export const Card3d = (props: Card3dProps) => {
  const { material } = useTextures();
  const detail = useContext(DetailContext);

  const spring = useSpring({
    scale: props.size?.width ? props.size.width / cardSize.width : 1,
    x: props.position[0],
    y: props.position[1],
    z: props.position[2],
    rotX: props.rotation?.[0],
    rotY: props.rotation?.[1],
    rotZ: props.rotation?.[2],
  });

  return (
    <animated.group
      name={props.name}
      position-x={spring.x}
      position-y={spring.y}
      position-z={spring.z}
      scale-x={spring.scale}
      scale-y={spring.scale}
      rotation-x={spring.rotX}
      rotation-y={spring.rotY}
      rotation-z={spring.rotZ}
    >
      <mesh
        castShadow
        onClick={props.onClick}
        onPointerEnter={() => detail.setDetail(props.id)}
        onPointerLeave={() => detail.setDetail(undefined)}
      >
        {!props.hidden && (
          <>
            <boxGeometry
              args={
                props.orientation === 'landscape'
                  ? [cardSize.height, cardSize.width, cardSize.thick]
                  : [cardSize.width, cardSize.height, cardSize.thick]
              }
            />
            <meshBasicMaterial attach="material-0" color="gray" />
            <meshBasicMaterial attach="material-1" color="gray" />
            <meshBasicMaterial attach="material-2" color="gray" />
            <meshBasicMaterial attach="material-3" color="gray" />
            <meshPhysicalMaterial
              attach="material-4"
              map={
                props.texture instanceof Texture
                  ? props.texture
                  : props.texture.front
              }
              roughnessMap={material.wood.roughness}
              normalMap={material.wood.normal}
            />
            <meshPhysicalMaterial
              attach="material-5"
              map={
                props.texture instanceof Texture
                  ? props.texture
                  : props.texture.back
              }
              roughnessMap={material.wood.roughness}
              normalMap={material.wood.normal}
            />
          </>
        )}
      </mesh>
      {!props.hidden && props.children}
      {props.showId && (
        <Text
          position={[0, 0, 0.001]}
          color="black"
          outlineColor="white"
          outlineWidth={0.0005}
          fontSize={0.025}
        >
          {props.id}
        </Text>
      )}
    </animated.group>
  );
};
