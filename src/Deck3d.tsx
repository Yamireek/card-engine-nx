import { useTexture } from '@react-three/drei';
import { Texture } from 'three';
import {
  GameZoneType,
  Orientation,
  PlayerId,
  PlayerZoneType,
} from '@card-engine-nx/basic';
import { cardSize } from './Card3d';
import { Vector3 } from '@card-engine-nx/ui';

export type Deck3dProps = {
  owner: 'game' | PlayerId;
  type: GameZoneType | PlayerZoneType;
  position: Vector3;
  texture: Texture;
  cardCount: number;
  orientation?: Orientation;
};

export const Deck3d = (props: Deck3dProps) => {
  const texture = useTexture({
    roughness: './textures/wood-2k/Wood026_2K_Roughness.png',
    normal: './textures/wood-2k/Wood026_2K_NormalGL.png',
  });

  const depth = props.cardCount * cardSize.depth;

  return (
    <mesh
      key={props.cardCount > 0 ? 'cards' : 'empty'}
      name={`deck-${props.owner}-${props.type}`}
      position={[
        props.position[0],
        props.position[1],
        props.cardCount > 0 ? depth / 2 : 0.0001,
      ]}
      castShadow={props.cardCount > 0}
    >
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
          <meshPhysicalMaterial
            attach="material-4"
            map={props.texture}
            roughnessMap={texture.roughness}
            normalMap={texture.normal}
          />
          <meshPhysicalMaterial
            attach="material-5"
            map={props.texture}
            roughnessMap={texture.roughness}
            normalMap={texture.normal}
          />
        </>
      ) : (
        <>
          <planeGeometry args={[cardSize.width, cardSize.height, 1, 1]} />
          <meshBasicMaterial color="white" opacity={0.2} transparent />
        </>
      )}
    </mesh>
  );
};
