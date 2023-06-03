import { Vector2 } from '@card-engine-nx/ui';
import { Texture } from 'three';
import { Text } from '@react-three/drei';

const tokenHeight = 0.002;

export const Token3d = (props: {
  position: Vector2;
  texture: Texture;
  amount: number;
}) => {
  if (props.amount === 0) {
    return null;
  }

  return (
    <group
      rotation={[Math.PI / 2, 0, 0]}
      position={[
        props.position[0],
        props.position[1],
        (tokenHeight * props.amount) / 2,
      ]}
    >
      <mesh>
        <cylinderBufferGeometry
          attach="geometry"
          args={[0.007, 0.007, tokenHeight * props.amount]}
        />
        <meshStandardMaterial attach="material-0" color="gray" />
        <meshStandardMaterial attach="material-1" map={props.texture} />
      </mesh>
      <Text
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, (tokenHeight * props.amount) / 2 + 0.0001, 0]}
        color="black"
        outlineColor="white"
        outlineWidth={0.0005}
        fontSize={0.007}
      >
        {props.amount}
      </Text>
    </group>
  );
};
