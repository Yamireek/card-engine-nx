import { Text } from '@react-three/drei';
import { Texture } from 'three';
import { Orientation } from '@card-engine-nx/basic';
import { Vector3 } from '@card-engine-nx/ui';
import { cardSize } from './Card3d';

export type Deck3dProps = {
  name: string;
  title: string;
  position: Vector3;
  texture: Texture;
  cardCount: number;
  orientation?: Orientation;
};

export const Deck3d = (props: Deck3dProps) => {
  const depth = props.cardCount * cardSize.thick;

  return (
    <group
      key={props.cardCount > 0 ? 'cards' : 'empty'}
      name={props.name}
      position={[
        props.position[0],
        props.position[1],
        props.cardCount > 0 ? depth / 2 : 0.0001,
      ]}
    >
      <mesh castShadow={props.cardCount > 0}>
        {props.cardCount > 0 ? (
          <>
            <boxGeometry
              args={
                props.orientation === 'landscape'
                  ? [cardSize.height, cardSize.width, depth]
                  : [cardSize.width, cardSize.height, depth]
              }
            />
            <meshBasicMaterial attach="material-0" color="gray" />
            <meshBasicMaterial attach="material-1" color="gray" />
            <meshBasicMaterial attach="material-2" color="gray" />
            <meshBasicMaterial attach="material-3" color="gray" />
            <meshPhysicalMaterial attach="material-4" map={props.texture} />
            <meshPhysicalMaterial attach="material-5" map={props.texture} />
          </>
        ) : (
          <>
            <planeGeometry args={[cardSize.width, cardSize.height, 1, 1]} />
            <meshBasicMaterial color="white" opacity={0.2} transparent />
          </>
        )}
      </mesh>
      <Text
        position={[0, 0, depth / 2 + 0.0001]}
        color="black"
        outlineColor="white"
        outlineWidth={0.0005}
        fontSize={0.007}
      >
        {props.title} ({props.cardCount})
      </Text>
    </group>
  );
};
